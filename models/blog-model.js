const mongoose = require("mongoose")
const blog = new mongoose.Schema({
	title: {
		type: String
	},
	content: {
		type: String
	},
	creator: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User'
	}
});

module.exports = mongoose.model('Blog', blog)