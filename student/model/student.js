import mongoose, { Schema, model } from 'mongoose';

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
        teacherId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Teacher',
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

studentSchema.index({ email: 1, teacherId: 1 }, { unique: true });

const Student = model('Student', studentSchema);

export default Student;