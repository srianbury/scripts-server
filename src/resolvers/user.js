import { AuthenticationError } from "apollo-server";
import { authedUserResponse } from "../utils";

const userResolvers = {
  Query: {
    me: async (parent, args, context) => {
      const { models, requestor } = context;
      context.self = true;
      if (!requestor) {
        return null;
      }
      const user = await models.User.findByPk(requestor.id);
      return authedUserResponse(user);
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
  // User: {
  //   roles: (user, args, context) => {
  //     if (context.self === true) {
  //       return formatRoles(user.roles);
  //     }
  //     return [];
  //   },
  // },
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
    signIn: async (parent, { email, password }, { models, CONSTANTS }) => {
      const user = await models.User.findByEmail(email);
      if (!user) {
        throw new AuthenticationError(
          CONSTANTS.USERNAME_AND_PASSWORD_DO_NOT_MATCH
        );
      }

      const usersPassword = await models.Password.findByPk(
        user.dataValues.passwordId
      );
      const isValid = await usersPassword.validatePassword(password);

      if (!isValid) {
        throw new AuthenticationError(
          CONSTANTS.USERNAME_AND_PASSWORD_DO_NOT_MATCH
        );
      }

      return authedUserResponse(user);
    },
  },
};

export { userResolvers };
