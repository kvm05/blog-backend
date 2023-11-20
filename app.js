const express = require("express");
const bodyParser = require("body-parser")
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();


const blogRoute = require("./routes/blog-routes")
const authRoute = require("./routes/auth-routes")

const app = express();
const corsConfig = {
	origin: process.env.BASE_URL,
	credentials: true,
};

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors(corsConfig));
app.use('/api/blog', blogRoute)
app.use('/api/auth', authRoute)

app.use('/', (req, res, err) => {
    res.json({
        authorization:"/api/auth",
        blog: "/api/blog",
    })
})

app.use((error, req, res, next) => {
    if(res.headerSent){
        return next(error)
    }
    res.status(error.code || 500)
    res.json({message: error.message || "Unknown error occurred!"})
})

mongoose
	.connect(
		"mongodb+srv://"+process.env.MONGO_DB_USERNAME+":"+process.env.MONGO_DB_PASSWORD+"@atlascluster.p10vsxv.mongodb.net/blogDB?retryWrites=true&w=majority"
	)
	.then(() => {
		app.listen(5000);
	})
	.catch((err) => {
		console.log(err);
	});