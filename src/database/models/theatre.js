const mongoose = require("mongoose");
const theatreSchema = new mongoose.Schema({
    name: String,
    location: String,
    username: String,
    password: String,
    pic: String,
});

module.exports = mongoose.model("Theatre", theatreSchema);
