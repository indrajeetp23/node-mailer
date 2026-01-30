import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import sgMail from "@sendgrid/mail";

dotenv.config();

const app = express();

// ✅ Enable CORS
app.use(cors({ origin: "*" }));
app.use(express.json());

// ✅ SendGrid API Key
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

// ✅ POST route to send email
app.post("/send-mail", async (req, res) => {
  const { name, email, message } = req.body;

  try {
    await sgMail.send({
      to: process.env.EMAIL_USER,      // Your verified SendGrid email
      from: process.env.EMAIL_USER,    // Sender email must be verified
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
