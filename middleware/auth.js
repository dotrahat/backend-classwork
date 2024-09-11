const jwt = require("jsonwebtoken");

const auth = (req, res, next) => {
  const token = req.header("x-auth-token");
  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch (error) {
    res.status(401).send("Unauthorized user");
  }
};

module.exports = auth;
