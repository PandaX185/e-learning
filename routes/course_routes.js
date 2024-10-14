import { Router } from "express";
import {
    AddCourse,
    DeleteCourse,
    GetAllCourse,
    GetCourseById,
    UpdateCourse,
} from "./../course/controller/course_controller.js";
import { router as lessonRouter } from "../routes/lesson_routes.js";
const router = Router();

router.use("/course/:course_id", lessonRouter);

router.post("/add-course", AddCourse);
router.get("/get-courses", GetAllCourse);
router.get("/get-course/:id", GetCourseById);
router.patch("/update-course/:id", UpdateCourse);
router.delete("/delete-course/:id", DeleteCourse);

export { router };
