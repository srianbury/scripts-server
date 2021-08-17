import chai, { expect } from "chai";
import chaiexclude from "chai-exclude";
import axios from "axios";
import * as CONSTANTS from "../constants";

chai.use(chaiexclude);

async function findUserByUsername(variables) {
  return axios.post(
    `http://localhost:${process.env.PORT}${CONSTANTS.BASE_PATH}`,
    {
      query: `
      query ($username: String!) {
        user(username: $username) {
          id
          username
          roles
          email
        }
      }
    `,
      variables,
    }
  );
}

async function login(variables) {
  return axios.post(
    `http://localhost:${process.env.PORT}${CONSTANTS.BASE_PATH}`,
    {
      query: `
      mutation($email: String!, $password: String!) {
        signIn(email: $email, password: $password) {
          id
          username
          email
          roles
          token
        }
      }
    `,
      variables,
    }
  );
}

async function getRequestor(token) {
  const axiosConfig =
    token === null || token === undefined || token === ""
      ? {}
      : {
          headers: {
            Authorization: token,
          },
        };
  return axios.post(
    `http://localhost:${process.env.PORT}${CONSTANTS.BASE_PATH}`,
    {
      query: `
        query {
          me {
            id
            username
            email
            roles
            token
          }
        }
      `,
    },
    axiosConfig
  );
}

async function getAllUsers() {
  return axios.post(
    `http://localhost:${process.env.PORT}${CONSTANTS.BASE_PATH}`,
    {
      query: `
        query {
          users {
            id
            username
            email
            roles
          }
        }
    `,
    }
  );
}

describe("users", () => {
  describe("query user(username: String!): User", () => {
    it("should return a user b/c they exist", async () => {
      const expected = {
        data: {
          user: {
            id: "1",
            username: "bsunbury",
            email: "bsunbury@scripts.com",
            roles: [],
          },
        },
      };

      const actual = await findUserByUsername({ username: "bsunbury" });

      expect(actual.data).to.eql(expected);
    });

    it("should return null b/c the user does not exist", async () => {
      const expected = {
        data: {
          user: null,
        },
      };

      const actual = await findUserByUsername({
        username: "userthatdoesntexist",
      });

      expect(actual.data).to.eql(expected);
    });
  });

  describe("mutation signIn(email: String!, password: String!): AuthUser!", () => {
    it("should sucessfully login a user", async () => {
      const expected = {
        data: {
          signIn: {
            id: "placeholder",
            username: "bsunbury",
            email: "bsunbury@scripts.com",
            roles: ["GOD"],
            token: "ey...",
          },
        },
      };

      const actual = await login({
        email: "bsunbury@scripts.com",
        password: "myfirstpassword",
      });

      expect(actual.data.data.signIn).to.have.all.keys(
        "id",
        "username",
        "email",
        "roles",
        "token"
      );
      expect(actual.data).excludingEvery(["id", "token"]).to.eql(expected);
    });

    it("should return an error when the password is incorrect", async () => {
      const actual = await login({
        email: "bsunbury@scripts.com",
        password: "wrongpassswrd",
      });

      expect(actual.data.errors[0].message).to.eql(
        CONSTANTS.USERNAME_AND_PASSWORD_DO_NOT_MATCH
      );
    });
  });

  describe("query me: AuthUser", () => {
    it("should return null when the user is not authenticated", async () => {
      const actual = await getRequestor(null);

      expect(actual.data.data.me).to.eql(null);
    });

    it("should return a user when the user is authenticated", async () => {
      const user = await login({
        email: "bsunbury@scripts.com",
        password: "myfirstpassword",
      });

      const actual = await getRequestor(user.data.data.signIn.token);

      const expected = {
        data: {
          me: {
            id: "1",
            username: "bsunbury",
            email: "bsunbury@scripts.com",
            roles: ["GOD"],
            token: "ey...",
          },
        },
      };

      expect(actual.data.data.me).to.have.all.keys(
        "id",
        "username",
        "email",
        "roles",
        "token"
      );
      expect(actual.data.data.me.username).to.eql(expected.data.me.username);
      expect(actual.data.data.me.email).to.eql(expected.data.me.email);
      expect(actual.data.data.me.roles).to.eql(expected.data.me.roles);
    });
  });

  describe("query users: [User!]", () => {
    it("should return all users", async () => {
      const expected = {
        data: {
          users: [
            {
              id: "1-placeholder",
              username: "bsunbury",
              email: "bsunbury@scripts.com",
              roles: [],
            },
            {
              id: "2-placeholder",
              username: "stevie",
              email: "stevie@scripts.com",
              roles: [],
            },
          ],
        },
      };

      const actual = await getAllUsers();

      expect(actual.data).excludingEvery("id").to.eql(expected);
      actual.data.data.users.forEach((user) => {
        expect(user).to.have.all.keys("id", "username", "email", "roles");
      });
    });
  });
});
