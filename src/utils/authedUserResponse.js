import { tokenifyUser, formatRoles } from ".";

function authedUserResponse(user) {
  return {
    id: user.id,
    username: user.username,
    email: user.email,
    roles: formatRoles(user.roles),
    token: tokenifyUser(user),
  };
}

export { authedUserResponse };
