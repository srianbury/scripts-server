import { ForbiddenError } from "apollo-server-express";
import { skip } from "graphql-resolvers";

function isAuthenticated(parent, args, { requestor, CONSTANTS }) {
  return requestor
    ? skip
    : new ForbiddenError(CONSTANTS.USER_IS_NOT_AUTHENTICATED);
}

export { isAuthenticated };
