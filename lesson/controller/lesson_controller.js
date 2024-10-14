import asyncWrapper from "../../middlewares/asyncWrapper.js";
import {
    add_lesson,
    delete_lesson,
    findAllLesson,
    findLessonById,
    update_lesson,
} from "../service/lesson_service.js";

export const AddLesson = asyncWrapper(async (req, res, next) => {
    try {
        const lesson = {
            title: req.body.title,
            discription: req.body.discription,
            material: req.body.material,
        };
        const course_id = req.params.course_id;
        console.log(course_id);
        const new_lesson = await add_lesson(lesson, course_id);
        return res.status(201).json({
            data: new_lesson,
        });
    } catch (error) {
        return res.status(error.statusCode).json({ error: error.message });
    }
});

export const GetAllLesson = asyncWrapper(async (req, res, next) => {
    try {
        const lessons = await findAllLesson();
        return res.status(200).json({
            data: lessons,
        });
    } catch (error) {
        return res.status(error.statusCode).json({ error: error.message });
    }
});

export const GetLessonById = asyncWrapper(async (req, res, next) => {
    try {
        const course_id = req.params.course_id;
        const course = await findLessonById(req.params.id, course_id);
        return res.status(200).json({
            data: course,
        });
    } catch (error) {
        return res.status(error.statusCode).json({ error: error.message });
    }
});

export const UpdateLesson = asyncWrapper(async (req, res, next) => {
    try {
        const updatedlesson = await update_lesson(req.params.id, req.body);
        return res.status(200).json({
            data: updatedlesson,
        });
    } catch (error) {
        return res.status(error.statusCode).json({ error: error.message });
    }
});

export const DeleteLesson = asyncWrapper(async (req, res, next) => {
    try {
        const Msg = await delete_lesson(req.params.id);
        return res.status(200).json({
            data: Msg,
        });
    } catch (error) {
        return res.status(error.statusCode).json({ error: error.message });
    }
});
