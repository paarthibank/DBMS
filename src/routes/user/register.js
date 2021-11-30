const register = require("express").Router();
const User = require("../../database/models/user");
const bcrypt = require("bcrypt");
register.post("/", async (req, res) => {
    try {
        const { name, username, pwd, mobile, gender, cnfpwd } = req.body;
        if (pwd != cnfpwd)
            return res.render("error", {
                message: "Password mismatch",
                redirect: "/user/pages/signup",
                code: "400",
            });
        const password = await bcrypt.hash(pwd, 10);
        if (gender != "Male" && gender != "Female")
            return res.render("error", {
                message: "Choose gender",
                redirect: "/user/pages/signup",
                code: "400",
            });
        if (await User.findOne({ username: username }))
            return res.render("error", {
                message: "User already registered",
                redirect: "/user/pages/signup",
                code: "400",
            });
        const user = await User.create({
            name: name,
            mobile: mobile,
            password: password,
            username: username,
            gender: gender,
        });
        return res.redirect("/");
    } catch (error) {
        console.log(error.message);
        return res.render("error", {
            message: "Its me not you",
            redirect: "/",
            code: "500",
        });
    }
});
module.exports = register;
