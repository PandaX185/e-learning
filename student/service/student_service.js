import Student from "../model/student.js";
import bcrypt from 'bcrypt';

export async function createStudent(student) {
    const hashedPassword = await bcrypt.hash(student.password, 0);
    student.hashedPassword = hashedPassword;
    console.log(student);

    return Student.create(student);
}
