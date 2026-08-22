const express = require("express");
const router = express.Router();
const paymentController = require("../controllers/paymentController");

router.get("/api/payment/", paymentController.getAllPayments);
router.post("/api/payment/init", paymentController.initPayment);
router.post("/api/payment/success/:tran_id", paymentController.paymentSuccess);
router.post("/api/payment/fail/:tran_id", paymentController.paymentFail);
router.post("/api/payment/cancel/:tran_id", paymentController.paymentCancel);
router.post("/api/payment/ipn", paymentController.paymentIPN);
router.get("/api/payment/status/:tran_id", paymentController.getPaymentStatus);
router.get("/api/payments", paymentController.getAllPaymentsAdmin);
router.get("/api/payments/user/:email", paymentController.getPaymentsByEmail);

module.exports = router;
