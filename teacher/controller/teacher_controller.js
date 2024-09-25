import asyncWrapper from "../../middlewares/asyncWrapper.js";
import { createTeacher } from "../service/teacher_service.js";

export const signUp = asyncWrapper(async (req, res, next) => {
    const { firstName, lastName, email, password } = req.body;
    const teacher = {
        firstName,
        lastName,
        email,
        password,
        profilePicture: process.env.DEFAULT_PFP_URL,
    };

    const result = await createTeacher(teacher);
    delete result._doc.hashedPassword;
    return res.status(200).json({
        data: {
            result,
        },
    });
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
