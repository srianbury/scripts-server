import chai, { expect } from "chai";
import chaiexclude from "chai-exclude";
import axios from "axios";
import * as CONSTANTS from "../constants";
import { login } from "./user.test";

chai.use(chaiexclude);

async function getAllScripts() {
  return axios.post(CONSTANTS.TEST_URL, {
    query: `
      query {
        scripts {
          id
          createdAt
          title
          text
          user {
            username
          }
        }
      }
    `,
  });
}

async function findScriptById(variables) {
  return axios.post(CONSTANTS.TEST_URL, {
    query: `
      query ($id: ID!) {
        script(id: $id){
          id,
          createdAt,
          title,
          text
          user {
            username
          }
        }
      }
    `,
    variables,
  });
}

async function createScript(token, variables) {
  const axiosConfig =
    token === null || token === undefined || token === ""
      ? {}
      : {
          headers: {
            Authorization: token,
          },
        };

  return axios.post(
    CONSTANTS.TEST_URL,
    {
      query: `
      mutation($title: String!, $text: String!) {
        createScript(title: $title, text: $text) {
          id
          title
          text
          user {
            username
          }
        }
      }
    `,
      variables,
    },
    axiosConfig
  );
}

async function updateScript(token, variables) {
  const axiosConfig =
    token === null || token === undefined || token === ""
      ? {}
      : {
          headers: {
            Authorization: token,
          },
        };

  return axios.post(
    CONSTANTS.TEST_URL,
    {
      query: `
      mutation($id: ID!, $title: String!, $text: String!) {
        updateScript(id: $id, title: $title, text: $text){
          id
          title
          text
          user {
            username
          }
        }
      }
    `,
      variables,
    },
    axiosConfig
  );
}

async function tryToCreateScriptWithoutSendingAToken(variables) {
  return axios.post(CONSTANTS.TEST_URL, {
    query: `
      mutation($title: String!, $text: String!) {
        createScript(title: $title, text: $text) {
          id
          title
          text
          user {
            username
          }
        }
      }
    `,
    variables,
  });
}

describe("scripts", () => {
  let bsunburyToken;

  before(async () => {
    const bsunbury = await login({
      email: "bsunbury@scripts.com",
      password: "myfirstpassword",
    });

    bsunburyToken = bsunbury.data.data.signIn.token;
  });

  describe("scripts: [Script!]", () => {
    it("should succeed", async () => {
      const expected = {
        data: {
          scripts: [
            {
              id: "1-ph",
              createdAt: "2021-08-21T00:38:31.346Z",
              title: "the story",
              text: "this is the story of a girl",
              user: {
                username: "bsunbury",
              },
            },
            {
              id: "2-ph",
              createdAt: "2021-08-21T00:38:31.355Z",
              title: "stevies story",
              text: "somebody once told me",
              user: {
                username: "stevie",
              },
            },
          ],
        },
      };

      const actual = await getAllScripts();

      expect(actual.data).excludingEvery(["id", "createdAt"]).to.eql(expected);
      actual.data.data.scripts.forEach((script) => {
        expect(script).to.have.property("id");
        expect(script).to.have.property("createdAt");
      });
    });
  });

  describe("script(id: ID!): Script", () => {
    it("should fail if a project doesn't exist for a given ID", async () => {
      const expected = {
        data: {
          script: null,
        },
      };

      const actual = await findScriptById({ id: 99 });

      expect(actual.data).to.eql(expected);
    });

    it("should succeed", async () => {
      const expected = {
        data: {
          script: {
            id: "1",
            createdAt: "2021-08-21T21:49:23.235Z",
            title: "the story",
            text: "this is the story of a girl",
            user: {
              username: "bsunbury",
            },
          },
        },
      };

      const actual = await findScriptById({ id: 1 });

      expect(actual.data).excludingEvery(["id", "createdAt"]).to.eql(expected);
      expect(actual.data.data.script).to.have.property("id");
      expect(actual.data.data.script).to.have.property("createdAt");
    });
  });

  describe("createScript(title: String!, text: String!): Script!", () => {
    it("should succeed", async () => {
      const expected = {
        data: {
          createScript: {
            id: "3-placeholder",
            title: "SCRIPT II",
            text: "The...",
            user: {
              username: "bsunbury",
            },
          },
        },
      };
      const actual = await createScript(bsunburyToken, {
        title: "SCRIPT II",
        text: "The...",
      });
      expect(actual.data).excludingEvery(["id"]).to.eql(expected);
      expect(actual.data.data.createScript).to.have.property("id");
    });

    it("should fail if no token is given", async () => {
      const actual = await tryToCreateScriptWithoutSendingAToken({
        title: "SCRIPT III",
        text: "xxooxxoo",
      });

      expect(actual.data.errors[0].message).to.eql(
        CONSTANTS.USER_IS_NOT_AUTHENTICATED
      );
    });

    it("fail if the token sent is null", async () => {
      const actual = await createScript(null, {
        title: "The Null Script",
        text: "null null null, null null null null",
      });

      expect(actual.data.errors[0].message).to.eql(
        CONSTANTS.USER_IS_NOT_AUTHENTICATED
      );
    });

    it("fail if the token is not valid", async () => {
      const actual = await createScript("ey12345", {
        title: "The Null Script",
        text: "null null null, null null null null",
      });

      expect(actual.data.errors[0].message).to.eql(
        CONSTANTS.USER_IS_NOT_AUTHENTICATED
      );
    });

    // it("fail if the title is null", async () => {
    //   const actual = await createScript(bsunburyToken, {
    //     title: null,
    //     text: "The...",
    //   });
    //   expect(actual.data).to.have.property("errors");
    // });

    it("fail if the title is blank", async () => {
      const actual = await createScript(bsunburyToken, {
        title: "",
        text: "The...",
      });
      expect(actual.data).to.have.property("errors");
    });

    it("fail if the title is too long", async () => {
      const actual = await createScript(bsunburyToken, {
        title:
          "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
        text: "mi texto",
      });
      expect(actual.data).to.have.property("errors");
    });

    // it("fail if the text is null", async () => {
    //   const actual = await createScript(bsunburyToken, {
    //     title: "valid title",
    //     text: null,
    //   });
    //   expect(actual.data).to.have.property("errors");
    // });

    it("fail if the text is blank", async () => {
      const actual = await createScript(bsunburyToken, {
        title: "valid title",
        text: "",
      });
      expect(actual.data.errors[0].message).to.eql(
        CONSTANTS.TEXT_CANNOT_BE_BLANK
      );
    });
  });

  describe("updateScript(id: ID!, title: String, text: String): Script!", () => {
    it("should fail if the user is not authenticated", async () => {
      const actual = await updateScript(null, {
        id: 1,
        title: "Mi titulo",
        text: "lorey ipsy",
      });

      expect(actual.data.errors[0].message).to.eql(
        CONSTANTS.USER_IS_NOT_AUTHENTICATED
      );
    });

    it("should succeed", async () => {
      const expected = {
        data: {
          updateScript: {
            id: "1",
            title: "Mi titulo",
            text: "lorey ipsy",
            user: {
              username: "bsunbury",
            },
          },
        },
      };

      const actual = await updateScript(bsunburyToken, {
        id: 1,
        title: "Mi titulo",
        text: "lorey ipsy",
      });
      expect(actual.data).to.eql(expected);
    });
  });
});
