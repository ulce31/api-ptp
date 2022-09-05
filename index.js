import express from "express";
import dotenv from "dotenv";
dotenv.config();
import mongoose from "mongoose";
const app = express();
const port = 3000;

import router from "./src/routes.js";

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

app.use("/", router);

app.listen(port, () => {
  console.log(`PTP API listens on ${port} port.`);
  connectToDB();
});
