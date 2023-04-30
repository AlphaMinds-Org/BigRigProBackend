require("dotenv").config();
const http = require("http");
const express = require("express");
const { conn } = require("./config/db_config");
const OfferRoutes  = require("./routes/routes");

conn.connect(function (err) {
  if (err) throw err;
  console.log("Connected!");
});

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*")
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, authorization , Content-Type, Accept"
  );
  next();
});

app.use(express.static('public'));
app.use(OfferRoutes.routes); // use the routes function from OfferRoutes

app.set('view engine', 'ejs');

const PORT = process.env.NODE_ENV === 'production' ? (process.env.PORT || 80) : 4000;
app.listen(PORT, () => {
  console.log(`Server is running on ${PORT}`);
});
