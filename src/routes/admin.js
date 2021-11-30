const adminApi = require("express").Router();
const Theatre = require("../database/models/theatre");
const User = require("../database/models/user");
const Movie = require("../database/models/movies");
const bcrypt = require("bcrypt");
adminApi.get("/", async (req, res) => {
    try {
        if (req.cookies && req.cookies.admin)
            return res.redirect("/admin/theatre/dashboard");
        return res.render("adminLogin");
    } catch (error) {
        if (error) console.log(error.message);
        return res.render("error", {
            message: "Its me not you",
            redirect: "/admin",
            code: "500",
        });
    }
});
adminApi.post("/login", async (req, res) => {
    try {
        const { username, password } = req.body;
        // console.log(req.body);
        if (!username || !password)
            return res.render("error", {
                message: "Enter all the details",
                redirect: "/admin",
                code: "404",
            });
        const user = await Theatre.findOne({ username });
        if (!user)
            return res.render("error", {
                message: "User not found",
                redirect: "/admin",
                code: "404",
            });
        if (!(await bcrypt.compare(password, user.password)))
            return res.render("error", {
                message: "Incorrect password",
                redirect: "/admin",
                code: "400",
            });
        return res
            .cookie("admin", user._id)
            .redirect("../admin/theatre/dashboard");
    } catch (error) {
        if (error) console.log(error.message);
        return res.render("error", {
            message: "Its me not you",
            redirect: "/admin",
            code: "500",
        });
    }
});
adminApi.get("/theatre/dashboard", async (req, res) => {
    try {
        if (!req.cookies || !req.cookies.admin) return res.redirect("/admin");
        const { admin } = req.cookies;
        const adminDetail = await Theatre.findById(admin);
        const userList = await User.find({
            "moviesBooked.theatre": admin,
        })
            .select("name username mobileNo gender moviesBooked")
            .populate("moviesBooked.id");
        const data = {
            adminDetail,
            userList,
        };
        for (let i = 0; i < userList.length; i++) {
            for (let j = 0; j < userList[i].moviesBooked.length; j++) {
                if (
                    userList[i].moviesBooked[j].theatre.toString() !==
                    adminDetail._id.toString()
                ) {
                    userList[i].moviesBooked.splice(j, 1);
                    j--;
                }
            }
        }
        return res.render("adminDashboard", data);
    } catch (error) {
        if (error) console.log(error.message);
        return res.render("error", {
            message: "Its me not you",
            redirect: "/admin",
            code: "500",
        });
    }
});
adminApi.get("/logout", async (req, res) => {
    try {
        return res.clearCookie("admin").redirect("/admin");
    } catch (err) {
        console.log(err);
        return res.render("error", {
            message: "Its me not you",
            redirect: "/admin",
            code: "500",
        });
    }
});

adminApi.get("/theatre/addMovie", async (req, res) => {
    try {
        if (!req.cookies || !req.cookies.admin)
            return res.redirect("/admin/");
        return res.render("addMovie");
    } catch (error) {
        if (error) console.log(error.message);
        return res.render("error", {
            message: "Its me not you",
            redirect: "/admin",
            code: "500",
        });
    }
});
adminApi.post("/addMovie", async (req, res) => {
    try {
        if (!req.cookies || !req.cookies.admin)
            return res.redirect("/admin/");
        const {name,noOfTickets,rating,year} = req.body;
        console.log(name,noOfTickets,rating,year);
        const movie = new Movie();
        movie.name=name;
        movie.noOfTickets=noOfTickets;
        movie.year=year;
        movie.rating = rating;
        movie.save();
        return res.redirect("/theatre/dashboard");
    } catch (error) {
        if (error) console.log(error.message);
        return res.render("error", {
            message: "Its me not you",
            redirect: "/admin",
            code: "500",
        });
    }
});

module.exports = adminApi;
