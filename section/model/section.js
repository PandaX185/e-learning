import mongoose from "mongoose";

const sectionSchema = mongoose.Schema({
    quiz: {
        type: String,
    },
    pdf: {
        type: String,
    },
});

const Section = mongoose.model("Section", sectionSchema);

export default Section;
