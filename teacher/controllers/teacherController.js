import Teacher from "./../models/TeacherModel.js";
import { LoginTeacher } from "../Services/teacherService.js";
import asyncWrapper from "./../../middlewares/asyncWrapper.js";

export const sginUp = asyncWrapper(async (req, res, next) => {
    await Teacher.create(req.body);
    res.status(200).json({ status: "success", message: "user craeted" });
});

export const sginIn = asyncWrapper(async (req, res, next) => {
    const { Token, user } = await LoginTeacher(req.body, res, next);
    res.status(200).json({
        status: "success",
        data: {
            Token,
            user,
        },
    });
});
