const register = require("express").Router();
const User = require("../../database/models/user");
const bcrypt = require("bcrypt");
register.post("/", async (req, res) => {
    try {
        console.log(req.body);
        const { name, username, pwd, cnfpwd, mobile } = req.body;
        if (pwd !== cnfpwd)
            res.status(400).json("Incorrect username and password");
        const password = await bcrypt.hash(pwd, 10);
        const user = await User.create({
            name: name,
            mobile: mobile,
            password: password,
            username: username,
        });
        res.status(200).redirect("/");
    } catch (error) {
        console.log(error.message);
        res.status(500)
            .json({ message: "Server error, Try again later" })
            .render("500");
    }
});
module.exports = register;
