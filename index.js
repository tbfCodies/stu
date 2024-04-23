const express = require("express");
const bodyParser = require("body-parser");

const app = express();

app.set("view engine", "ejs");
app.use(express.static("public"));

app.use(bodyParser.json());
const PORT = process.env.PORT || 5000;

// Huvudsidan för att logga in
app.get("/", (req, res) => {
  res.render("login");
});

// Vart användaren kommer efter att ha loggat in, vilket är flödesidan såklart!
app.post("/login", (req, res) => {
  const { username } = req.body;
  res.render("index", { username });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT} - http://localhost:${PORT}`);
});
