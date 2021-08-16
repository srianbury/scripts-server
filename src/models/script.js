import { DataTypes } from "sequelize";

function defineSript(sequelize) {
  const Script = sequelize.define("script", {
    title: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          args: true,
          msg: "Script's title cannot be blank.",
        },
        len: [1, 64],
      },
    },
    text: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          args: true,
          msg: "Script's text cannot be blank.",
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
