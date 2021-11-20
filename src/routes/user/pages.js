const User = require("../../database/models/user");
const mongoose = require("mongoose");
const Movies = require("../../database/models/movies");
const pages = require("express").Router();
pages.get("/dashboard", async (req, res) => {
    try {
        if (!req.cookies) res.redirect("../..");
        if (!mongoose.Types.ObjectId.isValid(req.cookies.id))
            res.status(500)
                .json({ message: "Server error. Try again later" })
                .render("500");
        const user = await User.findById(req.cookies.id)
            .populate("moviesBooked.id")
            .populate("moviesBooked.theatre");
        const movies = await Movies.find().populate("theatre.id");
        const data = {
            user: user,
            movie: movies,
        };
        console.log(user);
        if (user) res.status(200).render("dashboard", data);
    } catch (error) {
        if (error) console.log(error.message);
        res.status(500)
            .json({ message: "Server error. Try again later" })
            .render("500");
    }
});
pages.get("/movies", async (req, res) => {
    try {
    } catch (error) {
        if (error) console.log(error.message);
        res.status(500)
            .json({ message: "Server error. Try again later" })
            .render("500");
    }
});
pages.get("/signup", async (req, res) => {
    try {
        res.status(200).render("signup");
    } catch (error) {
        if (error) console.log(error.message);
        res.status(500)
            .json({ message: "Server error. Try again later" })
            .render("500");
    }
});
module.exports = pages;
