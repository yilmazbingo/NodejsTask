const request = require("supertest");
const app = require("../src/app.js");
const User = require("../src/models/user");

const userOne = {
  name: "yilmaz",
  email: "hhheehgr@exampl.com",
  password: "123ssssE@e"
};

// //if u have async code u have to inform jest
// beforeEach(async () => {
//   try {
//     await User.deleteMany();
//     await new User(userOne).save();
//   } catch (e) {
//     console.log(e);
//   }
// });

// test("should sign up a new user", async () => {
//   await request(app)
//     .post("/users")
//     .send({
//       name: "yilmaz",
//       age: "23",
//       email: "hhheer@exampl.com",
//       password: "123ssssE@e"
//     })
//     .expect(201);
// });

// test("should log in existing user", async () => {
//   await request(app)
//     .post("/users/login")
//     .send({ email: userOne.email, password: userOne.password })
//     .expect(200);
// });

beforeEach(async () => {
  await User.deleteMany();
  await new User(userOne).save();
});

test("Should signup a new user", async () => {
  await request(app)
    .post("/users")
    .send({
      name: "Andrew",
      email: "andrew@example.com",
      password: "MyPass777!"
    })
    .expect(201);
});

test("Should login existing user", async () => {
  await request(app)
    .post("/users/login")
    .send({
      email: userOne.email,
      password: userOne.password
    })
    .expect(200);
});

// const request = require("supertest");
// const app = require("../src/app");
// const User = require("../src/models/user");

// const userOne = {
//   name: "Mikee",
//   email: "mike@example.com",
//   password: "56what!!"
// };

// beforeEach(async () => {
//   await User.deleteMany();
//   await new User(userOne).save();
// });

// test("Should signup a new user", async () => {
//   await request(app)
//     .post("/users")
//     .send({
//       name: "Andrew",
//       email: "andrew@example.com",
//       password: "MyPass777!"
//     })
//     .expect(201);
// });

// test("Should login existing user", async () => {
//   await request(app)
//     .post("/users/login")
//     .send({
//       email: userOne.email,
//       password: userOne.password
//     })
//     .expect(200);
// });
