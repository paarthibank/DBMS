const login = require("express").Router();
const User = require("../../database/models/user");
const bcrypt = require("bcrypt");
login.post("/", async (req, res) => {
    try {
        const { username, password } = req.body;
        // console.log(req.body);
        if (!username || !password) return res.redirect("/");
        const user = await User.findOne({ username });
        if (!user) return res.redirect("/");
        console.log(await bcrypt.compare(password, user.password));
        if (!(await bcrypt.compare(password, user.password)))
            return res.redirect("/");

        return res.cookie("id", user._id).redirect("../user/pages/dashboard");
    } catch (error) {
        if (error) console.log(error.message);
        return res.render("500");
    }
});
module.exports = login;
