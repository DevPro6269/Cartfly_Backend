import jwt from "jsonwebtoken";

function generateAccessToken(id) {
  const expiresIn = "1h";

  const token = jwt.sign({ id: id }, process.env.ACCESS_TOKEN_SECRET, { expiresIn });

  return token;
}

export default generateAccessToken;
