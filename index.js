import express from "express";
import bodyParser from "body-parser";
import dotenv from "dotenv";
dotenv.config();
import cors from "cors";
import supertokens from "supertokens-node";
import Session from "supertokens-node/recipe/session/index.js";
import UserRoles from "supertokens-node/recipe/userroles/index.js";

import mongoose from "mongoose";
const app = express();
const port = 3000;

import router from "./src/routes.js";
import {
  errorHandler,
  middleware,
} from "supertokens-node/lib/build/framework/express/framework.js";

supertokens.init({
  framework: "express",
  supertokens: {
    connectionURI: process.env.ST_URI,
    apiKey: process.env.ST_API_KEY,
  },
  appInfo: {
    appName: "ptp",
    apiDomain: "http://localhost:3000",
    websiteDomain: "http://localhost:3001",
    apiBasePath: "/",
    websiteBasePath: "/",
  },
  recipeList: [Session.init(), UserRoles.init()],
});

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

app.use(
  cors({
    origin: "http://localhost:3001",
    allowedHeaders: ["content-type", ...supertokens.getAllCORSHeaders()],
    credentials: true,
  })
);
app.use(middleware());

app.use("/", router);

app.use(errorHandler());

app.listen(port, () => {
  console.log(`PTP API listens on ${port} port.`);
  connectToDB();
});
