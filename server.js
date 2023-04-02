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

app.get("/sendEmail", async (req, res) => {
	try {
		sendEmail()
		res.send("done")
	} catch (error) {
		res.json(error)
	}

})

function sendEmail() {
	sgMail.setApiKey("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")

	const msg = {
		to: 'snehalj16680@gmail.com', // Change to your recipient
		from: 'joshiharsh0506@gmail.com', // Change to your verified sender
		subject: 'Sending with SendGrid is Fun',
		text: 'and easy to do anywhere, even with Node.js',
		html: '<strong>and easy to do anywhere, even with Node.js</strong>',
	}

	sgMail
		.send(msg)
		.then((response) => {
			console.log(response[0].statusCode)
			console.log(response[0].headers)
		})
		.catch((error) => {
			console.error(error)
		})
}

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