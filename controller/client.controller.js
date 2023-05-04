const { conn } = require("../config/db_config");
const fs = require("fs-extra");
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

exports.clientDelete = (req, res) => {
  const { id } = req.body;
  console.log(id);

  // First, retrieve the client's file path from the database
  conn.query(
    "SELECT file FROM client WHERE client_id = ?",
    [id],
    (err, result) => {
      if (err) {
        console.log(err);
        res.status(500).send("Error deleting client");
        return;
      }

      const filePath = `public/images/${id}/${result[0].file}`;
      console.log(filePath);

      // Delete the client record from the database
      conn.query(
        "DELETE FROM client WHERE client_id = ?",
        [id],
        (err, result) => {
          if (err) {
            console.log(err);
            res.status(500).send("Error deleting client");
            return;
          }

          // Delete the client's image directory and all of its contents
          fs.remove(`public/images/${id}`, (err) => {
            if (err) {
              console.log(err);
              res.status(500).send("Error deleting client image directory");
              return;
            }

            res.send("Client deleted successfully");
          });
        }
      );
    }
  );
};

exports.clientIndex = (req, res) => {
  const query = "SELECT * FROM client";
  conn.query(query, (error, results) => {
    if (error) {
      console.error(error);
      res.status(500).send("Error fetching clients");
    } else {
      const clients = results.map((client) => ({
        ...client,
        file: `/api/v1/client/${client.client_id}/${client.file}`, // updated URL
      }));
      res.json(clients);
    }
  });
};

exports.downloadFile = (req, res) => {
  const clientId = req.params.clientId;
  const filename = req.params.filename;
  const file = `${__dirname}/../public/images/${clientId}/${filename}`;

  // Set the headers for the file download
  res.setHeader("Content-Type", "application/pdf");
  res.setHeader("Content-Disposition", `attachment; filename=${filename}`);

  res.download(file, (error) => {
    if (error) {
      console.error(error);
      res.status(500).send("Error downloading file");
    }
  });
};

exports.clientCreate = (req, res) => {
  const { file } = req;
  firstname = req.body.firstname;
  lastname = req.body.lastname;
  email = req.body.email;
  contact = req.body.contact;
  address = req.body.address;
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth() + 1;
  const day = today.getDate();
  const todayDate = `${year}-${month}-${day}`;

  q =
    "INSERT INTO client (file,firstname, lastname, address, contact, email, date) VALUES (? ,? , ? , ?,?,?,?)";
  conn.query(
    q,
    [
      `${file.filename}`,
      firstname,
      lastname,
      address,
      contact,
      email,
      todayDate,
    ],
    (err, result) => {
      if (err) {
        console.log(err);
      } else {
        // const token = jwt.clientCreate(
        //   { id: result[0].id.toString() },
        //   process.env.SECRET_KEY
        // );
        // const id = result[0].id;
        // sendVerificationEmail(email);
        res.send("Client created Successfully");
      }
      sendVerificationEmail(email, file);
    }
  );  
};

