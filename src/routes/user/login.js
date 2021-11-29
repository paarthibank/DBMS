const login = require("express").Router();
const User = require("../../database/models/user");
const bcrypt = require("bcrypt");
login.post("/", async (req, res) => {
    try {
        const { username, password } = req.body;
        // console.log(req.body);
        if (!username || !password)
            return res.render("Error", {
                message: "Enter all the details",
                redirect: "/",
                code: "404",
            });
        const user = await User.findOne({ username });
        if (!user)
            return res.render("Error", {
                message: "User not found",
                redirect: "/",
                code: "404",
            });
        console.log(await bcrypt.compare(password, user.password));
        if (!(await bcrypt.compare(password, user.password)))
            return res.render("Error", {
                message: "Incorrect username and password",
                redirect: "/",
                code: "400",
            });

        return res.cookie("id", user._id).redirect("../user/pages/dashboard");
    } catch (error) {
        if (error) console.log(error.message);
        return res.render("Error", {
            message: "Its me not you",
            redirect: "/",
            code: "500",
        });
    }
});
module.exports = login;
