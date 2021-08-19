import { combineResolvers } from "graphql-resolvers";
import { isAuthenticated, isOwner } from "../utils";

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
    createScript: combineResolvers(
      isAuthenticated,
      async (parent, { title, text }, { requestor, models }) => {
        return await models.Script.create({
          title,
          text,
          userId: requestor.id,
        });
      }
    ),
    updateScript: combineResolvers(
      isAuthenticated,
      async (parent, { id, title, text }, { models, requestor, isOwner }) => {
        const script = await models.Script.findByPk(id);

        isOwner(script);

        if (title !== undefined) {
          script.title = title;
        }
        if (text !== undefined) {
          script.text = text;
        }
        await script.save();
        return script;
      }
    ),
  },
  Script: {
    user: async (script, args, { models }) => {
      return await models.User.findByPk(script.userId);
    },
  },
};

export { scriptResolvers };
