import asyncWrapper from "../../middlewares/asyncWrapper.js";
import { createTeacher, LoginTeacher, forgotTeacherPassword, resetTeacherPassword } from "../service/teacher_service.js";

export const signUp = asyncWrapper(async (req, res, next) => {
    const { firstName, lastName, email, password ,subject} = req.body;
    const teacher = {
        firstName,
        lastName,
        email,
        password,
        subject,
        profilePicture: process.env.DEFAULT_PFP_URL,
    };
        const result = await createTeacher(teacher);
        delete result._doc.hashedPassword;
        return res.status(201).json({
            data: {
                result,
            },
        });
});

export const signIn = asyncWrapper(async (req, res, next) => {
    const { accessToken, user } = await LoginTeacher(req.body, res, next);
    res.status(200).json({
        status: "success",
        data: {
            accessToken,
            user,
        },
    });
});

export const forgotTeacherPasswordHandler = asyncWrapper(async (req, res, next) => {
    const email = req.body.email;
        const message = await forgotTeacherPassword(email);
        res.status(200).json({
            data: {
                message,
            },
        });
});

export const resetTeacherPasswordHandler = asyncWrapper(async (req, res, next) => {
        const message = await resetTeacherPassword(req.body);
        res.status(200).json({
            data: {
                message,
            },
        });
});