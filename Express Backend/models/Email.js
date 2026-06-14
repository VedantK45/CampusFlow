const mongoose = require("mongoose");

const emailSchema = new mongoose.Schema({

    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },

    gmailId: {
        type: String,
        unique: true
    },

    threadId: String,

    from: String,

    to: String,

    subject: String,

    body: String,

    html: String,

    date: String,

    pdfUrl: String,

    s3Key: String

}, {
    timestamps: true
});

module.exports =
    mongoose.model(
        "Email",
        emailSchema
    );