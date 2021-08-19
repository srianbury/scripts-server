const BASE_PATH = "/graphql";
const ERASE_DB_ON_SYNC = process.env.NODE_ENV === "production" ? false : true;
const USERNAME_AND_PASSWORD_DO_NOT_MATCH =
  "Username and password do not match.";
const USERNAME_CANNOT_CONTAIN_LEADING_NOR_TRAILING_WHITESPACE =
  "Username cannot contain leading nor trailing whitespace.";

export {
  BASE_PATH,
  ERASE_DB_ON_SYNC,
  USERNAME_AND_PASSWORD_DO_NOT_MATCH,
  USERNAME_CANNOT_CONTAIN_LEADING_NOR_TRAILING_WHITESPACE,
};
