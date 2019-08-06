// const mongodb = require("mongodb"); //an object
const { MongoClient, ObjectID } = require("mongodb");

const id = new ObjectID();
console.log(id);
console.log(id.id.length);
console.log(id.toHexString().length);
MongoClient.connect(
  "mongodb://127.0.0.1:27017",
  { useNewUrlParser: true },
  (err, client) => {
    if (err) {
      return console.log("unable to connect");
    }
    console.log("connected");
    client
      .db("task-manager")
      .collection("users")
      .insertOne({ nam: "yimaz", lastname: "bigol" }, (err, result) => {
        if (err) {
          console.log("error");
        }
        // console.log(result);
      });
    client
      .db("tasks")
      .collection("new")
      .insertMany([{ n: true }, { e: "rree" }], (err, result) => {
        // console.log(result.ops);
      });
    client
      .db("task-manager")
      .collection("users")
      .find({ nam: "yimaz" })
      .toArray((error, result) => {
        console.log(result);
      });
  }
);
