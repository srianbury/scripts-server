const userResolvers = {
  Query: {
    me: async (parent, args, { models, requestor }) => {
      if (!requestor) {
        return null;
      }
      return await models.User.findByPk(requestor.id);
    },
    user: async (parent, { id }, { models }) => await models.User.findByPk(id),
    users: async (parent, args, { models }) => await models.User.findAll(),
  },
  User: {
    username: (user) => user.username, // just leaving this here as an example.  it can be removed and everything will work the same
  },
  Mutation: {
    createUser: async (parent, { username }, { models }) => {
      return await models.User.create({ username });
    },
  },
};

export { userResolvers };
