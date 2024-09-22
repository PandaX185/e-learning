import Student from "../model/student.js";
import bcrypt from 'bcrypt';

export async function createStudent(student) {
    const hashedPassword = await bcrypt.hash(student.password, 0);
    student.hashedPassword = hashedPassword;

    const existingStudent = await Student.findOne({ email: student.email });
    if (existingStudent) {
        if (!existingStudent.teachers.includes(student.teacherId)) {
            existingStudent.teachers.push(student.teacherId);
            await existingStudent.save();
            return existingStudent;
        } else {
            throw new Error('Student already exists');
        }
    }       

    return Student.create(student);
}