const sendVerificationEmail = (email, file) => {
  const fs = require("fs");
  const path = require("path");

  const imagePath = path.join(__dirname, "../public/logo/Bigrigpro(2).png");
  const imageData = fs.readFileSync(imagePath).toString("base64");

  transporter.sendMail({
    to: email,
    subject: "Diagnostic Report",
    attachments: [
      {
        filename: file.originalname,
        path: file.path,
      },
    ],
    html: `<!DOCTYPE html>
    <html>
    <head>
    
      <meta charset="utf-8">
      <meta http-equiv="x-ua-compatible" content="ie=edge">
      <title>Diagnostic Report</title>
      <meta name="viewport" content="width=device-width, initial-scale=1">
      <style type="text/css">
      /**
       * Google webfonts. Recommended to include the .woff version for cross-client compatibility.
       */
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
    
      <!-- start preheader -->
      <div class="preheader" style="display: none; max-width: 0; max-height: 0; overflow: hidden; font-size: 1px; line-height: 1px; color: #fff; opacity: 0;">
        A preheader is the short summary text that follows the subject line when an email is viewed in the inbox.
      </div>
      <!-- end preheader -->
    
      <!-- start body -->
      <table border="0" cellpadding="0" cellspacing="0" width="100%">
    
        <!-- start logo -->
        <tr>
          <td align="center" bgcolor="#e9ecef">
            <!--[if (gte mso 9)|(IE)]>
            <table align="center" border="0" cellpadding="0" cellspacing="0" width="600">
            <tr>
            <td align="center" valign="top" width="600">
            <![endif]-->
            <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;">
              <tr>
                <td align="center" valign="top" style="padding: 36px 24px;">
                  <a href="" target="_blank" style="display: inline-block;">
                    <img src="https://i.pinimg.com/564x/41/6a/98/416a984e7a3276e67001ee3874984235.jpg" alt="Logo" border="0" width="80" style="display: block; width: 80px; max-width: 80px; min-width: 80px;">
                  </a>
                </td>
              </tr>
            </table>
            <!--[if (gte mso 9)|(IE)]>
            </td>
            </tr>
            </table>
            <![endif]-->
          </td>
        </tr>
        <!-- end logo -->
    
        <!-- start hero -->
        <tr>
          <td align="center" bgcolor="#e9ecef">
            <!--[if (gte mso 9)|(IE)]>
            <table align="center" border="0" cellpadding="0" cellspacing="0" width="600">
            <tr>
            <td align="center" valign="top" width="600">
            <![endif]-->
            <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;">
              <tr>
                <td align="left" bgcolor="#ffffff" style="padding: 36px 24px 0; font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif; border-top: 3px solid #d4dadf;">
                  <h1 style="margin: 0; font-size: 32px; font-weight: 700; letter-spacing: -1px; line-height: 48px;">Diagnostic Report</h1>
                </td>
              </tr>
            </table>
            <!--[if (gte mso 9)|(IE)]>
            </td>
            </tr>
            </table>
            <![endif]-->
          </td>
        </tr>
        <!-- end hero -->
    
        <!-- start copy block -->
        <tr>
          <td align="center" bgcolor="#e9ecef">
            <!--[if (gte mso 9)|(IE)]>
            <table align="center" border="0" cellpadding="0" cellspacing="0" width="600">
            <tr>
            <td align="center" valign="top" width="600">
            <![endif]-->
            <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;">
    
              <!-- start copy -->
              <tr>
                <td align="left" bgcolor="#ffffff" style="padding: 24px; font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif; font-size: 16px; line-height: 24px;">
                  <p style="margin: 0;">Diagnosis report is attached below and go through the report and inform us if there are anything to added or is everything correct.</p>
                </td>
              </tr>
              <!-- end copy -->
    
               
              <!-- start copy -->
              <tr>
                <td align="left" bgcolor="#ffffff" style="padding: 24px; font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif; font-size: 16px; line-height: 24px;">
                  <p style="margin: 0;">If you can't open or the attachment doesn't work email us with the error you are having.</p>
                  <p style="margin: 0;"><a href="" target="_blank"></a></p>
                </td>
              </tr>
              <!-- end copy -->
    
          
    
            </table>
            <!--[if (gte mso 9)|(IE)]>
            </td>
            </tr>
            </table>
            <![endif]-->
          </td>
        </tr>
        <!-- end copy block -->
    
        <!-- start footer -->
        <tr>
          <td align="center" bgcolor="#e9ecef" style="padding: 24px;">
            <!--[if (gte mso 9)|(IE)]>
            <table align="center" border="0" cellpadding="0" cellspacing="0" width="600">
            <tr>
            <td align="center" valign="top" width="600">
            <![endif]-->
            <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;">
    
              <!-- start permission -->
              <tr>
                <td align="center" bgcolor="#e9ecef" style="padding: 12px 24px; font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif; font-size: 14px; line-height: 20px; color: #666;">
                  <p style="margin: 0;">You received this email because we have received your requirements and to confirm.</p>
                </td>
              </tr>
              <!-- end permission -->
    
              <!-- start unsubscribe -->
              <!-- end unsubscribe -->
    
            </table>
            <!--[if (gte mso 9)|(IE)]>
            </td>
            </tr>
            </table>
            <![endif]-->
          </td>
        </tr>
        <!-- end footer -->
    
      </table>
      <!-- end body -->
    <table>
    <tr>
    <td>
    <p>For further assistance, please call +94 11 2 30 30 50 or email to info@bigrigpro.ca</p>
     </br>
    <p>Yours Faithfully,</p>
    </br>
      <p>Manager - Operations</p>
      </br>
      <p>Big Rig Pro - Operations Department</p>
      </br>
      <p>Canada
      </p>
    </td>
    </tr>
    </table>
    </body>
    </html>`,
    // html: `Click the following link to verify your email: <a href="${link}">${link}</a>`,
  });
};
