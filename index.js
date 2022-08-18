const express = require("express");
const app = express();
const port = 3000;

app.get("/", (req, res) => {
  res.send("TEST route");
});

app.listen(port, () => {
  console.log(`PTP API listens on ${port} port.`);
});
