const jwt = require("jsonwebtoken");
const JWT_SECRET = "thisisjwtsecret";
const fetchuser = (req, res, next) => {
  const token = req.header("auth-token");
  if (!token) {
    return res.status(401).json({ error: "invalid token" });
  }
  try {
    const data = jwt.verify(token, JWT_SECRET);
    req.user = data.user;
    // console.log(req.user);
    next();
  } catch (error) {
    return res.status(400).json({ error: "something went worng" });
  }
};

module.exports = fetchuser;
