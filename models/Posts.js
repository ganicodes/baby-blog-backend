const mongoose = require("mongoose");
const { Schema } = mongoose;

const postsSchema = new Schema({
    title: {
        type: String,
        required: true,
        unique: true
    },
    desc: {
        type: String,
        required: true
    },
    photo: {
        type: String
    },
    author: {
        type: String,
        required: true,
        default: "unknown"
    },
    categories: {
        type: String
    },
}, { timestamps: true });

module.exports = mongoose.model("Posts", postsSchema);
