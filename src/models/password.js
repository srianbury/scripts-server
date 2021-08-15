import { DataTypes } from "sequelize";
import bcrypt from "bcrypt";

function definePassword(sequelize) {
  const Password = sequelize.define("password", {
    password: {
      type: DataTypes.STRING,
      allowNUll: false,
      is: /^[0-9a-f]{64}$/i,
      validate: {
        notEmpty: true,
        len: [10, 42],
      },
    },
  });

  Password.beforeCreate(async (user) => {
    user.password = await user.generatePasswordHash();
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
