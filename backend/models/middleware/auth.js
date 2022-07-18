//provide security, only loggedin users can add manipulate database 
const jwt = require("jsonwebtoken");

function auth(req, res, next) {
  try {
    //read cookie
    const token = req.cookies.token;
    //check token
    if (!token) return res.status(401).json({ errorMessage: "Unauthorized" });
    //validate token
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    req.user = verified.user;

    next();
  } catch (err) {
    console.error(err);
    res.status(401).json({ errorMessage: "Unauthorized" });
  }
}

module.exports = auth;