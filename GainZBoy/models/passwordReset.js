
const mongoose = require("mongoose");
const passwordResetSchema = new mongoose.Schema({
    userId: { type: String, required: true },
    uniqueString: { type: String, required: true },
    verified: { type: Boolean, required: true },
    createdAt: { type: Date, required: true },
    expiresAt: { type: Date, required: true },
});

const passwordReset = mongoose.model("passwordReset", passwordResetSchema);

module.exports = passwordReset;