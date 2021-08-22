import { DataTypes } from "sequelize";
import bcrypt from "bcrypt";
import * as CONSTANTS from "../constants";

function definePassword(sequelize) {
  const Password = sequelize.define("password", {
    password: {
      type: DataTypes.STRING,
      allowNull: {
        args: false,
        msg: CONSTANTS.PASSWORD_CANNOT_BE_NULL,
      },
      is: /^[0-9a-f]{64}$/i,
      validate: {
        notEmpty: {
          args: true,
          msg: CONSTANTS.PASSWORD_LENGTH_REQUIREMENT,
        },
        len: {
          args: [10, 42],
          mgs: CONSTANTS.PASSWORD_LENGTH_REQUIREMENT,
        },
      },
    },
  });

  Password.beforeCreate(async (password) => {
    console.log("Password.beforeCreate", password.password);
    password.password = await password.generatePasswordHash();
  });

  Password.associate = (models) => {
    Password.hasOne(models.User, {
      foreignKey: {
        allowNull: false,
      },
    });
  };

  Password.prototype.generatePasswordHash = async function () {
    const SALT_ROUNDS = 10;
    return await bcrypt.hash(this.password, SALT_ROUNDS);
  };

  Password.prototype.validatePassword = async function (password) {
    return await bcrypt.compare(password, this.password);
  };

  return Password;
}

export { definePassword };
