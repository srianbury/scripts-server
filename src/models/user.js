import { DataTypes } from "sequelize";

function defineUser(sequelize) {
  const User = sequelize.define("user", {
    username: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
      validate: {
        notEmpty: {
          args: true,
          msg: "Username cannot be blank.",
        },
        doesNotHaveLeadingNorTrailingWhitespace(value) {
          if (value !== value.trim()) {
            throw new Error(
              "Username cannot contain leading nor trailing whitespace."
            );
          }
        },
      },
    },
    email: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
      validate: {
        isEmail: true,
      },
    },
    roles: {
      type: DataTypes.STRING,
    },
  });

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
