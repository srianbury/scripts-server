import { DataTypes } from "sequelize";

const user = (sequelize) => {
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
  });

  User.findByUsername = async (username) => {
    let user = await User.findOne({
      where: { username },
    });

    return user;
  };

  return User;
};

export { user };
