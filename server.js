import express from "express";
import nodemailer from "nodemailer";
import dotenv from "dotenv";
import cors from "cors";

dotenv.config();

const app = express();

// ✅ Enable CORS for frontend
app.use(cors({
  origin: "*" // optional: replace "*" with your Vercel frontend URL for security
}));

app.use(express.json());

// ✅ Nodemailer transporter (Gmail App Password)
const transporter = nodemailer.createTransport({
  host: "smtp.sendgrid.net",
  port: 587,         // TLS
  secure: false,     // false for 587
  auth: {
    user: "apikey",  // literally "apikey"
    pass: process.env.SENDGRID_API_KEY, // ENV me rakho
  },
});


// ✅ POST route to send email
app.post("/send-mail", async (req, res) => {
  const { name, email, message } = req.body;

  try {
    await transporter.sendMail({
      from: email,
      to: process.env.EMAIL_USER,
      subject: `New Contact Message from ${name}`,
      html: `
        <p><b>Name:</b> ${name}</p>
        <p><b>Email:</b> ${email}</p>
        <p><b>Message:</b> ${message}</p>
      `,
    });

    res.json({ success: true, message: "Mail sent successfully ✅" });
  } catch (err) {
    console.error("MAIL ERROR 👉", err);
    res.status(500).json({ success: false, message: err.message });
  }
});

// ✅ Optional GET route to check backend is alive
app.get("/send-mail", (req, res) => {
  res.send("Backend is alive! Use POST /send-mail to send emails.");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
