const express = require("express");
const router = new express.Router();
const Task = require("../models/task.js");
const auth = require("../middleware/auth");

router.post("/tasks", auth, async (req, res) => {
  //owner should not be specified via the request. it gets from auth middleware
  const task = new Task({ ...req.body, owner: req.user._id });
  try {
    await task.save();
    res.status(201).send(task);
  } catch (e) {
    res.status(500).send(e);
  }
});

router.get("/tasks", auth, async (req, res) => {
  const match = {};
  const sort = {};
  if (req.query.completed) {
    match.completed = req.query.completed === "true";
  }
  if (req.query.sortBy) {
    const parts = req.query.sortBy.split("=");
    sort[parts[0]] = parts[1] === "desc" ? -1 : 1;
  }
  try {
    await req.user
      .populate({
        path: "tasks",
        match,
        options: {
          limit: parseInt(req.query.limit),
          skip: parseInt(req.query.skip),
          sort
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
