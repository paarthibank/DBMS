const User = require("../../database/models/user");
const mongoose = require("mongoose");
const Movies = require("../../database/models/movies");
const pages = require("express").Router();
pages.get("/dashboard", async (req, res) => {
    try {
        if (!req.cookies) res.redirect("../..");
        if (!mongoose.Types.ObjectId.isValid(req.cookies.id))
            return res.redirect("../..");
        let message;
        if (req.cookies.message) {
            message = req.cookies.message;
            res.clearCookie("message");
        }
        const user = await User.findById(req.cookies.id)
            .populate("moviesBooked.id")
            .populate("moviesBooked.theatre");
        const movies = await Movies.find().populate("theatre.id");
        const data = {
            user: user,
            movie: movies,
            message: message,
        };
        return res.render("dashboard", data);
    } catch (error) {
        if (error) console.log(error.message);
        return res.render("500");
    }
});

pages.get("/signup", async (req, res) => {
    try {
        return res.status(200).render("signup");
    } catch (error) {
        if (error) console.log(error.message);
        res.render("500");
    }
});
pages.get("/booker", async (req, res) => {
    try {
        res.status(200).render("bookseat");
    } catch (error) {
        if (error) console.log(error.message);
        res.render("500");
    }
});
module.exports = pages;
