const express = require("express");
const { join } = require("path");
const morgan = require("morgan");
const helmet = require("helmet");
const app = express();

app.use(morgan("dev"));
app.use(
  helmet({
    contentSecurityPolicy: false,
  })
);
app.use(express.static(join(__dirname, "public")));

app.get("auth_config.json", (req, res) => {
  res.sendFile(join(__dirname,"src", "auth_config.json"));
});

app.get("/*", (_, res) => {
  res.sendFile(join(__dirname,"src", "index.html"));
});

process.on("SIGINT", function() {
  process.exit();
});

module.exports = app;
