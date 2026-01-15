//models/note.js

const mongoose = require('mongoose');

//Note Schema
const noteSchema = new mongoose.Schema({
	user: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User',
		required: true
	},
	title:{
		type: String,
		required: true
	},
	content: { type: String },
	tags: [String],
	attachments: [
	  {
	    url: {
	      type: String,
	      required: true
	    },
	    publicId: {
	      type: String,
	      required: true
	    },
	    type: {
	      type: String,
	      required: true
	    }
	  }
	]

}, { timestamps: true });

module.exports =
  mongoose.models.Note ||
  mongoose.model('Note', noteSchema);