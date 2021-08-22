import { Sequelize } from "sequelize";
import { defineUser } from "./user";
import { definePassword } from "./password";
import { defineSript } from "./script";

const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: "postgres",
  ssl: true,
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false,
    },
  },
});

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
