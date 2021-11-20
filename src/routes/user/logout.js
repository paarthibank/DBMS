logoutRouter = require("express").Router();
logoutRouter.get("/", async (req, res) => {
    try {
        res.clearCookie("id").redirect("..");
    } catch (err) {
        console.log(err);
        res.render("500");
    }
});
module.exports = logoutRouter;
