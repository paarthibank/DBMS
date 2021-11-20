const register = require("express").Router();
const User = require("../../database/models/user");
const bcrypt = require("bcrypt");
register.post("/", async (req, res) => {
    try {
        console.log(req.body);
        const { name, username, pwd, mobile } = req.body;
        const password = await bcrypt.hash(pwd, 10);
        const user = await User.create({
            name: name,
            mobile: mobile,
            password: password,
            username: username,
        });
        return res.redirect("/");
    } catch (error) {
        console.log(error.message);
        return res.render("500");
    }
});
module.exports = register;
