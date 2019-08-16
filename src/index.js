const app = require("./app.js");
if (!process.env.JWTPRIVATEKEY) {
  console.log("jwt private key is not set up. process ending");
  process.exit(1);
}
const port = process.env.PORT;
app.listen(port, () => {
  console.log("listening");
});
