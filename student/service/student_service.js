import Student from "../model/student.js";
import bcrypt from 'bcrypt';
import appError from "../../utils/appError.js";
import generateToken from "../../utils/generateToken.js";
import sgMail from "@sendgrid/mail";
import crypto from 'crypto';
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

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
            throw new appError('Student already exists', 400);
        }
    }
    const newStudent = await Student.create(student);
    return newStudent;
}

export async function loginStudent(body, teacherId) {
    const student = await Student.findOne({
        email: body.email,
        teachers: teacherId
    })
    if (!student || !body.password || !body.email) {
        throw new appError('Invalid Email Or Password', 400);
    }
    const isMatch = await bcrypt.compare(body.password, student.hashedPassword);
    if (!isMatch) {
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

export async function updateStudent(body, id) {
    const updatedStudent = await Student.findByIdAndUpdate(id, { $set: { ...body } }, { new: true, runValidators: true });
    if (!updatedStudent) {
        throw new appError('Student not found', 404);
    }
    return updatedStudent;
}

export async function updateStudentPhoto(file, id) {
    const updatedStudent = await Student.findByIdAndUpdate(id, { profilePicture: file.path }, { new: true, runValidators: true });
    if (!updatedStudent) {
        throw new appError('Student not found', 404);
    }
    return updatedStudent;
}

export async function forgotStudentPassword(email) {
    const existingStudent = await Student.findOne({ email });
    if (!existingStudent) {
        throw new appError('Student not registered', 404);
    }

    try {
        const otp = crypto.randomInt(100000, 999999).toString();
        existingStudent.otp = await bcrypt.hash(otp, 10);
        await existingStudent.save();

        const message = {
            from: process.env.SENDGRID_EMAIL,
            to: email,
            subject: 'Password Reset OTP',
            text: `Your OTP is ${otp}. It will expire in 3 minutes`
        }
        await sgMail.send(message);

        return {
            message: 'OTP sent to your email. It is valid for 3 minutes'
        };
    } catch (error) {
        throw new appError('Error sending email', 500);
    }
}

export async function resetStudentPassword(body) {
    const { email, otp, password } = body;

    const student = await Student.findOne({ email });
    if (!student) {
        throw new appError('Student not registered', 404);
    }

    if (!await bcrypt.compare(otp, student.otp)) {
        throw new appError('Invalid OTP', 400);
    }

    const otpExpirationTime = 3 * 60 * 1000;
    const currentTime = Date.now();
    if (currentTime - student.updatedAt > otpExpirationTime) {
        throw new appError('OTP has expired', 400);
    }

    student.hashedPassword = await bcrypt.hash(password, 10);
    student.otp = undefined;
    await student.save();

    return {
        message: 'Password reset successfully'
    };
}