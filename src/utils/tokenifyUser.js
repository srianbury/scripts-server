import jwt from "jsonwebtoken";

const tokenifyUser = async (user) => {
  const { id, email, username } = user;
  return await jwt.sign({ id, email, username }, process.env.SECRET);
};

export { tokenifyUser };
