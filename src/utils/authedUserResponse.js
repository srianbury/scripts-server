import { tokenifyUser } from "./tokenifyUser";

function authedUserResponse(user) {
  return {
    id: user.id,
    username: user.username,
    email: user.email,
    token: tokenifyUser(user),
  };
}

export { authedUserResponse };
