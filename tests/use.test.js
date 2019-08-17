const request = require("supertest");
const app = require("../src/app.js");
const User = require("../src/models/user");
const { userId, user, setupDatabase } = require("./fixtures/db");

beforeEach(setupDatabase);

test("Should signup a new user", async () => {
  const response = await request(app)
    .post("/users")
    .send({
      name: "Andrew",
      email: "andrew@example.com",
      password: "MyPass777!"
    })
    .expect(201);

  // Assert that the database was changed correctly
  const user = await User.findById(response.body.user._id);
  expect(user).not.toBeNull();

  // Assertions about the response
  expect(response.body).toMatchObject({
    user: {
      name: "Andrew",
      email: "andrew@example.com"
    },
    token: user.tokens[0].token
  });
  expect(user.password).not.toBe("MyPass777!");
});

// test("it should post user", async () => {
//   const response = await request(app)
//     .post("/users")
//     .send({
//       name: "Andrew",
//       email: "andrew@example.com",
//       password: "MyPass777!"
//     })
//     .expect(201);
//   const user = await User.findById(response.body.user._id);
//   expect(user).not.toBeNull();
// });

test("Should get the profile for the user", async () => {
  await request(app)
    .get("/users/me")
    .set("Authorization", `Bearer ${user.tokens[0].token}`)
    .send()
    .expect(200);
});

// test("Should log in existing user", async () => {
//   await request(app)
//     .post("/users/login")
//     .set("Authorization", `Bearer ${user.tokens[0].token}`)
//     .send({ email: user.email, password: user.password })
//     .expect(200);
// });
test("Should login existing user", async () => {
  const response = await request(app)
    .post("/users/login")
    .send({
      email: user.email,
      password: user.password
    })
    .expect(200);
  const user = await User.findById(userOneId);
  expect(response.body.token).toBe(user.tokens[1].token);
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
