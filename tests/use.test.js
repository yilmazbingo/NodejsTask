const request = require("supertest");
const app = require("../src/app.js");
const User = require("../src/models/user");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");

const userId = new mongoose.Types.ObjectId();
console.log(userId);

const user = {
  _id: userId,
  name: "yiaz",
  email: "heer@exampl.com",
  password: "123ssssE@e",
  tokens: [{ token: jwt.sign({ _id: userId }, process.env.JWTPRIVATEKEY) }]
};
console.log(user);

beforeEach(async () => {
  await User.deleteMany();
  await new User(user).save();
});
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
// test("Should log in existing user", async () => {
//   await request(app)
//     .post("users/login")
//     .send({ email: user.email, password: user.password })
//     .expect(200);
// });

test("Should upload avatar", async () => {
  await request(app).post("./users/me/avatar");
});
