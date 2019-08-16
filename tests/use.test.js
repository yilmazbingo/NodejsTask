const request = require("supertest");
const app = require("../src/app.js");
const User = require("../src/models/user");
const { userId, user, setupDatabase } = require("./fixtures/db");

beforeEach(setupDatabase);

const userOne = {
  name: "yilmaz",
  email: "hhheer@exampl.com",
  password: "123ssssE@e"
};

test("it should post user", async () => {
  await request(app)
    .post("/users")
    .send(userOne)
    .expect(201);
});

test("Should get the profile for the user", async () => {
  await request(app)
    .get("/users/me")
    .set("Authorization", `Bearer ${user.tokens[0].token}`)
    .send()
    .expect(200);
});
test("Should log in existing user", async () => {
  await request(app)
    .post("users/login")
    .set("Authorization", `Bearer ${user.tokens[0].token}`)
    .send({ email: user.email, password: user.password })
    .expect(200);
});

test("Should upload avatar", async () => {
  await request(app)
    .post("/users/me/avatar")
    .set("Authorization", `Bearer ${user.tokens[0].token}`)
    .attach("avatar", "tests/fixtures/res.png")
    .expect(200);

  const userr = await User.findById(userId);
  expect(userr.avatar).toEqual(expect.any(Buffer));
});

test("should update user", async () => {
  await request(app)
    .patch("/users/me")
    .set("Authorization", `Bearer ${user.tokens[0].token}`)
    .send({ name: "yilmaz" })
    .expect(200);
  const userr = await User.findById(userId);
  expect(userr.name).toEqual("yilmaz");
});

test("should not valid invalid user fields  ", async () => {
  await request(app)
    .patch("/users/me")
    .set("Authorization", `Bearer ${user.tokens[0].token}`)
    .send({ nam: "yilmaz" })
    .expect(400);
});
