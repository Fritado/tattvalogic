const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
    // If SMTP_HOST is not set, log the email to console for development
    if (!process.env.SMTP_HOST) {
        console.log('================================================================');
        console.log('📧 MOCK EMAIL DISPATCHED (SMTP Config Missing in .env)');
        console.log(`To: ${options.email}`);
        console.log(`Subject: ${options.subject}`);
        console.log('================================================================');
        return;
    }

    const port = parseInt(process.env.SMTP_PORT || '587');
    const isSecure = port === 465;

    const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port,
        secure: isSecure,
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS
        },
        tls: {
            rejectUnauthorized: false // allows self-signed certs & common hosting setups
        }
    });

    const message = {
        from: `"${process.env.FROM_NAME || 'TattvaLogic'}" <${process.env.FROM_EMAIL || 'noreply@tattvalogic.com'}>`,
        to: options.email,
        subject: options.subject,
        html: options.message
    };

    const info = await transporter.sendMail(message);
    console.log(`✅ Email sent to ${options.email}: ${info.messageId}`);
};

module.exports = sendEmail;

