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

    const student = {
        firstName,
        lastName,
        email,
        password,
        grade,
        teacherId,
        profilePicture: process.env.DEFAULT_PFP_URL,
    };

    try {
        const result = await createStudent(student);
        delete result._doc.hashedPassword;
        return res.status(201).json({
            data: {
                ...result._doc,
            },
        });
    } catch (error) {
        return res.status(error.statusCode).json({ error: error.message });
    }
});

export const login = asyncWrapper(async (req, res, next) => {
    try {
        const result = await loginStudent(req.body);
        delete result.student.hashedPassword;
        res.status(200).json({
            data: {
                ...result,
            },
        });
    } catch (error) {
        return res.status(error.statusCode).json({ error: error.message });
    }
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

export const updatePhoto = asyncWrapper(
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
    const { email, teacherId } = req.body;
    try {
        const message = await forgotStudentPassword(email, teacherId);
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