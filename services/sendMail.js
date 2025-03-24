const nodemailer = require('nodemailer');

const sendMail = async (req,res) => {
    const { to, subject, text } = req.body;

    if (!to || !subject || !text) {
        return res.status(400).json({ error: "All fields are required" });
    }

    try {
        let transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });

        let mailOptions = {
            from: process.env.EMAIL_USER,
            to,
            subject,
            text
        };

        let info = await transporter.sendMail(mailOptions);
        res.status(200).json({ message: "Email sent successfully!", info });
    } catch (error) {
        res.status(500).json({ error: "Failed to send email", details: error.message });
    }
};


module.exports = {
    sendMail,
}