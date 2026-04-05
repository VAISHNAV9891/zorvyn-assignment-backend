import swaggerAutogen from 'swagger-autogen';

const doc = {
  info: {
    title: 'Zorvyn Finance Control System',
    description: 'Complete Backend Documentation for Finance Control System',
  },
 
  host: 'zorvyn-assignment-backend-scaa.onrender.com', 
  schemes: ['https'], 
};

const outputFile = './swagger-output.json';
const routes = ['./index.js'];

swaggerAutogen()(outputFile, routes, doc);