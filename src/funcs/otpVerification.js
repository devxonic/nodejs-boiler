//const nodemailer = require("nodemailer");
// import user from "../models/user.js";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";

//otp string generation
const otp = (length = 4) => {
  let result = "";
  const characters = "0123456789";
  const charactersLength = characters.length;
  for (let i = 0; i < length; i += 1) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
};

//sending email code
// exports.sendEmailOTP = async (sendTo) => {
//   const OTPString = otp();
//   var data = {
//     to: sendTo,
//     subject: process.env.APP_NAME + " Signup OTP",
//     body: OTPString,
//   };
//   await sendMail(data)
//     .then(async (data) => {
//       const saveOtpResult = await saveOtp(OTPString, sendTo);
//     })
//     .catch((error) => {
//       throw "otpSendingcrashed";
//     });
//   return true;
// };

// exports.sendPasswordOTP = async (sendTo, userId) => {
//   const token = jwt.sign({ _id: userId }, process.env.JWTPWD, {
//     expiresIn: "20m",
//   });
//   var transporter = nodemailer.createTransport({
//     host: "hostgator.com",
//     port: 465,
//     auth: {
//       user: "info@devxonic.com",
//       pass: "Hasni@01",
//     },
//   });
//   var data = {
//     from: "info@devxonic.com",
//     to: sendTo,
//     subject: "password reset",
//     html: ` <h2>Please click on given link to reset your password<h2>
//             <p>www.google.com</p>
//     `,
//   };

//   transporter.sendMail(data, function (error, info) {
//     if (error) {
//       console.log(error);
//       return null;
//     } else {
//       console.log("Email sent: " + info.response);
//       return token;
//     }
//   });
// };

// //save otp in user
// const saveOtp = async (OTPString, sendTo) => {
//   user
//     .findOneAndUpdate(
//       { email: sendTo },
//       { $set: { verificationCode: OTPString } }
//     )
//     .then((result) => {
//       return "success";
//     })
//     .catch((err) => {
//       return err;
//     });
// };

//nodemailer sendMail function
export const sendMail = (data) => {
  console.log(data.to);
  return new Promise((resolve, reject) => {
    var transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "dev@devxonic.my",
        pass: "wewewewew",
      },
    });
    var mailOptions = {
      from: "dev@devxonic.my",
      to: data.to,
      subject: data.subject,
      // html: data.html,
      // attachments: data.attachment,
    };
    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
        reject(error);
      } else {
        console.log("works");
        resolve(info.response);
      }
    });
  });
};

export const sendPasswordOTPs = async (sendTo, userId) => {
  const token = jwt.sign({ _id: userId }, "devxonic", {
    expiresIn: "30m",
  });
  var transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "dev@devxonic.my",
      pass: "cecececece",
    },
  });
  var data = {
    from: "dev@devxonic.my",
    to: sendTo,
    subject: "dev" + " password reset",
    html: ` <h2>Please click on given link to reset your password<h2>
    `,
  };

  transporter.sendMail(data, function (error, info) {
    if (error) {
      console.log(error);
      return null;
    } else {
      console.log("Email sent: " + info.response);
      return token;
    }
  });
};

const sendPasswordMail = (data) => {
  console.log(data);
  return new Promise((resolve, reject) => {
    var transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      auth: {
        user: "dev@devxonic.my",
        pass: "devxonic",
      },
    });
    var mailOptions = {
      from: "dev@devxonci.my",
      to: data.to,
      subject: data.subject,
      text: data.body,
      html: data.html,
      attachments: data.attachment,
    };
    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
        reject(error);
      } else {
        console.log("works");
        resolve(info.response);
      }
    });
  });
};

// exports.verifyOtp = async (otp, sentTo) => {
//   //const expiry = moment().utcOffset("+00:00").format("YYYY-MM-DD HH:mm:ss");
//   const fuser = await user.findOne({ email: sentTo });
//   if (!fuser) {
//     return "noUserFound";
//   }
//   if (fuser) {
//     if (fuser.verificationCode === otp) {
//       fuser.verificationCode = 0;
//       fuser.emailVerified = 1;
//       fuser.save();
//       return "verified";
//     } else if (fuser.verificationCode !== otp) {
//       return "invalid code";
//     }
//   }
// };

// exports.uniqueFileName = (length = 13) => {
//   let result = "";
//   const characters =
//     "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
//   const charactersLength = characters.length;
//   for (let i = 0; i < length; i += 1) {
//     result += characters.charAt(Math.floor(Math.random() * charactersLength));
//   }
//   return result;
// };
