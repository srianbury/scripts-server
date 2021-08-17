import jwt from "jsonwebtoken";
import { formatRoles } from ".";

async function getRequestor(req) {
  const token = req.headers["authorization"];

  if (!token) {
    return null;
  }

  if (token) {
    let user = await jwt.verify(token, process.env.SECRET);
    user = {
      ...user,
      roles: formatRoles(user.roles),
    };
    return user;
  }
}

export { getRequestor };
