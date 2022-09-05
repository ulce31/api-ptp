const express = require("express");
require("dotenv").config();
const mongoose = require("mongoose");
const app = express();
const port = 3000;

async function connectToDB() {
  try {
    await mongoose.connect(
      `mongodb+srv://${process.env.USR_DB}:${process.env.PWD_DB}@${process.env.ADR_DB}/?retryWrites=true&w=majority`
    );
    console.log("Succesfully connected to the DB ⚡️");
  } catch (error) {
    console.log(error);
  }
}

app.get("/", async (req, res) => {
  res.send("TEST route");
});
app.listen(port, () => {
  console.log(`PTP API listens on ${port} port.`);
  connectToDB();
});
