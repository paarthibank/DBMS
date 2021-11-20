const mongoose = require("mongoose");
const theatreSchema = new mongoose.Schema({
    name: String,
    location: String,
});

module.exports = mongoose.model("Theatre", theatreSchema);
