import { gql } from "apollo-server-express";

const scriptSchema = gql`
  extend type Query {
    scripts: [Script!]
    script(id: ID!): Script
  }

  extend type Mutation {
    createScript(title: String!, text: String!, url: String): Script!
    updateScript(id: ID!, title: String, text: String, url: String): Script!
  }

  type Url {
    domain: String
    src: String
  }

  type Script {
    id: ID!
    createdAt: DateTime!
    title: String!
    text: String!
    url: Url
    user: User!
  }
`;

export { scriptSchema };
