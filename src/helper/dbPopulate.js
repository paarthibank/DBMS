var request = require("request");
require("dotenv").config({ path: "./src/env/.env" });
var options = {
    method: "GET",
    url: `https://imdb-api.com/tamil/API/Top250Movies/${process.env.API_KEY}`,
    headers: {},
};
require("../database/setup.js");
const Movies = require("../database/models/movies");
request(options, async function (error, response) {
    if (error) throw new Error(error);
    const data = JSON.parse(response.body).items;
    console.log("started");
    let i = 0;
    for await (const movie of data) {
        await Movies.create({
            name: movie.title,
            picUrl: movie.image,
            rating: movie.imDbRating,
            year: movie.year,
        });
        i++;
        if (i == 10) break;
        console.log("completed");
    }
});
