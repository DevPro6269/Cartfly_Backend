import jwt from "jsonwebtoken";

function generateAccessToken(id) {
  // Set the expiration time (e.g., 1 hour)
  const expiresIn = "1h"; // or "15m", "1d", etc.

  // Generate the token
  const token = jwt.sign({ id: id }, process.env.ACCESS_TOKEN_SECRET, { expiresIn });

  return token;
}

export default generateAccessToken;
