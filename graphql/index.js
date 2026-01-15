//graphql/index.js

const { graphqlHTTP } = require("express-graphql");
const schema = require("./schema");
const jwt = require("jsonwebtoken");

// GRAPHQL MIDDLEWARE
//Runs for every /graphql request

module.exports = graphqlHTTP((req) => {

  let user = null;   // Will hold decoded JWT user

  // Read Authorization header
  const authHeader = req.headers.authorization;

  // Check if Bearer token exists
  if (authHeader && authHeader.startsWith("Bearer ")) {
    try {
      // Decode JWT using your existing secret
      user = jwt.verify(
        authHeader.split(" ")[1],
        process.env.JWT_SECRET
      );
    } catch (err) {
      // Invalid token → user stays null
      user = null;
    }
  }

  return {
    schema,                            // GraphQL schema
    graphiql: true,                    // Enable GraphiQL UI
    context: { user }                  // Pass user to resolvers
  };
});
