const express = require("express");
const session = require("express-session");
const bodyParser = require("body-parser");
const multer = require("multer");

const postData = require("./public/temp/data.json");
const app = express();

// Avkommentera om du vill använda databasen
// const { connection, connectDB, closeDB } = require("./database");

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

//Posta det skapade inlägget till databasen
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "./uploads/");
    },
    filename: function (req, file, cb) {
        cb(null, new Date().toISOString() + file.originalname);
    },
});
const upload = multer({ storage: storage });

//Queryn kanske behöver ändras

app.post("/posta-inlagg", upload.single("bild"), (req, res) => {
    const { text, val, "dela-foretag": delaForetag } = req.body;

    const file = req.file ? req.file : null;

    const query = `INSERT INTO posts (PostID, UserID, Image, Info, Choice, CreatedAt) VALUES (?,?,?,?,?, CURRENT_TIMESTAMP)`;

    connection.query(
        query,
        [postId, userId, file.path, text, val, delaForetag],
        (error, results) => {
            if (error) {
                console.error("Error inserting post into database: ", error);
                res.status(500).send("Error inserting post.");
            } else {
                res.send("Post added successfully!");
            }
        }
    );
});

const PORT = process.env.PORT || 5000;

// Huvudsidan för att logga in
app.get("/", (req, res) => {
    res.render("login");
});

app.post("/comment", (req, res) => {
    const { id, username, comment } = req.body;
    console.log(id, username, comment);

    conn = connectDB(connection);

    // Insert comment into database
    // id = inläggets id
    // username = användarens namn
    // comment = kommentaren
    const commentQuery = ``;
    conn.query(
        commentQuery,
        [id, username, comment],
        (error, results, fields) => {
            if (error) {
                console.error(
                    "Error inserting comment into database" + error.stack
                );
            }
            console.log("Inserted comment into database");
        }
    );

    closeDB(conn);
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
