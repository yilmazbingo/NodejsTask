const request = require("supertest");
const Task = require("../src/models/task");
const app = require("../src/app.js");
const { userId, user, setupDatabase } = require("./fixtures/db");

beforeEach(setupDatabase);

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
