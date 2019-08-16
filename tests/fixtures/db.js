const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const User = require("../../src/models/user");
const Task = require("../../src/models/task.js");

const userId = new mongoose.Types.ObjectId();
const user = {
  _id: userId,
  name: "yiaz",
  email: "heer@exampl.com",
  password: "123ssssE@e",
  tokens: [{ token: jwt.sign({ _id: userId }, process.env.JWTPRIVATEKEY) }]
};

const userOneId = new mongoose.Types.ObjectId();
const userOne = {
  _id: userOneId,
  name: "erce",
  email: "heyrer@examjpl.com",
  password: "123ssssE@eee",
  tokens: [{ token: jwt.sign({ _id: userOneId }, process.env.JWTPRIVATEKEY) }]
};

const task = {
  _id: new mongoose.Types.ObjectId(),
  description: "new task",
  conpleted: false,
  owner: userId
};
const taskOne = {
  _id: new mongoose.Types.ObjectId(),
  description: "newer task",
  conpleted: true,
  owner: userOneId
};

const task2 = {
  _id: new mongoose.Types.ObjectId(),
  description: "newer than newer task",
  conpleted: true,
  owner: userOneId
};

const setupDatabase = async () => {
  await User.deleteMany();
  await new User(user).save();
  await new User(userOne).save();
  await new Task(task).save();
  await new Task(taskOne).save();
  await new Task(task2).save();
};

module.exports = {
  userId,
  user,
  setupDatabase
};
