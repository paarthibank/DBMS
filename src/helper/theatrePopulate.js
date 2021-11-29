const Movies = require("../database/models/movies");
const Theatre = require("../database/models/theatre");
require("dotenv").config({ path: "./src/env/.env" });
require("../database/setup.js");
const fun = async () => {
    const movies = await Movies.find();
    const theatres = await Theatre.find();
    for (let i = 0; i < movies.length; i++) {
        let n1 = Math.floor(Math.random() * 4);
        let m = 0;
        for (let j = 0; j < 4; j++) {
            if (n1 != j) {
                movies[i].theatre.push({ id: theatres[j]._id });
                let n3 = Math.floor(Math.random() * 9);
                n3++;
                for (let k = 0; k < n3; k++) {
                    let n4 = Math.floor(Math.random() * 25);
                    let n2 = Math.floor(Math.random() * 32);
                    if (n4 >= 12)
                        movies[i].theatre[m].timings.push({
                            time: `${n2}th Dec ${n4 - 12} PM`,
                        });
                    else
                        movies[i].theatre[m].timings.push({
                            time: `${n2}th Dec ${n4} AM`,
                        });
                }
                m++;
            }
        }
        await movies[i].save();
    }
    console.log("completed");
    return;
};
fun();
