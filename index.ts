import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";

import dotenv from "dotenv";
dotenv.config();

import cors from "cors";

import Supertokens from "supertokens-node";
import UserRoles from "supertokens-node/recipe/userroles";
import Session from "supertokens-node/recipe/session";
import {
  errorHandler,
  middleware,
} from "supertokens-node/lib/build/framework/express/framework";

import Roles from "./src/Roles";
import router from "./src/routes";

const app = express();
const port = 3000;

Supertokens.init({
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
  recipeList: [
    Session.init({
      override: {
        functions: (originalImplementation) => {
          return {
            ...originalImplementation,
            createNewSession: async function (input) {
              let { userId } = input;
              let roles = await UserRoles.getRolesForUser(userId);
              input.accessTokenPayload = {
                ...input.accessTokenPayload,
                roles,
              };
              return originalImplementation.createNewSession(input);
            },
          };
        },
      },
    }),
    UserRoles.init(),
  ],
});
async function initRoles() {
  const roles = ["ATHLETE", "COACH", "ADMIN"];
  roles.forEach(async (role) => {
    await Roles.createRole(role);
  });
}

//Why those lines???
/**
 * TLDR : It wraps your API incomming request in an "req.body" object
 *
 *
 */
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

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

app.use(
  cors({
    origin: "http://localhost:3001",
    allowedHeaders: ["content-type", ...Supertokens.getAllCORSHeaders()],
    credentials: true,
  })
);
app.use(middleware());

app.use("/", router);

app.use(errorHandler());

app.listen(port, () => {
  console.log(`PTP API listens on ${port} port.`);
  connectToDB();
  initRoles();
});
