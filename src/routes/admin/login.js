const adminApi = require("express").Router();

adminApi.post("/theatre/login", async (req, res) => {
    try {
        const { username, password } = req.body;
        // console.log(req.body);
        if (!username || !password) return res.redirect("/");
        const user = await Theatre.findOne({ username });
        if (!user) return res.redirect("/");
        if (!(await bcrypt.compare(password, user.password)))
            return res.redirect("/");

        return res.cookie("admin", user._id).redirect("../user/pages/dashboard");
    } catch (error) {
        if (error) console.log(error.message);
        return res.render("500");
    }
});
