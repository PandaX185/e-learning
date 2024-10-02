import express from "express";
import { router as studentRouter } from "../routes/student_routes.js";
import { router as teacherRouter } from "../routes/teacher_routes.js";
import swaggerUiExpress from "swagger-ui-express";
import swaggerSpec from "../config/swagger.js";
import cors from "cors";
import errorHandler from "../middlewares/errorHandler.js";

export function createServer() {
    const server = express();
    server.use(express.json());
    server.use(cors());

    server.get("/", (req, res) => {
        res.json({ message: "API is running..." });
    });
    server.use(
        "/api/docs",
        swaggerUiExpress.serve,
        swaggerUiExpress.setup(swaggerSpec)
    );

    server.use("/api", studentRouter);
    server.use("/api", teacherRouter);
    server.use(errorHandler);
    return server;
}