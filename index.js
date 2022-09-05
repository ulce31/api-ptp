import express from "express";
import bodyParser from "body-parser";
import dotenv from "dotenv";
dotenv.config();
import mongoose from "mongoose";
const app = express();
const port = 3000;

import router from "./src/routes.js";

async function connectToDB() {
  try {
    await mongoose.connect(
      `mongodb+srv://${process.env.USR_DB}:${process.env.PWD_DB}@${process.env.ADR_DB}/ptp-app?retryWrites=true&w=majority`
    );
    console.log("Succesfully connected to the DB ⚡️");
  } catch (error) {
    console.log(error);
  }
}

//Why those lines???
/**
 * TLDR : It wraps your API incomming request in an "req.body" object
 *
 *
 */
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use("/", router);

app.listen(port, () => {
  console.log(`PTP API listens on ${port} port.`);
  connectToDB();
});
