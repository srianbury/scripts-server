import { DataTypes } from "sequelize";
import * as CONSTANTS from "../constants";

function defineUser(sequelize) {
  const User = sequelize.define(
    "user",
    {
      username: {
        type: DataTypes.STRING,
        unique: {
          args: true,
          msg: CONSTANTS.THIS_USERNAME_ISNT_AVAILABLE,
        },
        allowNull: false,
        validate: {
          notEmpty: {
            args: true,
            msg: CONSTANTS.USERNAME_CANNOT_BE_BLANK,
          },
          doesNotHaveLeadingNorTrailingWhitespace(value) {
            if (value.trim() === "") {
              return;
            }
            if (value !== value.trim()) {
              throw new Error(
                CONSTANTS.USERNAME_CANNOT_CONTAIN_LEADING_NOR_TRAILING_WHITESPACE
              );
            }
          },
        },
      },
      email: {
        type: DataTypes.STRING,
        unique: {
          args: true,
          msg: CONSTANTS.AN_ACCOUNT_ALREADY_EXISTS_FOR_THIS_EMAIL,
        },
        allowNull: false,
        validate: {
          isEmail: {
            args: true,
            msg: CONSTANTS.ENTER_A_VALID_EMAIL,
          },
        },
      },
      roles: {
        type: DataTypes.STRING,
      },
    },
    {
      indexes: [
        {
          unique: true,
          name: "unique_name",
          fields: [sequelize.fn("lower", sequelize.col("username"))],
        },
        {
          unique: true,
          name: "unique_email",
          fields: [sequelize.fn("lower", sequelize.col("email"))],
        },
      ],
    }
  );

  User.findByUsername = async (username) => {
    let user = await User.findOne({
      where: { username },
    });

    return user;
  };

  User.findByEmail = async (email) => {
    let user = await User.findOne({
      where: { email },
    });

    return user;
  };

  User.associate = (models) => {
    User.hasMany(models.Script, { onDelete: "CASCADE" });
  };

  return User;
}

export { defineUser };
