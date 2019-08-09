const app = require("./app.js");
if (!process.env.JWTPRIVATEKEY) {
  process.exit(1);
}
const port = process.env.PORT;
app.listen(port, () => {
  console.log("listening");
});

// const main = async () => {
//   const task = await Task.findById("5d252b73ac621e2f1c45f482");
//   const populated = await task.populate("owner").execPopulate();
//   console.log("populated", populated.owner);
//   // console.log(task.owner);
// };

// const reverse = async () => {
//   const user = await User.findById("5d2528ef38aafe10bc07d113");
//   const populated = await user.populate("tasks").execPopulate();
//   console.log("a", populated.tasks);
// };
