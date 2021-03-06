const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    name: String,
    username: String,
    password: String,
    mobileNo: String,

    gender: {
        type: String,
        enum: ["Male", "Female"],
    },
    moviesBooked: [
        {
            id: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Movie",
            },
            seat: String,
            theatre: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Theatre",
            },
            timeslot: String,
            _id: false,
        },
    ],
});

module.exports = mongoose.model("User", userSchema);
