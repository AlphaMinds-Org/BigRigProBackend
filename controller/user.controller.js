const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const express = require("express");
const { conn } = require("../config/db_config");


exports.signup = async (req, res) => {
    const email = req.body.email;
    const password = req.body.password;
    // const firstName = req.body.firstName;
    // const lastName = req.body.lastName;
    // const contactNo = req.body.phoneNumber;
    // const gift = req.body.Membership;
    // const promoCode = req.body.promoCode;
    // const refferalCode = req.body.refferalCode;
    // const startDate = new Date();
  
    const sql = "SELECT * FROM user WHERE email = ?";
    conn.query(sql, [email], (err, result) => {
      if (err) {
        console.log("error", err);
        return res.status(200).send({
          msg: err,
        });
      }
      if (result.length > 0) {
        console.log("email already exist");
        return res.status(200).send({
          msg: "email already exists",
        });
      } else {
        //hash password
        bcrypt.hash(password, 10).then((hash) => {
          const sql =
            "INSERT INTO user (email , password) VALUES (?,?)";
          // const data = ;
          conn.query(
            sql,
            [
              email,
              hash,
            ],
            (err, result) => {
              if (err) {
                // console.log("error one",err);
                // console.log("query error",err.sqlMessage);
                return res.status(400).send({
                  msg: err,
                });
              }
              console.log("one result", result);
              return res.status(200).send({
                msg: "You Registered Successfully",
              });
            }
          );
        });
      }
    });
  };

exports.login = async (req, res) => {
    const { email, password } = req.body;
  
    if (req.body.email.trim() === "" || req.body.password.trim() === "") {
      return res.status(400).send({ msg: "email or password must not be empty" });
    }
  
    conn.query("SELECT * FROM user WHERE email=?", email, (err, result) => {
      if (err) {
        return res.status(400).send({
          msg: err,
        });
      }
  
      //check whether the user with that email exists or not
      if (result.length === 0) {
        return res.status(400).json({
          success: true,
          message: "Invalid Password",
          data: {},
          token: null,
        });
      }
  
      //check password
  
      bcrypt.compare(password, result[0].password).then((isMatch) => {
        if (!isMatch) {
          return res.status(400).json({
            success: true,
            message: "Invalid Password",
            data: {},
            token: null,
          });
        }
        const token = jwt.sign(
          { id: result[0].id},
          process.env.SECRET_KEY
        );
        const id = result[0].id;
        //sendVerificationEmail(email, token, id);
      
       //generate token
       return res.status(200).send({
        msg: "logged in successfully",
        user: { id: result[0].id, email: email },
        token,
      });
      });
      
    });
  };