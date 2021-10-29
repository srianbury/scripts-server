import { DataTypes } from "sequelize";
import * as CONSTANTS from "../constants";

function defineSript(sequelize) {
  const Script = sequelize.define("script", {
    title: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: "Title cannot be blank.",
        },
        len: [1, 64],
      },
    },
    text: {
      type: DataTypes.STRING(8000),
      allowNull: false,
      validate: {
        notEmpty: {
          args: true,
          msg: CONSTANTS.TEXT_CANNOT_BE_BLANK,
        },
      },
    },
    url: {
      type: DataTypes.STRING(2048),
      allowNull: true,
      validate: {
        isUrl: {
          args: true,
          msg: CONSTANTS.URL_IS_NOT_VALID,
        },
      },
    },
  });

  Script.associate = (models) => {
    Script.belongsTo(models.User, {
      foreignKey: {
        allowNull: false,
      },
    });
  };

  return Script;
}

export { defineSript };
