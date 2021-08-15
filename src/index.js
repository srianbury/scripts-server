import "dotenv/config";
import cors from "cors";
import express from "express";
import { ApolloServer } from "apollo-server-express";
import { schema } from "./schema";
import { resolvers } from "./resolvers";
import { sequelize, models } from "./models";

const BASE_PATH = "/graphql";
const ERASE_DB_ON_SYNC = process.env.NODE_ENV === "production" ? false : true;

async function initDb() {
  await models.User.create({
    username: "bsunbury",
  });
  await models.User.create({
    username: "stevie",
  });
}

async function startApolloServer() {
  const app = express();
  app.use(cors());

  const server = new ApolloServer({
    typeDefs: schema,
    resolvers,
    formatError: (error) => ({
      ...error,
      message: error.message
        .replace("SequelizeValidationError: ", "")
        .replace("Validation error: ", ""),
    }),
    context: {
      models,
      requestor: null,
    },
  });

  await server.start();
  server.applyMiddleware({ app, path: BASE_PATH });
  // await new Promise((resolve) =>
  //   app.listen({ port: process.env.PORT }, resolve)
  // );
  sequelize.sync({ force: ERASE_DB_ON_SYNC }).then(async () => {
    if (ERASE_DB_ON_SYNC) {
      initDb();
    }

    app.listen({ port: process.env.PORT }, () => {});
  });

  console.log(
    `Apollo Server running at http://localhost:${process.env.PORT}${BASE_PATH}`
  );
  return { server, app };
}

startApolloServer();