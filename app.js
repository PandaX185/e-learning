import express from 'express';
import db from './config/db.js';
import router from './routes/student_routes.js';
import dotenv from 'dotenv';
import swaggerUiExpress from 'swagger-ui-express';
import swaggerSpec from './config/swagger.js';
import cors from 'cors';
import errorHandler from './middlewares/errorHandler.js';
dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
    res.json({ message: "API is running..." });
});
app.use('/api/docs', swaggerUiExpress.serve, swaggerUiExpress.setup(swaggerSpec));

app.use('/api', router);
app.use(errorHandler)
app.all("*", (req, res, next) => {
    res.json({
        status: "ERROR",
        message: "this resource is not available.",
    });
});
const port = process.env.API_PORT;
app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
});