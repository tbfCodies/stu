const express = require("express");
const bodyParser = require("body-parser");

const app = express();

app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.json());

const routes = require("./routes");
app.use("/", routes);

const PORT = process.env.PORT || 5000;

// Huvudsidan för att logga in
app.get("/", (req, res) => {
  res.render("login");
});

app.get("/view", (req, res) => {
  res.render("index");
});

// Vart användaren kommer efter att ha loggat in, vilket är flödesidan såklart!
app.post("/view", (req, res) => {
  const { username } = req.body;
  res.render("index", { username });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT} - http://localhost:${PORT}`);
});
