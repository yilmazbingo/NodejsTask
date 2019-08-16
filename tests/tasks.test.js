const request = require("supertest");
const Task = require("../src/models/task");
const app = require("../src/app.js");
const {
  userId,
  userOne,
  userOneId,
  user,
  setupDatabase,
  task,
  taskOne,
  task2
} = require("./fixtures/db");

beforeEach(setupDatabase);

test("get tasks by userone", async () => {
  const response = await request(app)
    .get("/tasks")
    .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
    .expect(200);
  expect(response.body.length).toBe(2);
});

test("should create task for user", async () => {
  const response = await request(app)
    .post("/tasks")
    .set("Authorization", `Bearer ${user.tokens[0].token}`)
    .send({
      description: "test"
    })
    .expect(201);
  const task = await Task.findById(response.body._id);
  expect(task).not.toBeNull();
});

// test("should user fail at deleteing the taskOne", async () => {
//   const response = await request(app)
//     .delete(`/tasks/${taskOne._id}`)
//     .set("Authorization", `Bearer ${user.tokens[0].token}`)
//     .expect(404);
// });

// test("Should not delete other users tasks", async () => {
//   const response = await request(app)
//     .delete(`/tasks/${taskOne._id}`)
//     .set("Authorization", `Bearer ${user.tokens[0].token}`)
//     .send()
//     .expect(404);
//   const task = await Task.findById(taskOne._id);
//   expect(task).not.toBeNull();
// });
