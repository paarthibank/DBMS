const superadminApi = require("express").Router();
const Theatre = require("../database/models/theatre");
const User = require("../database/models/user");
const Movies = require("../database/models/movies");
superadminApi.get("/dashboard", async (req, res) => {
    try {
        if (!req.cookies && !req.cookies.admin) return res.redirect("/admin/");
        const movies = await Movies.find().populate("theatre.id");
        return res.render("superadminDashboard", { movie: movies });
    } catch (error) {
        if (error) console.log(error.message);
        return res.render("error", {
            message: "Its me not you",
            redirect: "/admin",
            code: "500",
        });
    }
});
superadminApi.get("/addmovie", async (req, res) => {
    try {
        if (!req.cookies && !req.cookies.admin) return res.redirect("/admin/");
        return res.render("addmovie");
    } catch (error) {
        if (error) console.log(error.message);
        return res.render("error", {
            message: "Its me not you",
            redirect: "/admin",
            code: "500",
        });
    }
});
superadminApi.post("/addMovie/add", async (req, res) => {
    try {
        if (!req.cookies && !req.cookies.superadmin)
            return res.redirect("/admin/");
        const { name, rating, year, pic } = req.body;
        const movie = new Movies();
        movie.name = name;
        movie.year = year;
        movie.rating = rating;
        movie.picUrl = pic;
        await movie.save();
        return res.render("error", {
            message: "Successfully added",
            redirect: "/superadmin/dashboard",
            code: "200",
        });
    } catch (error) {
        if (error) console.log(error.message);
        return res.render("error", {
            message: "Its me not you",
            redirect: "/admin",
            code: "500",
        });
    }
});
superadminApi.get("/logout", async (req, res) => {
    try {
        return res.clearCookie("superadmin").redirect("/admin");
    } catch (err) {
        console.log(err);
        return res.render("error", {
            message: "Its me not you",
            redirect: "/admin",
            code: "500",
        });
    }
});
module.exports = superadminApi;
