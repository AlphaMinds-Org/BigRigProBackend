const { conn } = require("../config/db_config");

exports.messageIndex = (req, res) => {
    const query = "SELECT * FROM contact";
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
    fname = req.body.fname;
    email = req.body.email;
    contact = req.body.contact;
    subject = req.body.subject;
    message = req.body.message;
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth() + 1;
    const day = today.getDate();
    const todayDate = `${year}-${month}-${day}`;
  
    q =
      "INSERT INTO contact (name, email, contact_no, message, subject, date) VALUES (? ,? , ? , ?,?,?)";
    conn.query(
      q,
      [
        fname,
        email,
        contact,
        subject,
        message,
        todayDate,
      ],
      (err, result) => {
        if (err) {
          console.log(err);
        } else {
          res.send("Message created Successfully");
        }
        // sendVerificationEmail(email, file);
      }
    );
  };