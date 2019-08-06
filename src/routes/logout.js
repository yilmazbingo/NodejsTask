const express = require("express");
const router = new express.Router();
const auth = require("../middleware/auth");

router.post("/users/logout", auth, async (req, res) => {
  try {
    req.user.tokens = req.user.tokens.filter(t => {
      return t.token !== req.token;
    });
    await req.user.save();
    res.status(200).send("you are logged out");
  } catch (e) {
    res.status(500).send(e);
  }
});

module.exports = router;
