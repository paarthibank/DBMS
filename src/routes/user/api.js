const Movies = require("../../database/models/movies");
const User = require("../../database/models/user");
const Theatre = require("../../database/models/theatre");
const apiRoutes = require("express").Router();

apiRoutes.post("/search", async (req, res) => {
    try {
        const { search } = req.body; ///name="name" search="anna"
        const movies = await Movies.find({
            name: {
                $regex: new RegExp(search, "i"),
            },
        }).populate("theatre.id");
        const user = await User.findById(req.cookies.id).populate(
            "moviesBooked.id"
        );
        const data = { movie: movies, user: user };
        res.status(200).render("dashboard", data);
    } catch (error) {
        console.log(error.mesage);
        res.status(500)
            .json({ message: "Server error, Try again later" })
            .render("500");
    }
});

apiRoutes.post("/book", async (req, res) => {
    try {
        console.log(req.body);
        const { seatNo, theatreId, movie } = req.body;
        const userId = req.cookies.id;
        if (!seatNo || !theatreId || !movie || !userId)
            res.status(404).redirect("../../dashboard");
        const updateData = {
            id: movie,
            seat: seatNo,
            theatre: theatreId,
        };
        const user = await User.findByIdAndUpdate(userId, {
            $addToSet: { moviesBooked: updateData },
        });
        const movies = await Movies.findOne({ _id: movie });
        for (let i = 0; i < movies.theatre.length; i++) {
            if (movies.theatre[i].id == theatreId) {
                console.log("yess");
                movies.theatre[i].seatsBlocked.push(seatNo);
            }
        }
        await movies.save();
        res.redirect("../../dashboard");
    } catch (error) {
        if (error) console.log(error);
        return res.render("500");
    }
});
module.exports = apiRoutes;
