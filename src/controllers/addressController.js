const { ObjectId } = require("mongodb");
const { getDB } = require("../config/db");

const addressData = () => getDB().collection("addressData");
const userAddress = () => getDB().collection("user_address");

exports.getAddressAPI = async (req, res) => {
  const result = await addressData().find().toArray();
  res.send(result);
};

exports.getAllAddresses = async (req, res) => {
  const result = await userAddress().find().toArray();
  res.send(result);
};

exports.getAddressByUserName = async (req, res) => {
  const userName = req.params.user_name;
  try {
    const result = await userAddress().findOne({ user_name: userName });
    if (result) {
      res.send(result);
    } else {
      res.status(404).send({ error: "user can't found" });
    }
  } catch (error) {
    res.status(500).send({ error: "an error occurred", details: error.message });
  }
};

exports.createAddress = async (req, res) => {
  const address = req.body;
  const existingAddress = await userAddress().findOne({ homeAddress: address.homeAddress });
  if (existingAddress) {
    return res.send({ message: "user address already exists" });
  }
  const result = await userAddress().insertOne(address);
  res.send(result);
};

exports.deleteAddress = async (req, res) => {
  const id = req.params._id;
  try {
    const result = await userAddress().deleteOne({ _id: new ObjectId(id) });
    res.send(result);
  } catch (error) {
    res.status(500).send({ error: "Failed to delete address" });
  }
};
