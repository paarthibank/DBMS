const Movies = require("../database/models/movies");
const Theatre = require("../database/models/theatre");
require("dotenv").config({ path: "./src/env/.env" });
require("../database/setup.js");
const fun = async () => {
    const movies = await Movies.find();
    const theatres = await Theatre.find();
    for (let i = 0; i < movies.length; i++) {
        let n1 = Math.floor(Math.random() * 4);
        for (let j = 0; j < 4; j++) {
            if (n1 != j) {
                movies[i].theatre.push({ id: theatres[j]._id });
            }
        }
        await movies[i].save();
    }
};
fun();
