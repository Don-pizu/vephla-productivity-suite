// graphql/schema.js


// Import GraphQL core types
const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLList,
  GraphQLSchema,
  GraphQLID,
  GraphQLBoolean
} = require("graphql");

// Import custom Date scalar (because MongoDB uses Date)
const { DateTimeResolver } = require("graphql-scalars");

// Import resolvers (logic lives here)
const resolvers = require("./resolvers");


//USER TYPE (defines how a User looks in GraphQL)
//expose ONLY safe fields (no password).
const UserType = new GraphQLObjectType({
  name: "User",
  fields: () => ({
    id: { type: GraphQLID },                 // MongoDB _id
    name: { type: GraphQLString },           // User name
    email: { type: GraphQLString },          // User email
    role: { type: GraphQLString }             // standard / admin
  })
});


// NOTE TYPE
const NoteType = new GraphQLObjectType({
  name: "Note",
  fields: () => ({
    id: { type: GraphQLID },                 // Note ID
    title: { type: GraphQLString },          // Note title
    content: { type: GraphQLString },        // Note body
    tags: { type: new GraphQLList(GraphQLString) }, // Array of tags
    createdAt: { type: DateTimeResolver },  // Timestamp
    user: { type: UserType }                 // Owner (populated)
  })
});


//TASK TYPE
const TaskType = new GraphQLObjectType({
  name: "Task",
  fields: () => ({
    id: { type: GraphQLID },                 // Task ID
    title: { type: GraphQLString },          // Task title
    description: { type: GraphQLString },   // Task description
    status: { type: GraphQLString },         // pending / in-progress / completed
    dueDate: { type: DateTimeResolver },     // Due date
    createdAt: { type: DateTimeResolver },  // Timestamp
    assignedTo: { type: UserType },          // Assigned user
    createdBy: { type: UserType }             // Task creator
  })
});

// ROOT QUERY (entry points for GraphQL queries)
const RootQuery = new GraphQLObjectType({
  name: "Query",
  fields: {
    
    //Get notes belonging to logged-in user
    myNotes: {
      type: new GraphQLList(NoteType),
      resolve: resolvers.myNotes
    },

    
    //Get tasks assigned to or created by logged-in user
    myTasks: {
      type: new GraphQLList(TaskType),
      resolve: resolvers.myTasks
    }
  }
});

//EXPORT GRAPHQL SCHEMA
module.exports = new GraphQLSchema({
  query: RootQuery
});
