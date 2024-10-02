import express from "express";
import {
    signUp,
    login,
    update,
    updatePhoto,
    forgotStudentPasswordHandler,
    resetStudentPasswordHandler
} from "../student/controller/student_controller.js";
import verifyToken from "../middlewares/verifyToken.js";
import {
    signupSchema,
    signinSchema,
    updateStudentSchema,
    forgotPasswordSchema,
    resetPasswordSchema,
} from "../validation/student.schema.js";
import validate from "../middlewares/validation.js";
import { v4 } from "uuid";
import multer from "multer";
import appError from "../utils/appError.js";

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, `${v4()}-${Date.now()}${file.originalname}`);
    },
});
const fileFilter = (req, file, cb) => {
    const imageType = file.mimetype.split("/")[0];
    const size = file.size;
    if (imageType === "image" && size <= 50000) {
        return cb(null, true);
    } else return cb(new appError("unSupported File Type or exceed max size 5mb", 400), false);
};
const upload = multer({ storage: storage, fileFilter: fileFilter });
const router = express.Router();

/**
 * @swagger
 * /students/signup:
 *  post:
 *   summary: Sign up a student
 *   description: Sign up a student
 *   requestBody:
 *    content:
 *      application/json:
 *        schema:
 *          type: object
 *          properties:
 *            firstName:
 *              type: string
 *            lastName:
 *              type: string
 *            email:
 *              type: string
 *              format: email
 *            password:
 *              type: string
 *            grade:
 *              type: number
 *              format: int32
 *            teacherId:
 *              type: string
 *          required:
 *           - firstName
 *           - lastName
 *           - email
 *           - password
 *           - grade
 *           - teacherId
 *   responses:
 *      200:
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                data:
 *                  type: object
 *                  properties:
 *                    _id:
 *                      type: string
 *                    firstName:
 *                      type: string
 *                    lastName:
 *                      type: string
 *                    email:
 *                      type: string
 *                      format: email
 *                    grade:
 *                      type: number
 *                      format: int32
 *                    teacherId:
 *                      type: string
 *                    profilePicture:
 *                      type: string
 *                      format: binary
 *                    createdAt:
 *                      type: string
 *                      format: date-time
 *                    updatedAt:
 *                      type: string
 *                      format: date-time
 *      400:
 *          description: Please provide all the required fields
 *      500:
 *          description: Internal server error
 */
router.post("/students/signup", validate(signupSchema), signUp);

/**
 * @swagger
 * /students/login:
 *  post:
 *   summary: Login a Student
 *   description: Login a student
 *   requestBody:
 *    content:
 *      application/json:
 *        schema:
 *          type: object
 *          properties:
 *            email:
 *              type: string
 *            teacherId:
 *              type: string
 *            password:
 *              type: string
 *          required:
 *           - email
 *           - teacherId
 *           - password
 *   responses:
 *      200:
 *          description: Login successful
 *      400:
 *          description: Please provide all the required fields
 *      500:
 *          description: Internal server error
 */
router.post("/students/login", validate(signinSchema), login);

/**
 * @swagger
 * /students/update-student/{studentId}:
 *  put:
 *   summary: Update a Student
 *   description: Update a student
 *   parameters:
 *     - in: path
 *       name: studentId
 *       required: true
 *       schema:
 *         type: string
 *       description: student ID
 *   requestBody:
 *    content:
 *      application/json:
 *        schema:
 *          type: object
 *          properties:
 *            firstName:
 *              type: string
 *            lastName:
 *              type: string
 *            grade:
 *              type: number
 *  responses:
 *      200:
 *          description: Login successful
 *      400:
 *          description: Please provide all the required fields
 *      500:
 *          description: Internal server error
 */
router.put(
    "/students/update-student/:id",
    verifyToken,
    validate(updateStudentSchema),
    update
);
router.put(
    "/students/update-photo/:id",
    /* verifyToken, */
    upload.single('profilePicture'),
    updatePhoto
)


/**
 * @swagger
 * /students/forgot-password:
 *  post:
 *   summary: forgot password
 *   description: forgot password for the student
 *   requestBody:
 *    content:
 *      application/json:
 *        schema:
 *          type: object
 *          properties:
 *            email:
 *              type: string
 *            teacherId:
 *              type: string
 *   responses:
 *      200:
 *         content:
 *             application/json:
 *                schema:
 *                   type: object
 *                   properties:
 *                     message:
 *                      type: string
 *      500:
 *          description: Internal server error
 */
router.post("/students/forgot-password", validate(forgotPasswordSchema), forgotStudentPasswordHandler)


/**
 * @swagger
 * /teachers/reset-password:
 *  post:
 *   summary: reset password
 *   description: reset password for the student
 *   requestBody:
 *    content:
 *      application/json:
 *        schema:
 *          type: object
 *          properties:
 *            email:
 *              type: string
 *            otp:
 *              type: string
 *            password:
 *              type: string
 *   responses:
 *      200:
 *         content:
 *             application/json:
 *                schema:
 *                   type: object
 *                   properties:
 *                     message:
 *                      type: string
 *      500:
 *          description: Internal server error
 */
router.post("/students/reset-password", validate(resetPasswordSchema), resetStudentPasswordHandler)

export { router };
