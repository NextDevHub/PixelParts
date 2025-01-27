import nodemailer from "nodemailer";
import dotenv from "dotenv";
import { generateEmailTemplate } from "./emailTemplate.js";
dotenv.config({ path: "../.env" });

const createSendAuthEmail = async (options) => {
  const { user, verifyLink } = options;
  var transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL,
      pass: process.env.PASSWORD,
    },
  });
  const html = generateEmailTemplate(user.firstname, verifyLink);
  const mailOptions = {
    from: "Pixel Parts",
    to: user.email,
    subject: "Verify Your Account",
    html,
  };
  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log("Email sent: " + info.response);
    }
  });
};

createSendAuthEmail({
  user: {
    firstname: "Mahmoud",
    email: "mahmoud2abdalfattah@gmail.com",
  },
  verifyLink: "https://e-commerce-mansy.vercel.app/",
});

export { createSendAuthEmail };
