const mongoose = require('mongoose');


const todoSchema = new mongoose.Schema({
	title: {
		type: String,
		required: true,
	},
	dueDate: {
		type: Date, 
		required: true,
		default: Date.now()
	},
	marked: {
		type: Boolean,
		default: false
	}
})

const listSchema = new mongoose.Schema({
	name: {
		type: String,
		required: true,
	},
	todos: [todoSchema]
})


const List = new mongoose.model('List', listSchema);

module.exports = List;