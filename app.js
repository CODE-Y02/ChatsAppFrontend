const express = require("express");

const path = require("path");

const dotenv = require("dotenv");

dotenv.config();

const app = express();

const cors = require("cors");

app.use(cors());

app.use(express.static(path.join(__dirname, "public")));

// login

app.get("/", async (req, res) => {
  try {
    res.sendFile(path.join(__dirname, "views", "signup.html"));
  } catch (error) {
    console.log(error);
  }
});

app.get("/login", async (req, res) => {
  try {
    res.sendFile(path.join(__dirname, "views", "login.html"));
  } catch (error) {
    console.log(error);
  }
});

// signup
app.get("/signup", (req, res) => {
  res.sendFile(path.join(__dirname, "views", "signup.html"));
});

// chats app
app.get("/chatApp", (req, res) => {
  res.sendFile(path.join(__dirname, "views", "chatApp.html"));
});

// admin panel
app.get("/admin", (req, res) => {
  res.sendFile(path.join(__dirname, "views", "admin.html"));
});

app.listen(process.env.PORT || 5000, () => {
  console.log(
    `\n\n front end running @ PORT ==> ${process.env.PORT || 5000} \n`
  );
});
