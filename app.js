const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const bodyparser = require("body-parser");
const home = require("./routes/home");
port=3000;


const app = express();
mongoose
	.connect(
		"mongodb://localhost:27017/mongodb_assignment"
	)
	.then(() => {
		console.log("DB connected...");
	})
	.catch((err) => {
		console.log(err);
	});

app.use(bodyparser.urlencoded({ extended: false }));
app.use(bodyparser.json());

app.use("/", home);
app.listen(port, () => {
	console.log(`Sever is running on ${port}`);
});
