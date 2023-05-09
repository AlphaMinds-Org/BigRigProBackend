const { conn } = require("../config/db_config");

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

  q =
    "INSERT INTO contact (firstname,lastname, email, contact_no, message, subject, date) VALUES (? ,? , ? , ?,?,?,?)";
  conn.query(
    q,
    [firstname, lastname, email, contact, subject, message, todayDate],
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
