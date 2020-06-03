import fs from 'fs';
import nodemailer from 'nodemailer';
import path from 'path';
import * as email_config from '../resources/email/email_config.json';

// TODO: put image in the html and add more text
const email_template = fs.readFileSync(
    path.resolve(__dirname, '../resources/email/email_template.html'),
    'utf8'
);

const transporter = nodemailer.createTransport(email_config);
const signupMailOptions = {
    from: 'reackathon.project@gmail.com',
    subject: 'Benvenuto su Reackathon!',
    html: email_template,
};

export default function sendWelcomeMessage(emailTarget: string) {
    const options = { ...signupMailOptions, to: emailTarget };
    transporter.sendMail(options, (err, info) => {
        if (err != null) console.error(`Error while sending welcome email: ${err}`);
        else console.log(`Welcome email: ${info}`);
    });
}
