const express = require("express");
const bodyParser = require("body-parser");
const morgan = require("morgan");

const port = 3000;
const app = express();

const msg = [{user: "Azzam", text: "inital message", time: Date.now()}];
const getMsgs = () => Array.from(msg).reverse();

app.use(morgan("dev"));
app.use(bodyParser.json());
app.use(express.static("frontend"));

app.get("/poll", function (req, res) {
  res.json({
    msg: getMsgs(),
  })
});

app.post("/poll", function (req, res) {
  const {user, text} = req.body;
  msg.push({user, text, time: Date.now()});
  res.json({
    message: "Success",
  })
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
});