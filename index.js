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
const adminApi = require("./src/routes/admin.js");
const superadminApi = require("./src/routes/superadmin");

app.get("/", async (req, res) => {
    if (req.cookies && req.cookies.id)
        return res.redirect("/user/pages/dashboard");
    return res.render("index");
});
app.use("/user", user);
app.use("/admin", adminApi);
app.use("/superadmin", superadminApi);

app.listen(port, () => console.log(`server started at port ${port}`));
