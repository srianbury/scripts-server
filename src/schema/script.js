import { gql } from "apollo-server-express";

const scriptSchema = gql`
  extend type Query {
    scripts: [Script!]
    script(id: ID!): Script
  }

  extend type Mutation {
    createScript(text: String!): Script!
  }

  type Script {
    id: ID!
    text: String!
    user: User!
  }
`;

export { scriptSchema };
