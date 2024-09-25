import Teacher from '../model/teacher.js';

export async function createTeacher(teacher) {
    const existingTeacher = await Teacher.findOne({ email: teacher.email });
    if (existingTeacher) {
        throw new appError('Teacher already exists', 400);
    }

    teacher.hashedPassword = teacher.password
    const newTeacher = await Teacher.create(teacher);
    return newTeacher;
}