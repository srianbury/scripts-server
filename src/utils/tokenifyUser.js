import jwt from "jsonwebtoken";

const tokenifyUser = async (user) => {
  const { id, email, username, roles } = user;
  return await jwt.sign({ id, email, username, roles }, process.env.SECRET);
};

export { tokenifyUser };
