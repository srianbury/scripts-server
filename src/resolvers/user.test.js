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

async function createUser(variables) {
  return axios.post(
    `http://localhost:${process.env.PORT}${CONSTANTS.BASE_PATH}`,
    {
      query: `
      mutation($username: String!, $email: String!, $password: String!) {
        createUser(username: $username, email: $email, password: $password) {
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
          },
        },
      };

      const actual = await findUserByUsername({ username: "bsunbury" });

      expect(actual.data.data.user).to.have.all.keys("id", "username");
      expect(actual.data).excludingEvery(["id"]).to.eql(expected);
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
            },
            {
              id: "2-placeholder",
              username: "stevie",
            },
          ],
        },
      };

      const actual = await getAllUsers();

      expect(actual.data).excludingEvery("id").to.eql(expected);
      actual.data.data.users.forEach((user) => {
        expect(user).to.have.all.keys("id", "username");
      });
    });
  });

  describe("createUser(username: String!, email: String!, password: String!): AuthUser!", () => {
    it("should fail if the username has leading whitespace", async () => {
      const actual = await createUser({
        username: " mynameisbilbo",
        email: "newuser@scripts.com",
        password: "thiswillwork",
      });

      expect(actual.data.errors[0].message).to.eql(
        CONSTANTS.USERNAME_CANNOT_CONTAIN_LEADING_NOR_TRAILING_WHITESPACE
      );
    });

    it("should fail if the username has trailing whitespace", async () => {
      const actual = await createUser({
        username: "mynameisbilbo ",
        email: "newuser@scripts.com",
        password: "thiswillwork",
      });

      expect(actual.data.errors[0].message).to.eql(
        CONSTANTS.USERNAME_CANNOT_CONTAIN_LEADING_NOR_TRAILING_WHITESPACE
      );
    });

    it("should fail if the username is blank", async () => {
      const actual = await createUser({
        username: "",
        email: "newuser@scripts.com",
        password: "thiswillwork",
      });

      expect(actual.data.errors[0].message).to.eql(
        CONSTANTS.USERNAME_CANNOT_BE_BLANK
      );
    });

    it("should fail if the username is all spaces", async () => {
      const actual = await createUser({
        username: " ",
        email: "newuser@scripts.com",
        password: "thiswillwork",
      });

      expect(actual.data.errors[0].message).to.eql(
        CONSTANTS.USERNAME_CANNOT_BE_BLANK
      );
    });

    it("should fail if the username is not available", async () => {
      const actual = await createUser({
        username: "BSUNBURY",
        email: "newuser@scripts.com",
        password: "thiswillwork",
      });

      expect(actual.data).to.have.property("errors");

      // expect(actual.data.errors[0].message).to.eql(
      //   CONSTANTS.THIS_USERNAME_ISNT_AVAILABLE
      // );
    });

    it("should fail if the email is not valid", async () => {
      const actual = await createUser({
        username: "bsunbury",
        email: "myemail",
        password: "thiswillwork",
      });

      expect(actual.data.errors[0].message).to.eql(
        CONSTANTS.ENTER_A_VALID_EMAIL
      );
    });

    it("should fail if an account already exists for the given email", async () => {
      const actual = await createUser({
        username: "newusername",
        email: "BSUNBURY@scripts.com",
        password: "thiswillwork",
      });

      expect(actual.data).to.have.property("errors");

      // expect(actual.data.errors[0].message).to.eql(
      //   CONSTANTS.AN_ACCOUNT_ALREADY_EXISTS_FOR_THIS_EMAIL
      // );
    });

    it("should fail if the password is null", async () => {
      const actual = await createUser({
        username: "nulluser",
        email: "nulluser@scripts.com",
        password: null,
      });

      expect(actual.data).to.have.property("errors");

      // expect(actual.data.errors[0].message).to.eql(
      //   CONSTANTS.PASSWORD_CANNOT_BE_NULL
      // );
    });

    it("should fail if the password is blank", async () => {
      const actual = await createUser({
        username: "nulluser",
        email: "nulluser@scripts.com",
        password: "",
      });

      expect(actual.data).to.have.property("errors");

      // expect(actual.data.errors[0].message).to.eql(
      //   CONSTANTS.PASSWORD_LENGTH_REQUIREMENT
      // );
    });

    it("should fail if the password is all spaces", async () => {
      const actual = await createUser({
        username: "nulluser",
        email: "nulluser@scripts.com",
        password: " ",
      });

      expect(actual.data).to.have.property("errors");

      // expect(actual.data.errors[0].message).to.eql(
      //   CONSTANTS.PASSWORD_LENGTH_REQUIREMENT
      // );
    });

    it("should fail if the password is too short", async () => {
      const actual = await createUser({
        username: "nulluser",
        email: "nulluser@scripts.com",
        password: "word",
      });

      expect(actual.data).to.have.property("errors");

      // expect(actual.data.errors[0].message).to.eql(
      //   CONSTANTS.PASSWORD_LENGTH_REQUIREMENT
      // );
    });

    it("should fail if the password is too short", async () => {
      const actual = await createUser({
        username: "nulluser",
        email: "nulluser@scripts.com",
        password: "word",
      });

      expect(actual.data).to.have.property("errors");

      // expect(actual.data.errors[0].message).to.eql(
      //   CONSTANTS.PASSWORD_LENGTH_REQUIREMENT
      // );
    });

    it("should succeed", async () => {
      const actual = await createUser({
        username: "samiam",
        email: "samiam@scripts.com",
        password: "sammyspassword",
      });

      const expected = {
        data: {
          createUser: {
            id: "3",
            username: "samiam",
            email: "samiam@scripts.com",
            roles: [],
            token: "ey...",
          },
        },
      };

      expect(actual.data.data.createUser).to.have.all.keys(
        "id",
        "username",
        "email",
        "roles",
        "token"
      );
      expect(actual.data).excludingEvery(["id", "token"]).to.eql(expected);
    });
  });
});
