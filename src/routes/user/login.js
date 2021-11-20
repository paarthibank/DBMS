const login = require("express").Router();
const User = require("../../database/models/user");
const bcrypt = require("bcrypt");
login.post("/", async (req, res) => {
    try {
        const { username, password } = req.body;
        // console.log(req.body);
        if (!username || !password)
            res.status(404).redirect("/").json({ message: "Fill all fields" });
        const user = await User.findOne({ username });
        if (!user)
            res.status(404).json({ message: "User not found" }).redirect("/");
        if (!(await bcrypt.compare(password, user.password)))
            res.json({ message: "Incorrect usename or password" }).redirect(
                "/"
            );

        res.cookie("id", user._id).redirect("../user/pages/dashboard");
    } catch (error) {
        if (error) console.log(error.message);
        res.status(500)
            .json({ message: "Server error. Try again later" })
            .render("500");
    }
});
module.exports = login;
