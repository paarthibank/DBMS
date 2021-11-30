const Movies = require("../../database/models/movies");
const User = require("../../database/models/user");
const Theatre = require("../../database/models/theatre");
const theatre = require("../../database/models/theatre");
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
        return res.render("dashboard", data);
    } catch (error) {
        console.log(error.mesage);
        return res.render("error", {
            message: "Its me not you",
            redirect: "/",
            code: "500",
        });
    }
});

apiRoutes.post("/bookseat", async (req, res) => {
    try {
        const { theatreId, movie, timeslot } = req.body;
        const userId = req.cookies.id;
        if (!theatreId || !movie || !userId || timeslot == "NULL")
            return res.render("error", {
                message: "Select timeslot",
                redirect: "/",
                code: "400",
            });
        const cmovie = await Movies.findById(movie);
        let seatblocked;
        cmovie.theatre.forEach((element) => {
            if (element.id == theatreId) {
                element.timings.forEach((time) => {
                    if (time.time == timeslot) seatblocked = time.seatsBlocked;
                });
            }
        });
        const data = {
            seatblocked: seatblocked,
            movie: cmovie,
            movieId: movie,
            theatreId: theatreId,
            timeslot: timeslot,
        };

        return res.render("bookseat", data);
    } catch (error) {
        if (error) console.log(error);
        return res.render("error", {
            message: "Its me not you",
            redirect: "/admin",
            code: "500",
        });
    }
});

apiRoutes.post("/book", async (req, res) => {
    try {
        const { seatNo, theatreId, movie, timeslot } = req.body;
        const userId = req.cookies.id;
        if (seatNo == "NULL" || !theatreId || !movie || !userId)
            return res.render("error", {
                message: "Seat no undefined",
                redirect: "/",
                code: "400",
            });

        const updateData = {
            id: movie,
            seat: seatNo,
            theatre: theatreId,
            timeslot: timeslot,
        };
        const movies = await Movies.findOne({ _id: movie });

        for (let i = 0; i < movies.theatre.length; i++) {
            if (movies.theatre[i].id == theatreId) {
                for (let j = 0; j < movies.theatre[i].timings.length; j++) {
                    if (movies.theatre[i].timings[j].time == timeslot) {
                        if (
                            movies.theatre[i].timings[j].seatsBlocked.includes(
                                seatNo
                            )
                        ) {
                            return res.redirect("../pages/dashboard");
                        }
                        movies.theatre[i].timings[j].seatsBlocked.push(seatNo);
                    }
                }
            }
        }
        await movies.save();
        const user = await User.findByIdAndUpdate(userId, {
            $addToSet: { moviesBooked: updateData },
        });

        const cmovie = await Movies.findById(movie);
        let seatblocked;
        cmovie.theatre.forEach((element) => {
            if (element.id == theatreId) {
                element.timings.forEach((time) => {
                    if (time.time == timeslot) seatblocked = time.seatsBlocked;
                });
            }
        });
        const data = {
            seatblocked: seatblocked,
            movie: cmovie,
            movieId: movie,
            theatreId: theatreId,
            timeslot,
        };
        return res.render("bookseat", data);
    } catch (error) {
        if (error) console.log(error);
        return res.render("error", {
            message: "Its me not you",
            redirect: "/admin",
            code: "500",
        });
    }
});

module.exports = apiRoutes;
