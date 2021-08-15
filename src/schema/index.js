import { gql } from "apollo-server-express";
import { userSchema } from "./user";
import { scriptSchema } from "./script";

const linkSchema = gql`
  type Query {
    _: Boolean
  }

  type Mutation {
    _: Boolean
  }
`;

const schema = [linkSchema, userSchema, scriptSchema];

export { schema };
