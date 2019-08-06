const mongoose = require("mongoose");
const User = require("../models/user");
const express = require("express");
const router = new express.Router();
const Joi = require("@hapi/joi");
const bcrypt = require("bcrypt");

function validate(req) {
  const schema = Joi.object().keys({
    email: Joi.string()
      .email()
      .required(),
    password: Joi.string()
      .required()
      .min(6)
      .regex(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9]).{8,1024}$/)
  });
  return Joi.validate(req, schema);
}

router.post("/users/login", async (req, res) => {
  const { error } = validate(req.body);
  if (error) {
    return res.status(400).send(error.details[0].message);
  }
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return res.status(400).send("invalid email or password"); //for security do not tell which one
  }
  const validPassword = await bcrypt.compare(req.body.password, user.password);
  if (!validPassword) {
    res.status(401).send("error");
  }
  const token = await user.generateJwtToken();
  user.tokens = user.tokens.concat({ token: token });
  await user.save();
  res.send(token);
});
module.exports = router;
