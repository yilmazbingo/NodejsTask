const express = require("express");
const app = express();

require("./db/mongoose");

app.use(express.json());
app.use(require("./routes/logout"));
app.use(require("./routes/user"));
app.use(require("./routes/tasks.js"));
app.use(require("./routes/auth.js"));

module.exports = app;
