import express from 'express';

import db from './config/db.js';
import router from './routes/student_routes.js';
import dotenv from 'dotenv';
import swaggerUiExpress from 'swagger-ui-express';
import swaggerSpec from './config/swagger.js';
import cors from 'cors';
dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

app.use('/api/docs', swaggerUiExpress.serve, swaggerUiExpress.setup(swaggerSpec));

app.use('/api', router);

const port = process.env.API_PORT;
app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
});