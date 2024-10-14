import mongoose from "mongoose";

const courseSchema = mongoose.Schema({
    teacher: {
        type: mongoose.Types.ObjectId,
        ref: "Teacher",
    },
    description: {
        type: String,
    },
    lessons: [
        {
            type: mongoose.Types.ObjectId,
            ref: "lesson",
        },
    ],
});

const course = mongoose.model("course", courseSchema);

export default course;
