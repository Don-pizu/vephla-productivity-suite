// swagger.js


const swaggerJSDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Vephla Productivity-suite API',
      version: '1.0.0',
      description: 'API documentation for user management, tasks, and productivity features',
    },
    servers: [
      {
        url: 'http://localhost:5000/api', 
        description: 'Local Development Server',
      },
      
      {
        url: 'https://task-manager-qzog.onrender.com/api', // for Render deployment
        description: 'Production server',
      },
      
    ],
    components: {
      securitySchemes: {
        cookieAuth: {
          type: 'apiKey',
          in: 'cookie',
          name: 'connect.sid',   // Redis-backed session cookie
          description: 'Session cookie used for authenticating users',
        },
      },
    },
    security: [
      {
        cookieAuth: [],
      },
    ],
  },
  apis: ['./routes/*.js'], // Swagger will look for JSDoc comments in your route files
};


const swaggerSpec = swaggerJSDoc(options);

module.exports = {
  swaggerUi,
  swaggerSpec,
};
