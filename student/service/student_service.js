import Student from "../model/student.js";
import bcrypt from 'bcrypt';

export async function createStudent(student) {
    const hashedPassword = await bcrypt.hash(student.password, 0);
    student.hashedPassword = hashedPassword;

    const existingStudent = await Student.findOne({ email: student.email, teacherId: student.teacherId });
    if (existingStudent) {
        throw new Error('Email already signed up');
    }

    return Student.create(student);
}
