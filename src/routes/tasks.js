const express = require("express");
const router = new express.Router();
const Task = require("../models/task.js");
const auth = require("../middleware/auth");

router.post("/tasks", auth, async (req, res) => {
  // const task = new Task({
  //   description: req.body.description,
  //   completed: req.body.completed
  // });
  const task = new Task({ ...req.body, owner: req.user._id });
  try {
    await task.save();
    res.status(200).send(task);
  } catch (e) {
    res.status(500).send(e.message);
  }
});

router.get("/tasks", auth, async (req, res) => {
  const match = {};

  if (req.query.completed) {
    match.completed = req.query.completed === "true";
    const x = await Task.find(match);
    // console.log(x);
  }
  try {
    await req.user
      .populate({
        path: "tasks",
        match,
        options: {
          limit: parseInt(req.query.limit),
          skip: parseInt(req.query.skip)
        }
      })
      .execPopulate();

    res.status(200).send(req.user.tasks);
  } catch (e) {
    res.status(500).send(e);
  }
});
router.get("/tasks/:id", auth, async (req, res) => {
  try {
    // const task = await Task.findById(req.params.id);
    const task = await Task.findOne({
      _id: req.params.id
    });
    console.log("control", task);
    if (req.user.owner || req.user.isAdmin) {
      res.status(200).send(task);
    }

    return res.status(400).send("invalid id");
  } catch (e) {
    res.status(500).send();
  }
});

router.patch("/tasks/:id", async (req, res) => {
  const requestedUpdates = Object.keys(req.body);
  const allowedUpdate = ["description", "isCompleted"];
  const isValidPatch = requestedUpdates.every(update =>
    allowedUpdate.includes(update)
  );
  if (!isValidPatch) {
    return res.status(400).send({ error: "invalid update operation" });
  }

  try {
    const task = await Task.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    if (!task) {
      return res.status(400).send("invalid id");
    }
  } catch (e) {
    res.status(500).send(e);
  }
});

router.delete("/tasks/:id", async (req, res) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);
    if (!task) {
      return res.status(400).send("invalid id");
    }
    res.send(task);
  } catch (e) {
    res.status(500).send();
  }
});
module.exports = router;
