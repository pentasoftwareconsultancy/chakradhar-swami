const express = require("express");
const bcrypt = require("bcrypt");
const User = require("../UserDetails");

const router = express.Router();

// Route to send OTP
router.post("/forgot-password", async (req, res) => {
    const { mobile } = req.body;

    const user = await User.findOne({ mobile });
    if (!user) {
        return res.status(404).json({ error: "User not found" });
    }

    try {
        await sendOTP(mobile);
        res.status(200).json({ message: "OTP sent successfully" });
    } catch (error) {
        res.status(500).json({ error: "Failed to send OTP" });
    }
});

// Route to verify OTP and reset password
router.post("/reset-password", async (req, res) => {
    const { mobile, otp, newPassword } = req.body;

    const user = await User.findOne({ mobile });
    if (!user || user.otp !== otp || user.otpExpiry < Date.now()) {
        return res.status(400).json({ error: "Invalid or expired OTP" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    user.otp = null; // Clear the OTP
    user.otpExpiry = null; // Clear expiry
    await user.save();

    res.status(200).json({ message: "Password reset successfully" });
});

module.exports = router;
