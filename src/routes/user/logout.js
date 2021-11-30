logoutRouter = require("express").Router();
logoutRouter.get("/", async (req, res) => {
    try {
        return res.clearCookie("id").redirect("..");
    } catch (err) {
        console.log(err);
        return res.render("error", {
            message: "Its me not you",
            redirect: "/",
            code: "500",
        });
    }
});
module.exports = logoutRouter;
