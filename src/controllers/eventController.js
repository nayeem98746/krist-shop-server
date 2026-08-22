const { ObjectId } = require("mongodb");
const { getDB } = require("../config/db");

const events = () => getDB().collection("event");

exports.getEvents = async (req, res) => {
  const result = await events().find().toArray();
  res.send(result);
};

exports.createEvent = async (req, res) => {
  const event = req.body;
  const result = await events().insertOne(event);
  res.send(result);
};

exports.deleteEvent = async (req, res) => {
  const id = req.params._id;
  try {
    const result = await events().deleteOne({ _id: new ObjectId(id) });
    res.send(result);
  } catch (error) {
    res.status(500).send({ error: "fail to delete single event" });
  }
};
