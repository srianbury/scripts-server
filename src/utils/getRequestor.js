import { AuthenticationError } from "apollo-server";
import jwt from "jsonwebtoken";
import { formatRoles } from ".";
import * as CONSTANTS from "../constants";

async function getRequestor(req) {
  const token = req.headers["authorization"];

  if (!token) {
    return null;
  }

  let user;

  try {
    user = await jwt.verify(token, process.env.SECRET);
  } catch (error) {
    console.log({ error });
    return null;
  }

  user = {
    ...user,
    roles: formatRoles(user.roles),
  };

  return user;
}

export { getRequestor };
