const BASE_PATH = "/graphql";
const ERASE_DB_ON_SYNC = ["development", "test", "stage"].includes(
  process.env.NODE_ENV
)
  ? true
  : false;
const USERNAME_AND_PASSWORD_DO_NOT_MATCH =
  "Username and password do not match.";
const USERNAME_CANNOT_CONTAIN_LEADING_NOR_TRAILING_WHITESPACE =
  "Username cannot contain leading nor trailing whitespace.";
const USERNAME_CANNOT_BE_BLANK = "Username cannot be blank.";
const THIS_USERNAME_ISNT_AVAILABLE =
  "This username isn't available. Please try another.";
const ENTER_A_VALID_EMAIL = "Enter a valid email address.";
const AN_ACCOUNT_ALREADY_EXISTS_FOR_THIS_EMAIL =
  "An account already exists for this email address.";
const PASSWORD_CANNOT_BE_NULL = "Password cannot be null.";
const PASSWORD_LENGTH_REQUIREMENT =
  "Password must be between 10 and 42 characters.";
const USER_IS_NOT_AUTHENTICATED = "User is not authenticated.";
const THE_JWT_SUPPLIED_IS_NOT_VALID =
  "The JSON Web Token provided is not valid.";
const TEXT_CANNOT_BE_BLANK = "Text cannot be blank.";

export {
  BASE_PATH,
  ERASE_DB_ON_SYNC,
  USERNAME_AND_PASSWORD_DO_NOT_MATCH,
  USERNAME_CANNOT_CONTAIN_LEADING_NOR_TRAILING_WHITESPACE,
  USERNAME_CANNOT_BE_BLANK,
  THIS_USERNAME_ISNT_AVAILABLE,
  ENTER_A_VALID_EMAIL,
  AN_ACCOUNT_ALREADY_EXISTS_FOR_THIS_EMAIL,
  PASSWORD_CANNOT_BE_NULL,
  PASSWORD_LENGTH_REQUIREMENT,
  USER_IS_NOT_AUTHENTICATED,
  THE_JWT_SUPPLIED_IS_NOT_VALID,
  TEXT_CANNOT_BE_BLANK,
};
