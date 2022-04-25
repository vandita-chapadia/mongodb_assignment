const mongoose = require("mongoose");

const Todo = new mongoose.Schema({
	discription: { type: String, default: "" },
	completed: { type: Boolean, default: false },
	owner: {
		type: mongoose.Schema.Types.ObjectId,
		required: true,
		ref: "User",
	},
	createdAt: Date,
	updatedAt: Date,
});
Todo.pre("save", function (next) {
	let now = Date.now();
	this.updatedAt = now;
	if (!this.createdAt) {
		this.createdAt = now;
	}
	next();
});
module.exports = mongoose.model("Todo", Todo);
