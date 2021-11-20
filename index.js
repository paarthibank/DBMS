require("dotenv").config({ path: "./src/env/.env" });
const cookieParser = require("cookie-parser");
const express = require("express");
var bodyParser = require("body-parser");
const app = express();
const port = process.env.APP_PORT;
const path = require("path");
const fs = require("fs");
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
require("./src/database/setup.js");
app.set("view engine", "ejs");
app.set("views", path.join(__dirname + "/src/views"));
app.use(express.static("public"));
const user = require("./src/routes/user");

app.get("/", async (req, res) => res.render("index"));
app.use("/user", user);

app.listen(port, () => console.log(`server started at port ${port}`));
