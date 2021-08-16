import { AuthenticationError } from "apollo-server";
import { authedUserResponse, formatRoles } from "../utils";

const userResolvers = {
  Query: {
    me: async (parent, args, context) => {
      const { models, requestor } = context;
      context.self = true;
      if (!requestor) {
        return null;
      }
      return await models.User.findByPk(requestor.id);
    },
    user: async (parent, { username }, { models }) => {
      return await models.User.findOne({
        where: {
          username,
        },
      });
    },
    users: async (parent, args, { models }) => await models.User.findAll(),
  },
  User: {
    roles: (user, args, context) => {
      if (context.self === true) {
        return formatRoles(user.roles);
      }
      return [];
    },
  },
  Mutation: {
    createUser: async (parent, { username, email, password }, { models }) => {
      const newPassword = await models.Password.create({ password });
      const newUser = await models.User.create({
        username,
        email,
        passwordId: newPassword.dataValues.id,
      });

      return authedUserResponse(newUser);
    },
    signIn: async (parent, { email, password }, { models }) => {
      const ERROR_MESSAGE = "Username and password do not match.";
      const user = await models.User.findByEmail(email);
      if (!user) {
        throw new AuthenticationError(ERROR_MESSAGE);
      }

      const usersPassword = await models.Password.findByPk(
        user.dataValues.passwordId
      );
      const isValid = await usersPassword.validatePassword(password);

      if (!isValid) {
        throw new AuthenticationError(ERROR_MESSAGE);
      }

      return authedUserResponse(user);
    },
  },
};

export { userResolvers };
