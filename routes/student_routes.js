import express from "express";
import { signUp , login , checkJwt} from "../student/controller/student_controller.js";
import multer from 'multer';
import verifyToken from "../middlewares/verifyToken.js";

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname);
    }
});

const upload = multer({ storage: storage });
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
 *            password:
 *              type: string
 *            grade:
 *             type: number
 *             format: int32
 *            profilePicture:
 *             type: string
 *             format: binary
 *            teacherId:
 *             type: string
 *          required: 
 *           - firstName
 *           - lastName
 *           - email
 *           - password
 *           - grade
 *           - teacherId
 *  responses:
 *      200:
 *          description: Sign-up successful
 *      400:
 *          description: Please provide all the required fields
 *      500:
 *          description: Internal server error
 */
router.post("/students/signup", upload.single('profilePicture'), signUp);

/**
 * @swagger
 * /students/login/:teacher:
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
 *            password:
 *              type: string
 *          required: 
 *           - email
 *           - password
 *  responses:
 *      200:
 *          description: Login successful
 *      400:
 *          description: Please provide all the required fields
 *      500:
 *          description: Internal server error
 */
router.post("/students/login/:teacher", login)

// for test jwt token
router.get('/Testjwt' , verifyToken ,checkJwt)
export default router;