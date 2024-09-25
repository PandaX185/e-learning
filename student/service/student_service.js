import Student from "../model/student.js";
import bcrypt from 'bcrypt';
import appError from "../../utils/appError.js";
import generateToken from "../../utils/generateToken.js";

export async function createStudent(student) {
    const hashedPassword = await bcrypt.hash(student.password, 0);
    student.hashedPassword = hashedPassword;
    const existingStudent = await Student.findOne({ email: student.email });    
    if (existingStudent) {
        if (!existingStudent.teachers.includes(student.teacherId)) {
            existingStudent.teachers.push(student.teacherId);
            existingStudent.updatedAt = Date.now();
            await existingStudent.save();
            return existingStudent;
        } else {
            throw new appError('Student already exists' , 400);
        }
    }
    const newStudent =  await Student.create(student);
    return newStudent;
}

export async function loginStudent (body  , teacherId){
    const student = await Student.findOne({
        email:body.email,
        teachers:teacherId
    })
    if(!student || !body.password || !body.email){
        throw new appError('Invalid Email Or Password' , 400);
    }
    const isMatch = await bcrypt.compare(body.password, student.hashedPassword);
    if(!isMatch){
        throw new appError('Invalid Email Or Password');
    }
    let accessToken = await generateToken({
        id: student._id,
        email: student.email,
        role: 'Student'
    })
    return {
        student,
        accessToken
    };
}
export async function updateStudent(body , id) {
    const updatedStudent = await Student.findByIdAndUpdate(id, {$set:{...body} } , {new: true , runValidators:true});
    if(!updatedStudent){
        throw new appError('Student not found', 404);
    }
    return updatedStudent;
}
export async function updateStudentPhoto(file , id){
    const updatedStudent = await Student.findByIdAndUpdate(id, {  profilePicture: file.path }, { new: true , runValidators:true});
    if(!updatedStudent){
        throw new appError('Student not found', 404);
    }
    return updatedStudent;
}