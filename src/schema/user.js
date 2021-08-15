import { gql } from "apollo-server-express";

const userSchema = gql`
  extend type Query {
    me: User
    user(username: String!): User
    users: [User!]
  }

  extend type Mutation {
    createUser(username: String!, email: String!, password: String!): Token!
    signIn(email: String!, password: String!): Token!
  }

  type Token {
    token: String!
  }

  type User {
    id: ID!
    username: String!
    email: String!
  }
`;

export { userSchema };
