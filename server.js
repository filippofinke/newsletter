const express = require("express");
const emailValidator = require("email-validator");
const cors = require("cors");
const morgan = require("morgan");
const geoip = require("geoip-lite");
const fs = require("fs");
const path = require("path");
const basicAuth = require("express-basic-auth");
const compression = require("compression");

const app = express();
const db = require("better-sqlite3")("database.sqlite3");

db.exec(
	fs.readFileSync(path.join(__dirname, "schema.sql"), { encoding: "utf-8" })
);

process.env.PORT = process.env.PORT || 8080;
process.env.USERNAME = process.env.USERNAME || "admin";
process.env.PASSWORD = process.env.PASSWORD || "1234";

app.use(morgan("common"));
app.use(cors());
app.use(compression());
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.post("/form/:id", (req, res) => {
	let form = req.params.id;
	let email = req.body?.email;
	if (email && emailValidator.validate(email) && email.length <= 255) {
		try {
			let country = geoip.lookup(req.ip)?.country || null;

			db.prepare(
				"INSERT INTO emails (form, email, ip, country) VALUES(?, ?, ?, ?)"
			).run(form, email, req.ip, country);
			return res.sendStatus(201);
		} catch (err) {
			if (err.message.startsWith("UNIQUE")) {
				return res.sendStatus(200);
			} else {
				return res.sendStatus(404);
			}
		}
	}
	return res.sendStatus(400);
});

app.use(
	basicAuth({
		users: { [process.env.USERNAME]: process.env.PASSWORD },
		challenge: true,
	})
);

app.use(express.static(path.join(__dirname, "build")));

app.get("/forms", (req, res) => {
	const forms = db
		.prepare("SELECT * FROM forms ORDER BY created_at DESC")
		.all();
	return res.json(forms);
});

app.post("/form", (req, res) => {
	let name = req.body?.name;
	if (name && name.length > 0 && name.length <= 50) {
		let row = db.prepare("INSERT INTO forms(name) VALUES (?)").run(name);
		return res.status(201).json({
			id: row.lastInsertRowid,
			name,
		});
	}
	return res.sendStatus(400);
});

app.get("/form/:id", (req, res) => {
	let form = req.params.id;

	let emails = db
		.prepare(
			"SELECT email, country, created_at FROM emails WHERE form = ? ORDER BY created_at DESC"
		)
		.all(form);

	return res.json(emails);
});

app.delete("/form", (req, res) => {
	let form = req.body.id;
	if (form) {
		db.prepare("DELETE FROM forms WHERE id = ?").run(form);
		return res.sendStatus(200);
	}
	return res.sendStatus(400);
});

app.delete("/form/:id", (req, res) => {
	let form = req.params.id;
	let email = req.body.email;
	if (email) {
		db.prepare("DELETE FROM emails WHERE form = ? AND email = ?").run(
			form,
			email
		);
		return res.sendStatus(200);
	}
	return res.sendStatus(400);
});

app.listen(process.env.PORT, "0.0.0.0", () => {
	console.log(`app listening at http://localhost:${process.env.PORT}`);
});
