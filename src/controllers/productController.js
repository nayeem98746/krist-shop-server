const { ObjectId } = require("mongodb");
const { getDB } = require("../config/db");

const cols = () => ({
  men: getDB().collection("men"),
  women: getDB().collection("women"),
  foot: getDB().collection("foots"),
  kids: getDB().collection("kids"),
  bAndF: getDB().collection("[b&f]"),
  allProduct: getDB().collection("all_product"),
});

exports.getMen = async (req, res) => {
  const result = await cols().men.find().toArray();
  res.send(result);
};

exports.getManById = async (req, res) => {
  const id = req.params.id;
  try {
    const result = await cols().men.findOne({ _id: new ObjectId(id) });
    if (result) {
      res.send(result);
    } else {
      res.status(404).send({ error: "Man not found" });
    }
  } catch (error) {
    res.status(500).send({ error: "An error occurred", details: error.message });
  }
};

exports.getWomen = async (req, res) => {
  const result = await cols().women.find().toArray();
  res.send(result);
};

exports.getFoot = async (req, res) => {
  const result = await cols().foot.find().toArray();
  res.send(result);
};

exports.getKids = async (req, res) => {
  const result = await cols().kids.find().toArray();
  res.send(result);
};

exports.getBAndF = async (req, res) => {
  const result = await cols().bAndF.find().toArray();
  res.send(result);
};

exports.getAllProducts = async (req, res) => {
  const result = await cols().allProduct.find().toArray();
  res.send(result);
};

exports.getProductsByCategory = async (req, res) => {
  const { category } = req.params;
  try {
    const result = await cols().allProduct.find({ category }).toArray();
    if (result) {
      res.send(result);
    } else {
      res.status(404).send({ error: "category can't found" });
    }
  } catch (error) {
    res.send({ error: "an error occurred", details: error.message });
  }
};

exports.getProductDetail = async (req, res) => {
  const id = req.params._id;
  try {
    const result = await cols().allProduct.findOne({ _id: new ObjectId(id) });
    if (result) {
      res.send(result);
    } else {
      res.status(404).send({ error: "Product not found" });
    }
  } catch (error) {
    res.status(500).send({ error: "An error occurred", details: error.message });
  }
};

exports.getProductForPayment = async (req, res) => {
  const id = req.params._id;
  try {
    const result = await cols().allProduct.findOne({ _id: new ObjectId(id) });
    if (result) {
      res.send(result);
    }
  } catch (error) {
    res.status(500).send({ error: "An error occurred" });
  }
};

exports.addProduct = async (req, res) => {
  const product = req.body;
  const result = await cols().allProduct.insertOne(product);
  res.send(result);
};

exports.updateProduct = async (req, res) => {
  const id = req.params._id;
  const { product_name, main_price, quantity, discount, discount_price } = req.body;
  const updateDoc = {
    $set: {
      ...(product_name && { product_name }),
      ...(main_price && { main_price }),
      ...(quantity && { quantity }),
      ...(discount && { discount }),
      ...(discount_price && { discount_price }),
    },
  };
  const result = await cols().allProduct.updateOne({ _id: new ObjectId(id) }, updateDoc);
  res.send(result);
};

exports.deleteProduct = async (req, res) => {
  const id = req.params._id;
  try {
    const result = await cols().allProduct.deleteOne({ _id: new ObjectId(id) });
    res.send(result);
  } catch (error) {
    res.status(500).send({ error: "fail to delete single product" });
  }
};
