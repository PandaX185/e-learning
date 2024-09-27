import {
    createStudent,
    forgotStudentPassword,
    loginStudent,
    resetStudentPassword,
    updateStudent,
    updateStudentPhoto
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

export const updatePhote = asyncWrapper(
    async (req, res, next) => {
        const id = req.params.id;
        const student = await updateStudentPhoto(req.file, id);
        res.status(200).json({
            data: {
                student,
            },
        });
    }
)

export const checkJwt = asyncWrapper(async (req, res, next) => {
    res.status(200).json({ message: "Jwt Working... " });
});

export const forgotStudentPasswordHandler = asyncWrapper(async (req, res, next) => {
    const email = req.body.email;
    try {
        const message = await forgotStudentPassword(email);
        res.status(200).json({
            data: {
                message,
            },
        });
    } catch (error) {
        return res.status(error.statusCode).json({ error: error.message });
    }
});

export const resetStudentPasswordHandler = asyncWrapper(async (req, res, next) => {
    try {
        const message = await resetStudentPassword(req.body);
        res.status(200).json({
            data: {
                message,
            },
        });
    } catch (error) {
        return res.status(error.statusCode).json({ error: error.message });
    }
});