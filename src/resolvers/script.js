const scriptResolvers = {
  Query: {
    scripts: async (parent, args, { models }) => {
      return await models.Script.findAll();
    },
    script: async (parent, { id }, { models }) => {
      return await models.Script.findOne({
        where: {
          id,
        },
      });
    },
  },
  Mutation: {
    createScript: async (parent, { text }, { requestor, models }) => {
      if (!requestor) {
        throw new Error("Cannot fulfill request for an un-authenticated user.");
      }
      return await models.Script.create({
        text,
        userId: requestor.id,
      });
    },
  },
  Script: {
    user: async (message, args, { models }) => {
      return await models.User.findByPk(message.userId);
    },
  },
};

export { scriptResolvers };
