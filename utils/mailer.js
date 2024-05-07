import nodemailer from "nodemailer";

const mailer = async (emailContent) => {
  let transporter = nodemailer.createTransport({
    host: "smtp.hostinger.com",
    port: 465,
    secure: true, // true for 465, false for other ports
    auth: {
      user: "contact@cardiomuscle.fit",
      pass: "Agarwal@29",
    },
    tls: {
      rejectUnauthorized: false,
    },
  });

  let info = await transporter.sendMail(emailContent);

  console.log("Message sent: %s", info.messageId);
  console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
};

export default mailer;