const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const express = require("express");
const { conn } = require("../config/db_config");
const multer = require("multer");
const path = require("path");



exports.clientCreate = async (req, res) => {
    const email = req.body.email;
    console.log(email);
    if (!email || !address || !contact || !firstname || !lastname) {
      return res.status(400).json({
        
        message: "All fields are required",
      });
    }
  
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth() + 1;
    const day = today.getDate();
    const todayDate = `${year}-${month}-${day}`;
  
    const storage = multer.diskStorage({
      destination: "./uploads",
      filename: function (req, file, cb) {
        cb(
          null,
          file.fieldname + "-" + Date.now() + path.extname(file.originalname)
        );
      },
    });
  
    const upload = multer({ storage: storage }).single("file");
  
    upload(req, res, (err) => {
        if (err) {
          console.error(err);
          return res.status(500).json({
            message: "Error uploading file",
          });
        }
    
        // Check if file was uploaded successfully
        if (!req.file) {
          console.error("File not found in request");
          return res.status(400).json({
            message: "File not found in request",
          });
        }
    

  
      const file = req.file.filename;
  
      const sql =
        "INSERT INTO client (firstname, lastname, address, contact, email, date, file) VALUES (?,?,?,?,?,?,?)";
  
      conn.query(
        sql,
        [firstname, lastname, address, contact, email, todayDate, file],
        (err, result) => {
          if (err) {
            console.error(err);
            return res.status(500).json({
              message: "Error inserting into database",
              error: err,
            });
          }
          console.log("one result", result);
          return res.status(200).json({
            message: "You Registered Successfully",
          });
        }
      );
    });
  };
  