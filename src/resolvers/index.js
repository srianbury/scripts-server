import { userResolvers } from "./user";
import { scriptResolvers } from "./script";

const resolvers = [userResolvers, scriptResolvers];

export { resolvers };
