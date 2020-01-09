const cors = require("cors");
const express = require("express");
const bodyParser = require("body-parser");
const multer = require("multer");
const fs = require("fs");
const path = require("path");
const app = express();
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
const upload = multer({ dest: path.join(__dirname, "uploads/") }).single(
  "icon"
);

const db = {
  login() {},
  list() {},
  add() {},
  delete() {},
  search() {},
  edit() {}
};
