const { getDB } = require("../config/db");

exports.getContacts = async (req, res) => {
  const result = await getDB().collection("contact").find().toArray();
  res.send(result);
};
