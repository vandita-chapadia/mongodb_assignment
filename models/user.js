const mongoose = require("mongoose");
const Todo = require("./todo");
const paginate = require("mongoose-paginate");

const User = new mongoose.Schema({
	firstName: {
		type: String,
		trim: true,
		default: "",
	},
	lastName: {
		type: String,
		trim: true,
		default: "",
	},
	
	createdAt: Date,
	updatedAt: Date,
});

User.plugin(paginate);

User.virtual("todo", {
	ref: "Todo",
	localField: "_id",
	foreignField: "owner",
});

User.pre("save", function (next) {
	let now = Date.now();
	console.log("pre save");
	this.updatedAt = now;
	if (!this.createdAt) {
		this.createdAt = now;
	}
	next();
});

User.pre("remove", async function (next) {
	const user = this;
	console.log("pre remove");
	await Todo.deleteMany({ owner: user._id });
	next();
});

module.exports = mongoose.model("User", User);
