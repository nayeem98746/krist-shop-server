const express = require("express");
const cors = require("cors");
require("dotenv").config();

const { connectDB } = require("./src/config/db");

const productRoutes = require("./src/routes/productRoutes");
const userRoutes = require("./src/routes/userRoutes");
const addressRoutes = require("./src/routes/addressRoutes");
const contactRoutes = require("./src/routes/contactRoutes");
const eventRoutes = require("./src/routes/eventRoutes");
const paymentRoutes = require("./src/routes/paymentRoutes");

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("server is running");
});

app.use(productRoutes);
app.use(userRoutes);
app.use(addressRoutes);
app.use(contactRoutes);
app.use(eventRoutes);
app.use(paymentRoutes);

async function start() {
  try {
    await connectDB();
    app.listen(port, () => {
      console.log(`server is running on port: ${port}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
}

start();
