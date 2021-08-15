import { gql } from "apollo-server-express";

const userSchema = gql`
  extend type Query {
    me: User
    user(id: ID!): User
    users: [User!]
  }

  extend type Mutation {
    createUser(username: String!): User!
  }

  type User {
    id: ID!
    username: String!
  }
`;

export { userSchema };
