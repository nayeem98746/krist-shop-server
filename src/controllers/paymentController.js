const SSLCommerzPayment = require("sslcommerz-lts");
const { getDB } = require("../config/db");

const store_id = process.env.SSL_STOR_ID;
const store_passwd = process.env.SSL_API;
const is_live = false;

const payments = () => getDB().collection("payments");

exports.getAllPayments = async (req, res) => {
  const result = await payments().find().toArray();
  res.send(result);
};

exports.initPayment = async (req, res) => {
  const {
    total_amount,
    customer_name,
    customer_email,
    customer_phone,
    customer_address,
    product_name,
    cart_items,
  } = req.body;

  const tran_id = "TXN_" + Date.now() + "_" + Math.random().toString(36).substr(2, 9);

  const data = {
    total_amount: parseFloat(total_amount),
    currency: "BDT",
    tran_id,
    success_url: `${process.env.BACKEND_URL || "http://localhost:5000"}/api/payment/success/${tran_id}`,
    fail_url: `${process.env.BACKEND_URL || "http://localhost:5000"}/api/payment/fail/${tran_id}`,
    cancel_url: `${process.env.BACKEND_URL || "http://localhost:5000"}/api/payment/cancel/${tran_id}`,
    ipn_url: `${process.env.BACKEND_URL || "http://localhost:5000"}/api/payment/ipn`,
    shipping_method: "Courier",
    product_name: product_name || "General Products",
    product_category: "general",
    product_profile: "general",
    cus_name: customer_name,
    cus_email: customer_email,
    cus_add1: customer_address,
    cus_city: "Dhaka",
    cus_state: "Dhaka",
    cus_postcode: "1000",
    cus_country: "Bangladesh",
    cus_phone: customer_phone,
    ship_name: customer_name,
    ship_add1: customer_address,
    ship_city: "Dhaka",
    ship_state: "Dhaka",
    ship_postcode: 1000,
    ship_country: "Bangladesh",
  };

  try {
    const sslcz = new SSLCommerzPayment(store_id, store_passwd, is_live);
    const apiResponse = await sslcz.init(data);

    const paymentData = {
      tran_id,
      customer_name,
      customer_email,
      customer_phone,
      customer_address,
      total_amount: parseFloat(total_amount),
      cart_items,
      status: "pending",
      payment_method: null,
      payment_date: null,
      created_at: new Date(),
    };

    await payments().insertOne(paymentData);

    res.json({
      success: true,
      GatewayPageURL: apiResponse.GatewayPageURL,
      tran_id,
    });
  } catch (error) {
    console.error("Payment initialization error:", error);
    res.status(500).json({
      success: false,
      message: "Payment initialization failed",
      error: error.message,
    });
  }
};

exports.paymentSuccess = async (req, res) => {
  const { tran_id } = req.params;
  try {
    await payments().updateOne(
      { tran_id },
      {
        $set: {
          status: "success",
          payment_method: req.body.card_type || "Unknown",
          payment_date: new Date(),
          bank_tran_id: req.body.bank_tran_id,
          card_issuer: req.body.card_issuer,
          val_id: req.body.val_id,
        },
      }
    );
    res.redirect(`${process.env.FRONTEND_URL || "http://localhost:5173"}/payment/success?tran_id=${tran_id}`);
  } catch (error) {
    console.error("Payment success error:", error);
    res.redirect(`${process.env.FRONTEND_URL || "http://localhost:5173"}/payment/fail`);
  }
};

exports.paymentFail = async (req, res) => {
  const { tran_id } = req.params;
  try {
    await payments().updateOne(
      { tran_id },
      {
        $set: {
          status: "failed",
          fail_reason: req.body.error || "Payment failed",
          updated_at: new Date(),
        },
      }
    );
    res.redirect(`${process.env.FRONTEND_URL || "http://localhost:5173"}/payment/fail?tran_id=${tran_id}`);
  } catch (error) {
    console.error("Payment fail error:", error);
    res.redirect(`${process.env.FRONTEND_URL || "http://localhost:5173"}/payment/fail`);
  }
};

exports.paymentCancel = async (req, res) => {
  const { tran_id } = req.params;
  try {
    await payments().updateOne(
      { tran_id },
      {
        $set: {
          status: "cancelled",
          updated_at: new Date(),
        },
      }
    );
    res.redirect(`${process.env.FRONTEND_URL || "http://localhost:5173"}/payment/cancel?tran_id=${tran_id}`);
  } catch (error) {
    console.error("Payment cancel error:", error);
    res.redirect(`${process.env.FRONTEND_URL || "http://localhost:5173"}/payment/cancel`);
  }
};

exports.paymentIPN = async (req, res) => {
  const { tran_id, val_id } = req.body;
  try {
    const sslcz = new SSLCommerzPayment(store_id, store_passwd, is_live);
    const validation = await sslcz.validate({ val_id });

    if (validation.status === "VALID" || validation.status === "VALIDATED") {
      await payments().updateOne(
        { tran_id },
        {
          $set: {
            status: "validated",
            validated_at: new Date(),
            validation_data: validation,
          },
        }
      );
    }
    res.status(200).send("IPN received");
  } catch (error) {
    console.error("IPN error:", error);
    res.status(500).send("IPN failed");
  }
};

exports.getPaymentStatus = async (req, res) => {
  const { tran_id } = req.params;
  try {
    const payment = await payments().findOne({ tran_id });
    if (payment) {
      res.json({ success: true, payment });
    } else {
      res.status(404).json({ success: false, message: "Payment not found" });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching payment status",
      error: error.message,
    });
  }
};

exports.getAllPaymentsAdmin = async (req, res) => {
  try {
    const result = await payments().find().sort({ created_at: -1 }).toArray();
    res.json({ success: true, payments: result });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching payments",
      error: error.message,
    });
  }
};

exports.getPaymentsByEmail = async (req, res) => {
  const { email } = req.params;
  try {
    const result = await payments()
      .find({ customer_email: email })
      .sort({ created_at: -1 })
      .toArray();
    res.json({ success: true, payments: result });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching user payments",
      error: error.message,
    });
  }
};
