const mongoose = require("mongoose");

const movieSchema = new mongoose.Schema({
    name: String,
    picUrl: String,
    noOfTickets: String,
    rating: String,
    year: Number,
    theatre: [
        {
            id: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Theatre",
            },
            timings: [
                {
                    seatsBlocked: [String],
                    time: String,
                },
            ],
        },
    ],
});

module.exports = mongoose.model("Movie", movieSchema);
