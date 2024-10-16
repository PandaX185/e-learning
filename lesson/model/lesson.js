import mongoose from "mongoose";

const lessonSchema = mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    discription: {
        type: String,
    },
    material: {
        type: String,
        requried: true,
    },
    sections: [
        {
            type: mongoose.Types.ObjectId,
            ref: "Section",
        },
    ],
});

const lesson = mongoose.model("lesson", lessonSchema);

export default lesson;
