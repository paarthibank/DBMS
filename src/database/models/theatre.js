const mongoose = require("mongoose");
const theatreSchema = new mongoose.Schema({
    name: String,
    location: String,
    username: String,
    password: String,
});

module.exports = mongoose.model("Theatre", theatreSchema);
