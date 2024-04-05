const jwt = require("jsonwebtoken");
module.exports.authentication = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (!token) {
    return res.status(401).send({ status: false, msg: "Token not provided" });
  }
  jwt.verify(token, "bookstore123", (err, user) => {
    if (err) {
      return res.status(403).send({ status: false, msg: "Invalid token" });
    }
    console.log("Decoded Token Payload:", user);
    req.user = user;
    next();
  });
};