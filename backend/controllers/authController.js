import nodemailer from "nodemailer";
import bcrypt from "bcryptjs";
import User from "../models/user.js";

// Temporary OTP store (in-memory)
let otpStore = {};

const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();

// ✅ 1. SEND OTP
export const forgotPassword = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: "Email is required" });
  }

  // Check if user exists
  const user = await User.findOne({ email });
  if (!user) {
    return res.status(404).json({ message: "No account found with this email." });
  }

  const otp = generateOTP();

  otpStore[email] = {
    otp,
    expires: Date.now() + 5 * 60 * 1000, // 5 minutes
    verified: false,
  };

  console.log(`=================================`);
  console.log(`📧 OTP for ${email}: ${otp}`);
  console.log(`=================================`);

  // If no email config → return OTP in response (dev mode)
  if (!process.env.EMAIL || !process.env.EMAIL_PASS) {
    console.warn("⚠️ Email not configured. Returning OTP in response (dev mode).");
    return res.json({
      message: "OTP generated (dev mode - no email configured)",
      otp, // Remove this in production!
    });
  }

  try {
    const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL,
    pass: process.env.EMAIL_PASS,
  },
      tls: { rejectUnauthorized: false },
    });

    await transporter.sendMail({
      from: `"Dear Mind 💜" <${process.env.EMAIL}>`,
      to: email,
      subject: "Your Password Reset OTP - Dear Mind",
      html: `
        <div style="font-family:Arial,sans-serif;max-width:480px;margin:0 auto;padding:24px;">
          <div style="text-align:center;margin-bottom:20px;">
            <h2 style="color:#7c3aed;">Dear Mind 💜</h2>
            <p style="color:#6b7280;">Your safe space to reflect</p>
          </div>
          <div style="background:linear-gradient(135deg,#6d28d9,#8b5cf6);padding:32px;border-radius:16px;color:white;text-align:center;">
            <h3 style="margin-bottom:8px;">Password Reset OTP</h3>
            <p style="font-size:42px;letter-spacing:8px;font-weight:800;margin:16px 0;">${otp}</p>
            <p style="font-size:13px;opacity:0.8;">Valid for 5 minutes only</p>
          </div>
          <p style="text-align:center;color:#9ca3af;font-size:12px;margin-top:16px;">
            If you didn't request this, please ignore this email.
          </p>
        </div>
      `,
    });

    res.json({ message: "OTP sent to your email successfully." });
  } catch (err) {
    console.error("❌ Email error:", err.message);
    // Fallback: still return OTP in dev
    res.json({
      message: "OTP generated (email failed - check console)",
      otp,
    });
  }
};

// ✅ 2. VERIFY OTP
export const verifyOtp = (req, res) => {
  const { email, otp } = req.body;

  if (!email || !otp) {
    return res.status(400).json({ message: "Email and OTP are required." });
  }

  const data = otpStore[email];

  if (!data) {
    return res.status(400).json({ message: "No OTP found. Please request a new one." });
  }

  if (Date.now() > data.expires) {
    delete otpStore[email];
    return res.status(400).json({ message: "OTP has expired. Please request a new one." });
  }

  if (data.otp !== otp.toString()) {
    return res.status(400).json({ message: "Invalid OTP. Please try again." });
  }

  // Mark as verified
  otpStore[email].verified = true;
  res.json({ message: "OTP verified successfully." });
};

// ✅ 3. RESET PASSWORD — actually updates DB
export const resetPassword = async (req, res) => {
  const { email, otp, newPassword } = req.body;

  if (!email || !otp || !newPassword) {
    return res.status(400).json({ message: "Email, OTP, and new password are required." });
  }

  if (newPassword.length < 6) {
    return res.status(400).json({ message: "Password must be at least 6 characters." });
  }

  const data = otpStore[email];

  if (!data) {
    return res.status(400).json({ message: "No OTP found. Please request a new one." });
  }

  if (Date.now() > data.expires) {
    delete otpStore[email];
    return res.status(400).json({ message: "OTP has expired. Please request a new one." });
  }

  if (data.otp !== otp.toString()) {
    return res.status(400).json({ message: "Invalid OTP." });
  }

  if (!data.verified) {
    return res.status(400).json({ message: "OTP not verified. Please verify first." });
  }

  try {
    // ✅ Actually update the user password in MongoDB
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();

    // Clear OTP store
    delete otpStore[email];

    console.log(`✅ Password reset successfully for ${email}`);
    res.json({ message: "Password reset successfully. You can now login." });
  } catch (error) {
    console.error("❌ Reset password error:", error.message);
    res.status(500).json({ message: "Failed to reset password. Please try again." });
  }
};

// Clean up expired OTPs every minute
setInterval(() => {
  const now = Date.now();
  for (const [email, data] of Object.entries(otpStore)) {
    if (data.expires < now) {
      delete otpStore[email];
      console.log(`🧹 Cleaned expired OTP for ${email}`);
    }
  }
}, 60000);