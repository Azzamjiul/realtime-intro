const express = require("express");
const bodyParser = require("body-parser");
const morgan = require("morgan");

const port = 3000;
const app = express();

const msg = [];
const getMsgs = () => Array.from(msg).reverse();

app.use(morgan("dev"));
app.use(bodyParser.json());
app.use(express.static("frontend"));

app.get("/poll", function (req, res) {
});

app.post("/poll", function (req, res) {
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
});