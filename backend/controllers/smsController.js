const twilio = require("twilio");
const User = require("../UserDetails"); 

const client = twilio("TWILIO_ACCOUNT_SID", "TWILIO_AUTH_TOKEN"); 

const sendOTP = async (mobile) => {
    const otp = Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit OTP
    const expiry = Date.now() + 10 * 60 * 1000; // 10 minutes from now

    try {
        // Update the user record
        await User.findOneAndUpdate({ mobile }, { otp, otpExpiry: expiry });

        // Send the OTP via SMS
        const message = await client.messages.create({
            body: `Your OTP for password reset is: ${otp}`,
            from: "TWILIO_PHONE_NUMBER",
            to: mobile,
        });

        console.log("Message SID:", message.sid); // Log the SID for tracking

        return otp; // Optional, for debugging
    } catch (error) {
        console.error("Failed to send OTP:", error);
        throw new Error("Failed to send OTP");
    }
};
