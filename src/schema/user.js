import { gql } from "apollo-server-express";

const userSchema = gql`
  extend type Query {
    me: User
    user(username: String!): User
    users: [User!]
  }

  extend type Mutation {
    createUser(username: String!, email: String!, password: String!): AuthUser!
    signIn(email: String!, password: String!): AuthUser!
  }

  type AuthUser {
    id: ID!
    username: String!
    email: String!
    roles: [String!]!
    token: String!
  }

  type User {
    id: ID!
    username: String!
    email: String!
    roles: [String!]!
  }
`;

export { userSchema };
