import asyncWrapper from "../../middlewares/asyncWrapper.js";
import { createTeacher, LoginTeacher, forgotTeacherPassword, resetTeacherPassword } from "../service/teacher_service.js";

export const signUp = asyncWrapper(async (req, res, next) => {
    const { firstName, lastName, email, password } = req.body;
    const teacher = {
        firstName,
        lastName,
        email,
        password,
        profilePicture: process.env.DEFAULT_PFP_URL,
    };

    try {
        const result = await createTeacher(teacher);
        delete result._doc.hashedPassword;
        return res.status(201).json({
            data: {
                result,
            },
        });
    } catch (error) {
        return res.status(error.statusCode).json({ error: error.message });
    }
});

export const signIn = asyncWrapper(async (req, res, next) => {
    const { Token, user } = await LoginTeacher(req.body, res, next);
    res.status(200).json({
        status: "success",
        data: {
            Token,
            user,
        },
    });
});

export const forgotTeacherPasswordHandler = asyncWrapper(async (req, res, next) => {
    const email = req.body.email;
    try {
        const message = await forgotTeacherPassword(email);
        res.status(200).json({
            data: {
                message,
            },
        });
    } catch (error) {
        return res.status(error.statusCode).json({ error: error.message });
    }
});

export const resetTeacherPasswordHandler = asyncWrapper(async (req, res, next) => {
    try {
        const message = await resetTeacherPassword(req.body);
        res.status(200).json({
            data: {
                message,
            },
        });
    } catch (error) {
        return res.status(error.statusCode).json({ error: error.message });
    }
});