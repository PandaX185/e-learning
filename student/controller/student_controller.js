import { createStudent } from '../service/student_service.js';
import { createStudent , loginStudent } from '../service/student_service.js';
import asyncWrapper from '../../middlewares/asyncWrapper.js'
export async function signUp(req, res) {
    const { firstName, lastName, email, password, grade, teacherId } = req.body;

    if (!firstName || !lastName || !email || !password || !grade || !teacherId) {
        return res.status(400).json({ error: 'Please provide all the required fields' });
    }

    const student = {
        firstName,
        lastName,
        email,
        password,
        grade,
        teachers: [teacherId]
    };


    if (req.file) {
        student.profilePicture = req.file.path;
    }

    try {
        await createStudent(student);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Internal server error' });
    }

    return res.status(200).json({ message: 'Sign-up successful' });
}

export const login = asyncWrapper(
    async(req ,res , next)=>{
        const student = await loginStudent(req.body , req.params.teacher);
        res.status(200).json({
            status: 'Success',
            message:'Login successful',
            data:{
                student
            }
        })
    }
)

