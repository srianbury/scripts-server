const BASE_PATH = "/graphql";
const ERASE_DB_ON_SYNC = process.env.NODE_ENV === "development" ? true : false;
const USERNAME_AND_PASSWORD_DO_NOT_MATCH =
  "Username and password do not match.";

export { BASE_PATH, ERASE_DB_ON_SYNC, USERNAME_AND_PASSWORD_DO_NOT_MATCH };
