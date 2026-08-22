const { ObjectId } = require("mongodb");
const { getDB } = require("../config/db");

const users = () => getDB().collection("user");

exports.getAllUsers = async (req, res) => {
  const result = await users().find().toArray();
  res.send(result);
};

exports.getUserByDisplayName = async (req, res) => {
  const name = req.params.displayName;
  try {
    const result = await users().findOne({ displayName: name });
    if (result) {
      res.send(result);
    } else {
      res.status(404).send({ error: "user can't find it" });
    }
  } catch (err) {
    res.status(500).send({ error: "an error occurred", details: err.message });
  }
};

exports.createUser = async (req, res) => {
  const user = req.body;
  const existingUser = await users().findOne({ email: user.email });
  if (existingUser) {
    return res.send({ message: "user already exists" });
  }
  const newUser = {
    displayName: user.displayName,
    phoneNumber: user.phoneNumber,
    profileIDName: user.profileIDName,
    email: user.email,
    role: "customer",
  };
  const result = await users().insertOne(newUser);
  res.send(result);
};

exports.updateUserPicture = async (req, res) => {
  const { displayName } = req.params;
  const { pictureUrl } = req.body;

  if (!displayName) {
    return res.status(400).json({ message: "displayName is required" });
  }
  if (!pictureUrl) {
    return res.status(400).json({ message: "pictureUrl is required" });
  }

  try {
    const updateUserData = await users().findOneAndUpdate(
      { displayName },
      { $set: { pictureUrl } },
      { new: true, runValidators: true }
    );
    if (!updateUserData) {
      return res.status(404).json({ message: "user not found" });
    }
    return res.json(updateUserData);
  } catch (error) {
    return res.status(500).json({ message: "Error  updating pictureUrl", error });
  }
};

exports.updateUserRole = async (req, res) => {
  const id = req.params._id;
  const { role } = req.body;
  const validRoles = ["admin", "customer", "shop owner", "outlet", "manager"];

  if (!role || !validRoles.includes(role)) {
    return res.status(400).json({ error: "Invalid role" });
  }
  if (!ObjectId.isValid(id)) {
    return res.status(400).json({ error: "Invalid user ID" });
  }

  try {
    const result = await users().updateOne({ _id: new ObjectId(id) }, { $set: { role } });
    res.send(result);
  } catch {
    res.status(500).json({ error: "failed to update role" });
  }
};
