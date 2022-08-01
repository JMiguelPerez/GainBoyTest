//provide security, only loggedin users can manipulate database 
const jwt = require("jsonwebtoken");


function auth(req, res, next) {
  try {
    //read cookie

    // change to
    const { token: token } = req.body;

    // also add login res.json{..., jwt:jwt, ...}
    // then input parameters for create, workout, display, delete:
    // const {..., jwt: jwt, ...} = req.body

    // const token = req.cookies.token;

    //check token
    if (!token) return res.status(401).json({ errorMessage: "Unauthorized: no token" });
    //validate token
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    req.user = verified.user;

    next();
  } catch (err) {
    console.error(err);
    res.status(401).json({ errorMessage: "Unauthorized" + token });
  }
}

module.exports = auth;