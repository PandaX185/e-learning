import { createStudent , loginStudent } from '../service/student_service.js';
import asyncWrapper from '../../middlewares/asyncWrapper.js'
export const signUp =  asyncWrapper( 
    async (req, res , next)=> {
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
        teacherId,
        teachers: [teacherId]
    };
    if (req.file) {
        student.profilePicture = req.file.path;
    }
        await createStudent(student);
        return res.status(200).json({status:'success', message: 'Sign-up successful' , data:{
        student
    } });
})

export const login = asyncWrapper(
    async(req ,res , next)=>{
        const student = await loginStudent(req.body , req.params.teacher);
        res.status(200).json({
            status: 'Success',
            message:'Login successful',
            data:{
                ...student
            }
        })
    }
)

export const checkJwt = asyncWrapper(
    async(req , res , next)=>{
        res.status(200).json({message:'Jwt Working... '})
    }
)
