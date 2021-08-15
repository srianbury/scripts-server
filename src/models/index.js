import { Sequelize } from "sequelize";
import { defineUser } from "./user";
import { definePassword } from "./password";
import { defineSript } from "./script";

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
  User: defineUser(sequelize),
  Password: definePassword(sequelize),
  Script: defineSript(sequelize),
};

Object.keys(models).forEach((key) => {
  if ("associate" in models[key]) {
    models[key].associate(models);
  }
});

export { sequelize, models };
