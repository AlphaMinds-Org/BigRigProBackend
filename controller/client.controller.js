const { conn } = require("../config/db_config");
const fs = require("fs-extra");

exports.clientDelete = (req, res) => {
  const { id } = req.params;
  
  // First, retrieve the client's file path from the database
  conn.query("SELECT file FROM client WHERE client_id = ?", [id], (err, result) => {
    if (err) {
      console.log(err);
      res.status(500).send("Error deleting client");
      return;
    }
    
    const filePath = `public/upload/${id}/${result[0].file}`;
    
    // Delete the client record from the database
    conn.query("DELETE FROM client WHERE client_id = ?", [id], (err, result) => {
      if (err) {
        console.log(err);
        res.status(500).send("Error deleting client");
        return;
      }
      
      // Delete the client's image directory and all of its contents
      fs.remove(`public/upload/${id}`, (err) => {
        if (err) {
          console.log(err);
          res.status(500).send("Error deleting client image directory");
          return;
        }
        
        res.send("Client deleted successfully");
      });
    });
  });
};


exports.clientIndex = (req, res) => {
  q = "SELECT * FROM client";
  conn.query(q, (err, result) => {
    if (err) {
      console.log(err);
    } else {
      if (result && result.length) {
        res.send(result);
      } else {
        res.send(result);
      }
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
        res.send("Offer created Successfully");
      }
    }
  );
};
