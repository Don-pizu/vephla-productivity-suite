const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true
    },

    description: {
      type: String
    },

    status: {
      type: String,
      enum: ['pending', 'in-progress', 'completed'],
      default: 'pending'
    },

    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },

    dueDate: {
      type: Date
    },

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
  },
  { timestamps: true }
);

module.exports = mongoose.model('Task', taskSchema);
