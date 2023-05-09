const { conn } = require("../config/db_config");
const express = require("express");
const app = express();
app.use(express.static("public"));


exports.reviewIndex = (req, res) => {
  const query = "SELECT * FROM review";
  conn.query(query, (error, results) => {
    if (error) {
      console.error(error);
      res.status(500).send("Error fetching clients");
    } else {
      res.json(results);
    }
  });
};


exports.reviewCreate = (req, res) => {
  const { file } = req;
  firstname = req.body.firstname;
  stars_count = req.body.stars_count;
  review = req.body.review;
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth() + 1;
  const day = today.getDate();
  const todayDate = `${year}-${month}-${day}`;

  q =
    "INSERT INTO review ( name, rimage, stars_count, review, date) VALUES (? ,? , ? , ?,?)";
  conn.query(
    q,
    [firstname, `${file.filename}`, stars_count, review, todayDate],
    (err, result) => {
      if (err) {
        console.log(err);
      } else {
        res.send("Client created Successfully");
      }
      // sendVerificationEmail(email, file);
    }
  );
};
