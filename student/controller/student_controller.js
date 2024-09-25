import {
    createStudent,
    loginStudent,
    updateStudent,
} from "../service/student_service.js";
import asyncWrapper from "../../middlewares/asyncWrapper.js";

export const signUp = asyncWrapper(async (req, res, next) => {
    const { firstName, lastName, email, password, grade, teacherId } = req.body;
    if (
        !firstName ||
        !lastName ||
        !email ||
        !password ||
        !grade ||
        !teacherId
    ) {
        return res
            .status(400)
            .json({ error: "Please provide all the required fields" });
    }
    const student = {
        firstName,
        lastName,
        email,
        password,
        grade,
        teacherId,
        teachers: [teacherId],
        profilePicture: process.env.DEFAULT_PFP_URL,
    };

    const result = await createStudent(student);
    delete result._doc.hashedPassword;
    return res.status(200).json({
        data: {
            result,
        },
    });
});

export const login = asyncWrapper(async (req, res, next) => {
    const student = await loginStudent(req.body, req.params.teacher);
    res.status(200).json({
        status: "Success",
        message: "Login successful",
        data: {
            ...student,
        },
    });
});
export const update = asyncWrapper(async (req, res, next) => {
    const id = req.params.id;
    const student = await updateStudent(req.body, id);
    res.status(200).json({
        data: {
            student,
        },
    });
});
export const checkJwt = asyncWrapper(async (req, res, next) => {
    res.status(200).json({ message: "Jwt Working... " });
});
