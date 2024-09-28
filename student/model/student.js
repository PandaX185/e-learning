import { Schema, model } from 'mongoose';

const studentSchema = new Schema(
    {
        firstName: {
            type: String,
            required: true
        },
        lastName: {
            type: String,
            required: true
        },
        email: {
            type: String,
            unique: true,
            required: true
        },
        hashedPassword: {
            type: String,
            required: true,
            select: false
        },
        grade: {
            type: Number,
            required: true
        },
        teachers: {
            type: [Schema.Types.ObjectId],
            ref: 'Teacher'
        },
        profilePicture: {
            type: String
        },
        otp: {
            type: String
        }
    },
    {
        timestamps: true
    }
);

const Student = model('Student', studentSchema);

export default Student;