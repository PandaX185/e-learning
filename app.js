import express from "express";

import db from "./config/db.js";
import { router as studentRouter } from "./routes/student_routes.js";
import { router as teacherRouter } from "./routes/teacher_routes.js";
import dotenv from "dotenv";
import swaggerUiExpress from "swagger-ui-express";
import swaggerSpec from "./config/swagger.js";
import cors from "cors";
import errorHandler from "./middlewares/errorHandler.js";
dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
    res.json({ message: "API is running..." });
});
app.use(
    "/api/docs",
    swaggerUiExpress.serve,
    swaggerUiExpress.setup(swaggerSpec)
);

app.use("/api", studentRouter);
app.use("/api", teacherRouter);

app.use(errorHandler);

const port = process.env.API_PORT;
const server = app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
});

export default server;
