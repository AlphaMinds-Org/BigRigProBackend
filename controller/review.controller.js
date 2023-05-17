const { conn } = require("../config/db_config");
const express = require("express");
const app = express();
app.use(express.static("public"));
const fs = require("fs-extra");


exports.reviewDelete = (req, res) => {
    const { id } = req.body;
    console.log(id);
  
    // First, retrieve the client's file path from the database
    conn.query(
      "SELECT rimage FROM review WHERE id_review = ?",
      [id],
      (err, result) => {
        if (err) {
          console.log(err);
          res.status(500).send("Error deleting review");
          return;
        }
  
        const filePath = `public/images/review/${id}/${result[0].rimage}`;
        console.log(filePath);
  
        // Delete the client record from the database
        conn.query(
          "DELETE FROM review WHERE id_review = ?",
          [id],
          (err, result) => {
            if (err) {
              console.log(err);
              res.status(500).send("Error deleting review");
              return;
            }
  
            // Delete the client's image directory and all of its contents
            fs.remove(`public/images/review/${id}`, (err) => {
              if (err) {
                console.log(err);
                res.status(500).send("Error deleting review image directory");
                return;
              }
  
              res.send("Review deleted successfully");
            });
          }
        );
      }
    );
  };


exports.reviewIndex = (req, res) => {
  const query = "SELECT * FROM review ORDER BY id_review DESC;";
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
  const maxID = 0;
  try{
  const sql = "SELECT max(id_review) as max_id from review";
    conn.query(sql, (err, result) => {
      if (err) {
        console.log("Error getting max ID", err);
        cb(err);
      } else {
         maxId = result[0].max_id || 0;
         console.log("line 86", maxId);
        
      }
});
  
  q =
    "INSERT INTO review (id_review, name, rimage, stars_count, review, date) VALUES (?,? ,? , ? , ?,?)";
  conn.query(
    q,
    [maxId+1,firstname, `${file.filename}`, stars_count, review, todayDate],
    (err, result) => {
      if (err) {
        console.log(err);
        res.status(500).json({ error: "An error occured" });
      } else {
        res.send("Client created Successfully");
      }
      // sendVerificationEmail(email, file);
    }
  );
}catch(err){  
  console.log("line 106",err);
  res.status(500).json({ error: "An error occured" });
}
};
