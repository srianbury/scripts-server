import { Sequelize } from "sequelize";
import { defineUser } from "./user";
import { definePassword } from "./password";
import { defineSript } from "./script";

const sequelize = new Sequelize(
  `postgres://${process.env.DATABASE_USERNAME}:${process.env.DATABASE_PASSWORD}@${process.env.DATABASE_HOST}:${process.env.DATABASE_PORT}/${process.env.DATABASE}`,
  {
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
