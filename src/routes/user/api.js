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
        return res.render("dashboard", data);
    } catch (error) {
        console.log(error.mesage);
        return res.render("500");
    }
});

apiRoutes.post("/book", async (req, res) => {
    try {
        console.log(req.body);
        const { seatNo, theatreId, movie } = req.body;
        const userId = req.cookies.id;
        if (seatNo == "NULL" || !theatreId || !movie || !userId)
            return res
                .cookie("message", "Seat No undefined")
                .redirect("../pages/dashboard");

        const updateData = {
            id: movie,
            seat: seatNo,
            theatre: theatreId,
        };
        const movies = await Movies.findOne({ _id: movie });

        for (let i = 0; i < movies.theatre.length; i++) {
            if (movies.theatre[i].id == theatreId) {
                if (movies.theatre[i].seatsBlocked.includes(seatNo)) {
                    return res
                        .cookie("message", "Seat Already Booked")
                        .redirect("../pages/dashboard");
                }
                movies.theatre[i].seatsBlocked.push(seatNo);
            }
        }
        await movies.save();
        const user = await User.findByIdAndUpdate(userId, {
            $addToSet: { moviesBooked: updateData },
        });

        return res
            .cookie("message", "Ticket booked successfully")
            .redirect("../pages/dashboard");
    } catch (error) {
        if (error) console.log(error);
        return res.render("500");
    }
});
module.exports = apiRoutes;
