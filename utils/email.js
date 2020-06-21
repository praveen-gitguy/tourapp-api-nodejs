const nodemailer = require('nodemailer');

sendEmail = async (options) =>
{
    const transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        auth: {
            user: process.env.EMAIL_USERNAME,
            pass: process.env.EMAIL_PASSWORD
        }
    });

    // var transporter = nodemailer.createTransport({
    //     host: "smtp.mailtrap.io",
    //     port: 2525,
    //     auth: {
    //         user: "c0fff11717f7c0",
    //         pass: "0868d75c420ca4"
    //     }
    // });

    const mailOptions = {
        from: '"Test Server" <test@maill.io>',
        to: options.email,
        subject: options.subject,
        text: options.message
    };

    await transporter.sendMail(mailOptions);
}
module.exports = sendEmail;