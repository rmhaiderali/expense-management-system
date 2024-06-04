import nodemailer from "nodemailer";

export default async function (to, title, body) {
  console.log({ title, body });

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

  const mailOptions = {
    from: process.env.EMAIL_ADDRESS,
    to: to,
    subject: title,
    html: body,
  };

  const sendMail = new Promise((resolve) => {
    transporter.sendMail(mailOptions, async function (error, info) {
      resolve({ error, info });
    });
  });

  const { error, info } = await sendMail;

  console.log(error ? { error } : info.response);

  if (error) throw new Error("Error while sending email");
}
