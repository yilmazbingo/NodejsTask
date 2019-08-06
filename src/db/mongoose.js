const mongoose = require("mongoose");

mongoose
  .connect("mongodb://127.0.0.1:27017/task-test", {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false
  })
  .catch(err => {
    console.log(err.message);
    process.exit(1);
  })
  .then(() => {
    console.log("connected to mongodb");
  });
