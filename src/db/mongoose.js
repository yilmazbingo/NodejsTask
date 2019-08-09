const mongoose = require("mongoose");

mongoose
  .connect(process.env.MONGODB_URL, {
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
