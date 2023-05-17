const { conn } = require("../config/db_config");
const express = require("express");
const app = express();
var nodemailer = require("nodemailer");
app.use(express.static("public"));

var transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "testemail991015@gmail.com",
    pass: "wsuixrquqqcjrpfa",
  },
});

exports.messageIndex = (req, res) => {
  const query = "SELECT * FROM contact ORDER BY id_contact DESC";
  conn.query(query, (error, results) => {
    if (error) {
      console.error(error);
      res.status(500).send("Error fetching contact");
    } else {
      res.json(results);
    }
  });
};

exports.messageCreate = (req, res) => {
  firstname = req.body.firstname;
  lastname = req.body.lastname;
  email = req.body.email;
  contact = req.body.contact;
  subject = req.body.subject;
  message = req.body.message;
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth() + 1;
  const day = today.getDate();
  const todayDate = `${year}-${month}-${day}`;
  subject = "Client Message";
  const senderemail = "minidumadubashiya15@gmail.com";

  q =
    "INSERT INTO contact (firstname,lastname, email, contact_no, message, subject, date) VALUES (? ,? , ? , ?,?,?,?)";
  conn.query(
    q,
    [firstname, lastname, email, contact, message, subject, todayDate],
    (err, result) => {
      if (err) {
        console.log(err);
      } else {
        res.send("Message created Successfully");
      }

      sendVerificationEmail(
        senderemail,
        firstname,
        lastname,
        contact,
        email,
        subject,
        message
      );
    }
  );
};

const sendVerificationEmail = (
  senderemail,
  firstname,
  lastname,
  contact,
  email,
  subject,
  message
) => {
  // console.log(firstname);
  // console.log(lastname);
  // console.log(contact);
  // console.log(email);
  // console.log(subject);
  // console.log(message);

  transporter.sendMail({
    to: senderemail,
    subject: subject,
    attachments: [],
    html: `<!DOCTYPE html>
    <html>
    <head>
    
      <meta charset="utf-8">
      <meta http-equiv="x-ua-compatible" content="ie=edge">
      <title>Diagnostic Report</title>
      <meta name="viewport" content="width=device-width, initial-scale=1">
      <style type="text/css">
      @media screen {
        @font-face {
          font-family: 'Source Sans Pro';
          font-style: normal;
          font-weight: 400;
          src: local('Source Sans Pro Regular'), local('SourceSansPro-Regular'), url(https://fonts.gstatic.com/s/sourcesanspro/v10/ODelI1aHBYDBqgeIAH2zlBM0YzuT7MdOe03otPbuUS0.woff) format('woff');
        }
        @font-face {
          font-family: 'Source Sans Pro';
          font-style: normal;
          font-weight: 700;
          src: local('Source Sans Pro Bold'), local('SourceSansPro-Bold'), url(https://fonts.gstatic.com/s/sourcesanspro/v10/toadOcfmlt9b38dHJxOBGFkQc6VGVFSmCnC_l7QZG60.woff) format('woff');
        }
      }
      /**
       * Avoid browser level font resizing.
       * 1. Windows Mobile
       * 2. iOS / OSX
       */
      body,
      table,
      td,
      a {
        -ms-text-size-adjust: 100%; /* 1 */
        -webkit-text-size-adjust: 100%; /* 2 */
      }
      /**
       * Remove extra space added to tables and cells in Outlook.
       */
      table,
      td {
        mso-table-rspace: 0pt;
        mso-table-lspace: 0pt;
      }
      /**
       * Better fluid images in Internet Explorer.
       */
      img {
        -ms-interpolation-mode: bicubic;
      }
      /**
       * Remove blue links for iOS devices.
       */
      a[x-apple-data-detectors] {
        font-family: inherit !important;
        font-size: inherit !important;
        font-weight: inherit !important;
        line-height: inherit !important;
        color: inherit !important;
        text-decoration: none !important;
      }
      /**
       * Fix centering issues in Android 4.4.
       */
      div[style*="margin: 16px 0;"] {
        margin: 0 !important;
      }
      body {
        width: 100% !important;
        height: 100% !important;
        padding: 0 !important;
        margin: 0 !important;
      }
      /**
       * Collapse table borders to avoid space between cells.
       */
      table {
        border-collapse: collapse !important;
      }
      a {
        color: #1a82e2;
      }
      img {
        height: auto;
        line-height: 100%;
        text-decoration: none;
        border: 0;
        outline: none;
      }
      </style>
    
    </head>
    <body style="background-color: #e9ecef;">
    <table>
          <tr>
          <td>
    <h1 style="margin: 0; font-size: 28px; font-weight: 700; letter-spacing: -1px; line-height: 48px;">Big Rig Pro Client Messages</h1>
    <br>
    <p>Full Name: ${firstname} ${lastname},</p>
    <br>
    <p>Email:${email}</p>
    <br>
    <p>Contact:${contact}</p>
    <br>
    <p style="font-size: 16px;">Message:${message}</p>
    </td>
    </tr>
    </table>
      <!-- start preheader -->
         </body>
    </html>`,
    // html: `Click the following link to verify your email: <a href="${link}">${link}</a>`,
  });
};
