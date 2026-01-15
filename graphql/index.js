//graphql/index.js

const { createHandler } = require("graphql-http/lib/use/express");
const schema = require("./schema");
const jwt = require("jsonwebtoken");

// Creates and returns GraphQL middleware
module.exports = createHandler({
  schema,
  context: (req) => {
    let user = null;

    const authHeader = req.headers.authorization;

    if (authHeader && authHeader.startsWith("Bearer ")) {
      try {
        user = jwt.verify(
          authHeader.split(" ")[1],
          process.env.JWT_SECRET
        );
      } catch (err) {
        user = null;
      }
    }

    return { user };
  },
});