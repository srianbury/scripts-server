import { combineResolvers } from "graphql-resolvers";
import { isAuthenticated, getDomain, getSource } from "../utils";

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
      async (parent, { title, text, url }, { requestor, models }) => {
        return await models.Script.create({
          title,
          text,
          url,
          userId: requestor.id,
        });
      }
    ),
    updateScript: combineResolvers(
      isAuthenticated,
      async (
        parent,
        { id, title, text, url },
        { models, requestor, isOwner }
      ) => {
        const script = await models.Script.findByPk(id);

        isOwner(script);

        if (title !== undefined) {
          script.title = title;
        }
        if (text !== undefined) {
          script.text = text;
        }

        if (script.url !== undefined) {
          script.url = url;
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
    url: (script) => {
      if (
        script.url === "" ||
        script.url === null ||
        script.url === undefined
      ) {
        return script.url;
      }

      const domain = getDomain(script.url);
      const src = getSource(script.url, domain);

      return {
        domain,
        src,
      };
    },
  },
};

export { scriptResolvers };
