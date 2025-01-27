import nodemailer from "nodemailer";

var transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "salahmomo3060@gmail.com",
    pass: "szad xmye dqyg hstq",
  },
});

var mailOptions = {
  from: "Pixel Project BE",
  to: "mahmoud2abdalfattah@gmail.com",
  subject: "Testing send mail for pixel project",
  text: " Hello Mr Mansy DO You Know me !",
};

transporter.sendMail(mailOptions, function (error, info) {
  if (error) {
    console.log(error);
  } else {
    console.log("Email sent: " + info.response);
  }
});
