const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({

    email: {
        type: String,
        unique: true
    },

    googleId: String,

    refreshToken: String,

    lastSyncTime: {
        type: Number,
        default: 0
    }

}, {
    timestamps: true
});

module.exports = mongoose.model(
    "User",
    userSchema
);