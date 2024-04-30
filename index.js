const express = require("express");
const session = require("express-session");
const bodyParser = require("body-parser");

const postData = require("./public/temp/data.json");
const app = express();

app.use(
    session({
        secret: "stu",
        resave: false,
        saveUninitialized: true,
    })
);

app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.json());

const routes = require("./routes");
app.use("/", routes);

const PORT = process.env.PORT || 5000;

//const { connection, connectDB, closeDB } = require("./database");

// Huvudsidan för att logga in
app.get("/", (req, res) => {
    res.render("login");
});

app.post("/comment", (req, res) => {
    const { id, username, comment } = req.body;
    console.log(id, username, comment);

    // query to insert comment
    // id = inlägg id
    // username = användare som kommenterar
    // comment = kommentar
});

app.post("/like", (req, res) => {
    const { id, username } = req.body;

    conn = connectDB(connection);

    // Insert like into database
    const insertQuery = `INSERT INTO likes (PostID, UserID) SELECT ?, UserID FROM users WHERE Username = ?`;
    conn.query(insertQuery, [id, username], (error, results, fields) => {
        if (error) {
            console.error("Error inserting like into database" + error.stack);
        }
        console.log("Inserted like into database");
    });

    closeDB(conn);
});

// Flöde sidan
app.get("/feed", (req, res) => {
    res.render("index", {
        data: postData,
    });
});

// Vart användaren kommer efter att ha loggat in, vilket är flödesidan såklart!
app.post("/feed", (req, res) => {
    const { username } = req.body;
    res.render("index", {
        username,
        data: postData,
    });
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT} - http://localhost:${PORT}`);
});
