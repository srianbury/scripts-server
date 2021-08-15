import { Sequelize } from "sequelize";
import { user } from "./user";

const sequelize = new Sequelize(
  process.env.DATABASE,
  process.env.DATABASE_USERNAME,
  process.env.DATABASE_PASSWORD,
  {
    host: process.env.DATABASE_HOST,
    port: process.env.DATABASE_PORT,
    dialect: "postgres",
  }
);

const models = {
  User: user(sequelize),
};

export { sequelize, models };
