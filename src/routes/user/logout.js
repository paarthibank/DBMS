logoutRouter = require("express").Router();
logoutRouter.get("/", async (req, res) => {
    try {
        return res.clearCookie("id").redirect("..");
    } catch (err) {
        console.log(err);
        return res.render("500");
    }
});
module.exports = logoutRouter;
