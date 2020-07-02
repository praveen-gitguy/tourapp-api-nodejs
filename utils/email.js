const nodemailer = require('nodemailer');
const pug = require('pug');
const htmlToText = require('html-to-text');

module.exports = class Email
{
    constructor(user, url)
    {
        this.to = user.email;
        this.firstName = user.name.split('')[0];
        this.url = url;
        this.from = `Praveen Kumar <${process.env.EMAIL_FROM}>`;
    }

    newTransport()
    {
        if (process.env.NODE_ENV === 'production') {
            return nodemailer.createTransport({
                service: 'SendGrid',
                auth: {
                    user: process.env.SENDGID_USERNAME,
                    pass: process.env.SENDGRID_PASSWORD
                }
            });
        } else {
            return nodemailer.createTransport({
                host: process.env.EMAIL_HOST,
                port: process.env.EMAIL_PORT,
                auth: {
                    user: process.env.EMAIL_USERNAME,
                    pass: process.env.EMAIL_PASSWORD
                }
            });
        }
    }

    async send(template, subject)
    {
        // Send the actual email
        // 1. Render html based on a pug template
        const html = pug.renderFile(`${__dirname}/../views/email/${template}.pug`, {
            firstName: this.firstName,
            url: this.url,
            subject
        });

        // 2. define email options
        const mailOptions = {
            from: this.from,
            to: this.to,
            subject,
            html,
            text: htmlToText.fromString(html)
        };

        // 3. create a transpport and send email
        await this.newTransport().sendMail(mailOptions);
    }

    async sendWelome()
    {
        await this.send('welcome', 'Welcome to the natours family!');
    }

    async sendPasswordReset()
    {
        await this.send('passwordReset', 'Your password reset token (valid for only ten minute');
    }

}

// const sendEmail = async (options) =>
// {
//     const mailOptions = {
//         from: '"Test Server" <test@maill.io>',
//         to: options.email,
//         subject: options.subject,
//         text: options.message
//     };

//     await transporter.sendMail(mailOptions);
// }
