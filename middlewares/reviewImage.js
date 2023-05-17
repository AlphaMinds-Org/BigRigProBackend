const multer = require("multer");
const { conn } = require("../config/db_config");
const fs = require("fs");


const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      const sql = "SELECT max(id_review) as max_id from review";
      conn.query(sql, (err, result) => {
        if (err) {
          console.log("Error getting max ID", err);
          cb(err);
        } else {
          const maxId = result[0].max_id || 0;
          const folderName = `images/review/${maxId + 1}`;
          fs.mkdirSync(folderName, { recursive: true });
          cb(null, folderName);
        }
      });
    },
  
    filename: function (req, file, cb) {
      cb(null, file.originalname);
    }
  });
  
  const uploadreview = multer({ storage }).single("file");
  
  module.exports = uploadreview;

  
