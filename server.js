const express = require('express');
const app = express()
require("dotenv").config()
const sgMail = require('@sendgrid/mail')

const port = process.env.PORT || 4000;
const routes = require("./routes/routes")
const mongoose = require("mongoose") // new
const teams = require("./routes/TeamsAPi");
const projects = require("./routes/ProjectApi")
const cors = require("cors")
app.use(cors());
app.set("port", port)

app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use("/user", routes)
app.use("/teams", teams)
app.use("/projects", projects)

const url = `mongodb+srv://${process.env.USERNAMES}:${process.env.PASSWORD}@cluster0.dussn.mongodb.net/?retryWrites=true&w=majority`
// Connect to MongoDB database
mongoose
	.connect(url, {
		useNewUrlParser: true,
		useUnifiedTopology: true,
	})
	.then(() => {
		console.log("db attached")
		console.log(process.env.USERNAMES)
	})

app.listen(port, () =>
	console.log(`App is listening on port ${port}.`)
);