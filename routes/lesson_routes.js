import { Router } from "express";
import {
    DeleteLesson,
    UpdateLesson,
    GetLessonById,
    GetAllLesson,
    AddLesson,
} from "../lesson/controller/lesson_controller.js";

import { router as sectionRouter } from "./section_routes.js";
const router = Router({ mergeParams: true });

router.use("/lesson/:lesson_id", sectionRouter);

router.post("/add-lesson", AddLesson);
router.get("/get-lessons", GetAllLesson);
router.get("/get-lesson/:id", GetLessonById);
router.patch("/update-lesson/:id", UpdateLesson);
router.delete("/delete-lesson/:id", DeleteLesson);

export { router };
