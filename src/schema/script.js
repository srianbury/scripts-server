import { gql } from "apollo-server-express";

const scriptSchema = gql`
  extend type Query {
    scripts: [Script!]
    script(id: ID!): Script
  }

  extend type Mutation {
    createScript(title: String!, text: String!): Script!
    updateScript(id: ID!, title: String, text: String): Script!
  }

  type Script {
    id: ID!
    createdAt: DateTime!
    title: String!
    text: String!
    user: User!
  }
`;

export { scriptSchema };
