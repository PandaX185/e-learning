import {
    add_Course,
    findAllCourse,
    FindCourseById,
    update_Course,
    delete_course,
} from "./../service/course_service.js";
import asyncWrapper from "../../middlewares/asyncWrapper.js";

export const AddCourse = asyncWrapper(async (req, res, next) => {
    try {
        const course = await add_Course(req.body);
        return res.status(201).json({
            data: course,
        });
    } catch (error) {
        return res.status(error.statusCode).json({ error: error.message });
    }
});

export const GetAllCourse = asyncWrapper(async (req, res, next) => {
    try {
        const courses = await findAllCourse();
        return res.status(200).json({
            data: courses,
        });
    } catch (error) {
        return res.status(error.statusCode).json({ error: error.message });
    }
});

export const GetCourseById = asyncWrapper(async (req, res, next) => {
    try {
        const course = await FindCourseById(req.params.id);
        return res.status(200).json({
            data: course,
        });
    } catch (error) {
        return res.status(error.statusCode).json({ error: error.message });
    }
});

export const UpdateCourse = asyncWrapper(async (req, res, next) => {
    try {
        const course = await update_Course(req.params.id, req.body);
        return res.status(200).json({
            data: course,
        });
    } catch (error) {
        return res.status(error.statusCode).json({ error: error.message });
    }
});

export const DeleteCourse = asyncWrapper(async (req, res, next) => {
    try {
        const Msg = await delete_course(req.params.id);
        return res.status(200).json({
            data: Msg,
        });
    } catch (error) {
        return res.status(error.statusCode).json({ error: error.message });
    }
});
