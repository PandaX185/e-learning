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
        const result = await createStudent(student);
        delete result._doc.hashedPassword;
        return res.status(201).json({
            data: {
                ...result._doc,
            },
        });
});

export const login = asyncWrapper(async (req, res, next) => {
        const result = await loginStudent(req.body);
        delete result.student.hashedPassword;
        res.status(200).json({
            data: {
                ...result,
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
        const message = await forgotStudentPassword(email, teacherId);
        res.status(200).json({
            data: {
                message,
            },
        });
});

export const resetStudentPasswordHandler = asyncWrapper(async (req, res, next) => {
        const message = await resetStudentPassword(req.body);
        res.status(200).json({
            data: {
                message,
            },
        });
});