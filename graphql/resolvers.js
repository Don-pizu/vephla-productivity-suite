//graphql/resolvers.js

// Import models
const Note = require("../models/note");
const Task = require("../models/task");

// GRAPHQL RESOLVERS
//Each resolver is similar to a controller method, but returns data instead of res.json()

module.exports = {
  
   //Resolver: myNotes
   //Fetch notes for the logged-in user
  myNotes: async (_, __, context) => {

    // If user is not authenticated, block access
    if (!context.user) {
      throw new Error("Unauthorized");
    }

    // Fetch notes belonging to the logged-in user
    return Note.find({ user: context.user.id })
      .populate("user", "name email role")   // populate user info
      .sort({ createdAt: -1 });              // newest first
  },

   //Resolver: myTasks
   //Fetch tasks created by or assigned to the user
  myTasks: async (_, __, context) => {

    // Ensure user is authenticated
    if (!context.user) {
      throw new Error("Unauthorized");
    }

    // Fetch tasks where user is creator OR assignee
    return Task.find({
      $or: [
        { assignedTo: context.user.id },
        { createdBy: context.user.id }
      ]
    })
      .populate("assignedTo", "name email")
      .populate("createdBy", "name email")
      .sort({ createdAt: -1 });
  }
};
