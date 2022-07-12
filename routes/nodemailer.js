import nodemailer from 'nodemailer';

const sendEmail = async (data) => {

  try {

    // const mailOptions = {
    //   from: process.env.SMTP_MAIL,
    //   to: emailUser.email,
    //   subject: emailUser.subject,
    //   text: emailUser.message,
    // };

    const options = {
      port: 465,  // 465 ist ein verschlüsselter port.
      host: 'mail.riseup.net',  // mailserver
      secure: true, // meisten email anbieter verlangen hier verschlüsselung.
      auth: {
        user: process.env.SMTP_MAIL,
        pass: process.env.SMTP_PASSWORD,
      },
      // tls: {
      //   // do not fail on invalid certs
      //   rejectUnauthorized: false,
      // },
    }

    let transporter = nodemailer.createTransport(options)

    let info = await transporter.sendMail({
      from: '<nodemailer@riseup.net>', // sender address
      to: "kliebereveline@gmail.com", // list of receivers
      subject: "neue nachricht von meet-up-dogs-frontend", // Subject line
      text: `${data.message} from d${data.email}`// plain text body

      // html: "<b>Hello world?</b>", // html body
    });

    console.log("Message sent: %s", info.messageId);
  }

  catch (error) {
    console.log(error)

  }
}

export default sendEmail;