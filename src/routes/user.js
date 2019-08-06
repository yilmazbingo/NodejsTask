const express = require("express");
const router = new express.Router();
const User = require("../models/user");
const bcrypt = require("bcrypt");
const _ = require("lodash");
const auth = require("../middleware/auth.js");
const sharp = require("sharp");
const { sendWelcomeEmail, sendCancellationEmail } = require("../emails/email");

const multer = require("multer");
const upload = multer({
  limits: { fileSize: 5000000 },
  fileFilter(req, file, cb) {
    if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
      return cb(new Error("please upload png,jpeg or jpg"));
    }
    // if (this.limits.fileSize > 1000000) {
    //   return cb(new Error("size is larger than 3mb"));
    // }
    cb(undefined, true);
  }
});

router.get("/users", auth, async (req, res) => {
  try {
    const users = await User.find();
    const sendUsers = users.map(
      user => (user = _.pick(user, ["name", "email", "age", "_id", "tokens"]))
    );
    res.status(200).send(sendUsers);
  } catch (e) {
    res.status(400).send(e);
  }
});

//  THIS IS NOT SECURE. if I reach other id's i can get all the information about that users.
// router.get("/users/:id", async (req, res) => {
//   try {
//     const user = await User.findById(req.params.id);
//     if (!user) {
//       return res.status(404).send();
//     }
//     res.status(200).send(_.pick(user, ["name", "age", "email"]));
//   } catch (e) {
//     res.status(500).send(e);
//   }
// });

router.get("/users/me", auth, async (req, res) => {
  // try {
  //   const user = await User.findById(req.user._id).select("-password");
  //   res.send(user);
  //   console.log("yilm");
  // } catch (e) {
  //   res.status(401).send(e);
  // }
  res.send(req.user);
});
router.post("/users", async (req, res) => {
  const user = new User(
    _.pick(req.body, ["name", "email", "password", "age", "isAdmin"])
  );

  try {
    const salt = await bcrypt.genSalt(8);
    user.password = await bcrypt.hash(user.password, salt);
    const token = await user.generateJwtToken();
    user.tokens = user.tokens.concat({ token: token });

    await user.save();
    sendWelcomeEmail(user.email, user.name);
    res
      .header("authorization", token)
      .status(201)
      .send(_.pick(user, ["name", "email", "age", "tokens"]));
  } catch (e) {
    res.status(500).send(e.message);
  }
});

router.patch("/users/:id", auth, async (req, res) => {
  if (!req.user.isAdmin && req.params.id === req.user._id) {
    return res.status(403).send("access Dddenied.");
  }
  const requestedUpdates = Object.keys(req.body);
  const allowedUpdates = ["name", "email", "password", "age"];
  const isValidPatch = requestedUpdates.every(update =>
    allowedUpdates.includes(update)
  );
  if (!isValidPatch) {
    return res.status(400).send({ error: "invalid Update" });
  }
  try {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    if (!user) {
      res.status(404).send("no user is found");
    }
    res.send(_.pick(user, ["name", "age", "email"]));
  } catch (e) {
    res.status(500).send(e);
  }
});
router.delete("/users/:id", auth, async (req, res) => {
  try {
    // const user = await User.findByIdAndDelete(req.params.id);
    // if (!user) {
    //   return res.status(400).send("invalid id");

    if (!req.user.isAdmin && req.params.id === req.user._id) {
      return res.status(403).send("access Denied.");
    }
    await req.user.remove();
    sendCancellationEmail(user.email, user.name);
    res.send("ted");
    // res.send(_.pick(user, ["name", "email", "age"]));
  } catch (e) {
    res.status(500).send(e);
  }
});

router.post(
  "/users/me/avatar",
  auth,
  upload.single("avatar"),
  async (req, res) => {
    req.user.avatar = req.file.buffer;
    await req.user.save();
    // console.log(req.user);
    // console.log("ercannnn");
    res.send();
  },
  (err, req, res) => {
    res.status(400).send("error happned");
  }
);

router.post(
  "/users/me/avatar",
  auth,
  upload.single("avatar"),
  async (req, res) => {
    const buffer = await sharp(req.file.buffer)
      .resize({ width: 250, height: 250 })
      .png()
      .toBuffer();
    req.user.avatar = buffer;
    await req.user.save();
    res.send();
  },
  (error, req, res, next) => {
    res.status(400).send({ error: error.message });
  }
);

router.delete("/users/me/avatar", auth, async (req, res) => {
  req.user.avatar = undefined;
  await req.user.save();
  res.send(req.user);
});
router.get("/users/:id/avatar", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user || !user.avatar) {
      throw new Error("no image found");
    }
    res.set("Content-Type", "image/png");
    res.send(user.avatar);
  } catch (e) {
    res.status(400).send(e.message);
  }
});
module.exports = router;
