
const mongoose = require("mongoose");
const userVerificationSchema = new mongoose.Schema({
    userId: { type: String, required: true },
    uniqueString: { type: String, required: true },
    createdAt: { type: Date, required: true },
    expiresAt: { type: Date, required: true },
});

const userVerification = mongoose.model("userverification", userVerificationSchema);

module.exports = userVerification;