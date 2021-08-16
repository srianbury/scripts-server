import { ForbiddenError } from "apollo-server-express";
import { skip } from "graphql-resolvers";

function isAuthenticated(parent, args, { requestor }) {
  return requestor ? skip : new ForbiddenError("User is not authenticated");
}

export { isAuthenticated };
