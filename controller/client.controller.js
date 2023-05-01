const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const express = require("express");
const { conn } = require("../config/db_config");
const multer = require("multer");
const path = require("path");



exports.clientCreate = async (req, res) => {
    const email = req.body.email;
    const lastname = req.body.lastname;
    const address = req.body.address;
    const contact = req.body.contact;
    const firstname = req.body.firstname;
    console.log(email);
  
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth() + 1;
    const day = today.getDate();
    const todayDate = `${year}-${month}-${day}`;
  
    try {
      const maxID = await new Promise((resolve, reject) => {
        const sql = "SELECT max(client_id) as max_id from client";
        conn.query(sql, (err, result) => {
          if (err) {
            console.log("Error getting max ID", err);
            reject(err);
          } else {
            console.log("Max ID:", result[0].max_id);
            resolve(result[0].max_id);
          }
        });
      });
  
      const storage = multer.diskStorage({
        destination: "./uploads/" + maxID,
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
        console.log(file);
  
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
    } catch (err) {
      return res.status(500).json({
        message: "Error getting max ID",
        error: err,
      });
    }
  };
  