import { DateTimeResolver } from "graphql-scalars";
import { userResolvers } from "./user";
import { scriptResolvers } from "./script";

const customScalarResolver = {
  DateTime: DateTimeResolver,
};

const resolvers = [customScalarResolver, userResolvers, scriptResolvers];

export { resolvers };
