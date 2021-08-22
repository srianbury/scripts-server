// require("dotenv").config({ path: `.env.${process.env.NODE_ENV}` });
import cors from "cors";
import express from "express";
import { ApolloServer } from "apollo-server-express";
import { schema } from "./schema";
import { resolvers } from "./resolvers";
import { sequelize, models } from "./models";
import { initDb } from "./dev";
import { isOwnerWrapper, getRequestor } from "./utils";
import * as CONSTANTS from "./constants";

async function startApolloServer() {
  const app = express();
  app.use(cors());

  const server = new ApolloServer({
    typeDefs: schema,
    resolvers,
    formatError: (error) => ({
      ...error,
      message: error.message
        .replace(/SequelizeValidationError: /g, "")
        .replace(/Validation error: /g, "")
        .replace(/Context creation failed: /g, ""),
    }),
    context: async ({ req }) => {
      const requestor = await getRequestor(req);

      return {
        models,
        requestor,
        isOwner: isOwnerWrapper(requestor),
        CONSTANTS,
      };
    },
  });

  await server.start();
  server.applyMiddleware({ app, path: CONSTANTS.BASE_PATH });
  // await new Promise((resolve) =>
  //   app.listen({ port: process.env.PORT }, resolve)
  // );
  sequelize.sync({ force: CONSTANTS.ERASE_DB_ON_SYNC }).then(async () => {
    if (CONSTANTS.ERASE_DB_ON_SYNC) {
      initDb(models);
    }

    app.listen({ port: process.env.PORT }, () => {});
  });

  console.log(
    `Apollo Server running at http://localhost:${process.env.PORT}${CONSTANTS.BASE_PATH}`
  );
  return { server, app };
}

startApolloServer();
