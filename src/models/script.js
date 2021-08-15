import { DataTypes } from "sequelize";

function defineSript(sequelize) {
  const Script = sequelize.define("script", {
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
