import swaggerJsdoc from 'swagger-jsdoc';

const swaggerDefinition = {
    openapi: '3.0.0',
    info: {
        title: 'E Learning API',
        version: '1.0.0',
        description: 'This is the official API for the E-Learning application',
    },
    servers: [
        {
            url: 'https://elms-dev-0fa19fc2d912.herokuapp.com',
            description: 'Development server',
        },
    ],
};

const options = {
    swaggerDefinition,
    apis: ['./routes/*.js'],
};

const swaggerSpec = swaggerJsdoc(options);

export default swaggerSpec;
