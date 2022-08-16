import nodemailer from "nodemailer";

const sendEmail = async (data) => {
  try {
    const options = {
      port: 465, // 465 ist ein verschlüsselter port.
      host: "mail.riseup.net", // mailserver
      secure: true, // meisten email anbieter verlangen hier verschlüsselung.
      auth: {
        user: process.env.SMTP_MAIL,
        pass: process.env.SMTP_PASSWORD,
      },
    };

    let transporter = nodemailer.createTransport(options);

    let info = await transporter.sendMail({
      from: "<nodemailer@riseup.net>", // sender address
      to: "meetupdogs@gmail.com", // list of receivers
      subject: "neue nachricht von meet-up-dogs-frontend", // Subject line
      text: `${data.message} from ${data.email}`, // plain text body
    });

    console.log("Message sent: %s", info.messageId);
    console.log(data);
  } catch (error) {
    console.log(error);
  }
};

export default sendEmail;
