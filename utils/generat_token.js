const jwt = require("jsonwebtoken");

module.exports = (payloud) => {
  const token = jwt.sign(payloud, process.env.JWT_SECRET_KEY, {
    expiresIn: "3m",
  });
  return token;
};
