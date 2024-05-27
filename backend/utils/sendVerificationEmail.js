import nodemailer from "nodemailer";
import emailTemplate from "./emailTemplate.js";

export default async function (details, token) {
  console.log({ token, details });

  let transporter = nodemailer.createTransport({
    service: "gmail",
    port: 465,
    secure: true,
    logger: true,
    debug: true,
    secureConnection: false,
    auth: {
      user: process.env.EMAIL_ADDRESS,
      pass: process.env.EMAIL_PASSWORD,
    },
    tls: {
      rejectUnauthorized: true,
    },
  });

  let mailOptions = {
    from: process.env.EMAIL_ADDRESS,
    to: process.env.APPROVER_EMAIL,
    subject:
      "Tafawuq Gulf: Approve " + details.name + " as " + details.UserType,
    html: emailTemplate(details, token),
  };

  // send otp to email

  const sendMail = new Promise((resolve) => {
    transporter.sendMail(mailOptions, async function (error, info) {
      resolve({ error, info });
    });
  });

  const { error, info } = await sendMail;

  console.log(error ? { error } : info.response);

  if (error) throw new Error("Error while sending email");
}
