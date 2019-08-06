const jwt = require("jsonwebtoken");
const User = require("../models/user");

const auth = async (req, res, next) => {
  try {
    //this will print out the bearer too
    const token = req
      .header("authorization")
      .replace("Bearer", "")
      .trim();
    console.log(token);
    if (!token) {
      return res.status(400).send("Access Denied! No token is provided");
    }
    //validate the token
    const decoded = jwt.verify(token, prccess.env.JWTPRIVATEKEY);

    const user = await User.findOne({
      _id: decoded._id,
      "tokens.token": token
    });
    if (!user) {
      return res.status(401).send("you are not authenticated");
    }
    //this is middleware function. so see what you are passing to next function
    req.user = user;
    req.token = token;
    next();
  } catch (e) {
    res.status(500).send(e);
  }
};
module.exports = auth;
