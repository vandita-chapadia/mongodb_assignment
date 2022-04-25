const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const User = require("../models/user");
const Todo = require("../models/todo");


router.get("/user", async (req, res) => {

	try {
		const query = req.query;
		const { page, perPage } = query;
		delete query["page"];
		delete query["perPage"];
		console.log(query);
		const options = {
			page: parseInt(page, 10) || 1,
			limit: parseInt(perPage, 10) || 5,
		};
		console.log(options);
		const user = await user.paginate(query, options);
		res.status(200).json(user);
	} catch (err) {
		res.status(500).send(err.message);
		console.log(err);
	}
});

router.get("/user/update", (req, res) => {
	const query = req.query;
	const userId = query.id;
	delete query["id"];
	User.findByIdAndUpdate(userId, query, { new: true })
		.then((user) => {
			res.json({
				msg: "success",
				data: user,
			});
		})
		.catch((err) => {
			res.json({
				msg: "fail",
				message: err.message,
			});
		});
});

router.get("/user/remove", (req, res) => {
	const query = req.query;
	User.findByIdAndRemove({ _id: query.id })
		.then(() => {
			res.json({
				msg: "success",
				data: "User " + query.id + " was deleted",
			});
		})
		.catch((err) => {
			res.json({
				msg: "fail",
				message: err.message,
			});
		});
});

router.get("/user/:id", (req, res) => {
	const id = req.params.id;

	User.findById(id)
		.then((user) => {
			res.json({
				msg: "success",
				data: user,
			});
		})
		.catch((err) => {
			res.json({
				msg: "failed",
				message: err.message,
			});
		});
});

router.post("/user", (req, res) => {
	User.create(req.body)
		.then((user) => {
			res.json({
				msg: "success",
				data: user,
			});
		})
		.catch((err) => {
			res.json({
				msg: "fail",
				message: err.message,
			});
		});
});

router.post("/user/todo/:id", async (req, res) => {
	const id = req.params.id;
	const todo = new Todo({
		...req.body,
		owner: id,
	});
	try {
		await todo.save();
		res.status(201).send(todo);
	} catch (e) {
		res.status(400).send(e);
	}
});

router.get("/user/todo/:id", async (req, res) => {
	const query = req.query.discription;
	const id = req.params.id;
	if (query == undefined) {
		Todo.find({ owner: id })
			.sort({ createdAt: 1 })
			.sort({})
			.then((todo) => {
				res.json({
					msg: "success",
					data: todo,
				});
			})
			.catch((err) => {
				res.json({
					msg: "fail",
					message: "Todo not found",
				});
			});
	} else {
		const rgx = new RegExp(escapeRegex(query), "gi");
		Todo.find({ discription: rgx, owner: id })
			.sort({ createdAt: 1 })
			.then((todo) => {
				res.json({
					msg: "success",
					data: todo,
				});
			})
			.catch((err) => {
				res.json({
					msg: "fail",
					message: "Todo not found",
				});
			});
	}
});

router.get("/user/todo/incomplete/:id", (req, res) => {
	const id = req.params.id;
	Todo.aggregate([
		{ $match: { owner: new mongoose.Types.ObjectId(id), completed: false } },
		{ $group: { _id: "$completed", incomplete_todo: { $sum: 1 } } },
		{ $project: { _id: 0, incomplete_todo: 1 } },
	])
		.then((todo) => {
			res.json({
				msg: "success",
				data: todo,
			});
		})
		.catch((err) => {
			res.json({
				msg: "fail",
				message: "Todo not found",
			});
		});
});

router.get("/user/todo/:id", (req, res) => {
	const id = req.params.id;
	User.aggregate([
		{
			$lookup: {
				from: "user",
				localField: "_id",
				foreignField: "owner",
				as: "myTodo",
			},
		},
	])
		.then((todo) => {
			res.json({
				msg: "success",
				data: todo,
			});
		})
		.catch((err) => {
			res.json({
			msg: "fail",
				message: "Todo not found",
			});
		});
});

const escapeRegex = (text) => {
	return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
};

module.exports = router;
