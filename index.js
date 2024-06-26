const express = require("express");
const session = require("express-session");
const bodyParser = require("body-parser");
const fileUpload = require("express-fileupload");
const path = require("path");
const fs = require("fs");

// const postData = require("./public/temp/data.json");
const app = express();

// Avkommentera om du vill använda databasen
const { connection, connectDB } = require("./database");
connectDB(connection); // Connect to the database
app.use(
    session({
        secret: "stu",
        resave: false,
        saveUninitialized: true,
    })
);

// Specify the view engine
app.set("view engine", "ejs");
app.use(express.static("public"));

// Middleware to parse the request body
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Routes
const routes = require("./routes");
app.use("/", routes);

// Middleware to parse file uploads
app.use(fileUpload());

// PORT
const PORT = process.env.PORT || 5000;

// Route för att hämta users profilbild
app.get("/profile", async (req, res) => {
    try {
        const userID = req.session.userID;
        const profileQuery = `SELECT ProfilePicture FROM users WHERE userID = ?`;
        connection.query(profileQuery, [userID], (error, results) => {
            if (error) {
                console.error(
                    "Error fetching profile picture from database:",
                    error
                );
                res.status(500).send("Error fetching profile picture.");
                return;
            }
            if (results.length > 0) {
                const profilePicture = results[0].ProfilePicture;
                res.render("profile", { profilePicture });
            } else {
                res.status(404).send("User not found.");
            }
        });
    } catch (error) {
        console.error("Error fetching profile picture:", error);
        res.status(500).send("Internal Server Error");
    }
});

// Route för att skapa ett nytt inlägg
app.post("/posta-inlagg", async function (req, res) {
    try {
        // Hämta text och val från request body
        const { text, val } = req.body;

        // Hämta användarens information från sessionen
        const userInfo = require("./public/temp/user.json");
        let userR;
        userInfo.forEach((user) => {
            userR = user;
        });

        // Sätt bildens sökväg till null som standard
        let builderPath = null;

        // Kontrollera om bild laddades upp
        if (req.files && req.files.bild) {
            // Spara den uppladdade bilden i uploads
            const uploadedFile = req.files.bild;
            const targetPath = path.join(
                __dirname,
                "public",
                "uploads",
                uploadedFile.name
            );
            builderPath = `../uploads/${uploadedFile.name}`;

            uploadedFile.mv(targetPath, (err) => {
                if (err) {
                    console.error("Fel vid uppladdning av filen: ", err);
                    res.status(500).send("Error uploading file.");
                    return;
                }
            });
        }

        // Insert till databas
        const postinlaggQuery = `INSERT INTO posts (UserID, Image, Info, Choice) VALUES (?,?,?,?)`;
        connection.query(
            postinlaggQuery,
            [userR.UserID, builderPath, text, val],
            (error, results) => {
                if (error) {
                    console.error(
                        "Error inserting post into database: ",
                        error
                    );
                    res.status(500).send("Error inserting post.");
                    return;
                }
                // Lyckad insättning av inlägg
                // Omdirigera användaren tillbaka till flödessidan efter att posten har lagts till i databasen
                res.redirect("/feed");
            }
        );
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal Server Error");
    }
});

// Huvudsidan för att logga in
app.get("/", (req, res) => {
    res.render("login");
});

app.post("/comment", (req, res) => {
    const { id, username, comment } = req.body;
    console.log(id, username, comment);

    // Insert comment into database
    // id = inläggets id
    // username = användarens namn
    // comment = kommentaren
    const commentQuery = `INSERT INTO comments (PostID, UserID, Comment) VALUES (?,  (SELECT UserID FROM users WHERE Username = ?), ?)`;
    connection.query(
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
});

// Hämta kommentarer och skicka tillbaka till klienten som JSON
app.get("/fetchComments", (req, res) => {
    const { fetchComments } = require("./public/js/feedHandler");
    fetchComments().then((data) => {
        res.send(data[0]);
    });
});

// Lägger till en gilla-markering i databasen för ett inlägg med ett visst userID
const addLike = async (id, username) => {
    const insertQuery = `INSERT INTO likes (PostID, UserID) SELECT ?, UserID FROM users WHERE Username = ?`;
    connection.query(insertQuery, [id, username], (error, results, fields) => {
        if (error) {
            console.error("Error inserting like into database" + error.stack);
        }
        console.log("Inserted like into database");
    });
};

// Tar bort en gilla-markering i databasen för ett inlägg med ett visst userID
const removeLike = async (id, username) => {
    const deleteQuery = `DELETE FROM likes WHERE PostID = ? AND UserID = (SELECT UserID FROM users WHERE Username = ?)`;
    connection.query(deleteQuery, [id, username], (error, results, fields) => {
        if (error) {
            console.error("Error deleting like from database" + error.stack);
        }
        console.log("Deleted like from database");
    });
};

// Kontrollerar om användaren redan har gillat inlägget
const checkIfLiked = async (id, username) => {
    const checkQuery = `SELECT * FROM likes WHERE PostID = ? AND UserID = (SELECT UserID FROM users WHERE Username = ?)`;
    return new Promise((resolve, reject) => {
        connection.query(
            checkQuery,
            [id, username],
            (error, results, fields) => {
                if (error) {
                    console.error("Error checking if liked" + error.stack);
                    reject(error);
                }
                resolve(results.length > 0);
            }
        );
    });
};

// Lägger till eller tar bort en gilla-markering för ett inlägg
app.post("/like", async (req, res) => {
    const { id, username } = req.body;
    try {
        const liked = await checkIfLiked(id, username);
        if (liked) {
            await removeLike(id, username);
        } else {
            await addLike(id, username);
        }
    } catch (error) {
        console.error("Error liking post: " + error.stack);
    }
});

// Hämtar alla inlägg från databasen
const countComments = async (posts) => {
    const { fetchComments } = require("./public/js/feedHandler");
    const length = await fetchComments(); // Hämtar alla kommentarer

    let arr = []; // return arr

    // Loopar igenom alla inlägg och räknar antalet kommentarer
    posts[0].forEach((post) => {
        const postID = post.PostID;
        let commentNr = 0;

        // Loopar igenom alla kommentarer och räknar antalet kommentarer för varje inlägg
        length[0].forEach((comment) => {
            // Om kommentarens PostID är samma som inläggets PostID
            if (comment.PostID == postID) {
                commentNr++;
            }
        });

        // Pushar inläggets PostID och antalet kommentarer till arr
        arr.push({
            PostID: postID,
            count: commentNr,
        });
    });

    // Returnerar arr
    return arr;
};

// Räknar antalet gilla-markeringar för varje inlägg
const countLikes = async (posts) => {
    const { fetchLikes } = require("./public/js/feedHandler");
    const length = await fetchLikes();

    let arr = []; // return arr

    // Loopar igenom alla inlägg och räknar antalet gilla-markeringar
    posts[0].forEach((post) => {
        const postID = post.PostID;
        let likeNr = 0;

        // Loopar igenom alla gilla-markeringar och räknar antalet gilla-markeringar för varje inlägg
        length[0].forEach((like) => {
            // Om gilla-markeringens PostID är samma som inläggets PostID
            if (like.PostID == postID) {
                likeNr++;
            }
        });

        // Pushar inläggets PostID och antalet gilla-markeringar till arr
        arr.push({
            PostID: postID, // 0
            count: likeNr, // 1
        });
    });

    // Returnerar arr
    return arr;
};

// Kontrollerar om användaren har gillat inlägget
const checkLiked = async (userID) => {
    const { fetchLikes } = require("./public/js/feedHandler");
    const length = await fetchLikes();

    let userLike = [];

    // Loopar igenom alla gilla-markeringar och kollar om användaren har gillat inlägget
    length[0].forEach((like) => {
        // Om gilla-markeringens UserID är samma som användarens UserID
        if (like.UserID == userID) {
            userLike.push({
                PostID: like.PostID,
                UserID: like.UserID,
            });
        }
    });

    // Returnerar userLike
    return userLike;
};

// Skapar en temporär JSON-fil för att ladda användarens information
const tempLoad = async (username) => {
    const { fetchUserInfo } = require("./public/js/feedHandler");
    const userData = await fetchUserInfo(username);

    // Skapar en temporär JSON-fil för att ladda användarens information
    const jsonData = JSON.stringify(userData[0]);
    try {
        // Skriver användarens information till en temporär JSON-fil
        await fs.writeFileSync("./public/temp/user.json", jsonData);
    } catch (err) {
        console.error(err);
    }
};

// Hämtar alla gilla-markeringar för varje inlägg
const popupData = async () => {
    const { fetchPostLikes } = require("./public/js/feedHandler");
    const postsFetch = await fetchPostLikes();

    // Create an object to store PostID arrays
    let postIDMap = {};

    // Iterate over each post and populate the postIDMap
    postsFetch[0].forEach((post) => {
        // If PostID doesn't exist in postIDMap, initialize it as an empty array
        if (!postIDMap[post.PostID]) {
            postIDMap[post.PostID] = [];
        }
        // Push the username into the array associated with the PostID
        postIDMap[post.PostID].push(post.Username);
    });

    // Convert postIDMap into an array of objects
    let result = Object.entries(postIDMap).map(([PostID, usernames]) => ({
        PostID: parseInt(PostID), // Convert PostID from string to integer
        Usernames: usernames,
    }));

    return result;
};

// Route för att kunna lätt filtera flödet - standard är campus
app.get("/feed/:id", async (req, res) => {
    const { id } = req.params;

    let val;
    if (id == null) {
        val = "campus";
    } else {
        val = id;
    }

    res.redirect(`/feed?val=${val}`);
});

// Skapa nytt inlägg sida
app.get("/createpost", async (req, res) => {
    const userInfo = require("./public/temp/user.json");

    // Hämta användarens information från sessionen
    let userR;
    userInfo.forEach((user) => {
        userR = user;
    });

    // Rendera sidan för att skapa nytt inlägg
    res.render("skapainlagg", {
        userData: userR,
        profilePicture: userR.ProfilePicture,
    });
});

// Flöde sidan
app.get("/feed", async (req, res) => {
    let choice;
    const val = req.query.val;
    if (val == null) {
        choice = "campus";
    } else {
        choice = val.toLowerCase();
    }

    // Imports
    const { fetchPosts } = require("./public/js/feedHandler");
    const userInfo = require("./public/temp/user.json");
    const postData = await fetchPosts(choice); // campus, vanner, kontakt
    const arr = await countComments(postData);
    const likes = await countLikes(postData);
    const dataPopup = await popupData();

    // Hämta användarens information från sessionen
    let userR;
    userInfo.forEach((user) => {
        userR = user;
    });

    // Kontrollera om användaren har gillat inlägget
    const userLikes = await checkLiked(userR.UserID);
    res.render("index", {
        data: postData,
        commentData: arr,
        likeData: likes,
        likesUser: userLikes,
        userData: userR,
        popupLikes: dataPopup,
        profilePicture: userR.ProfilePicture,
    });
});

// Vart användaren kommer efter att ha loggat in, vilket är flödesidan såklart!
app.post("/feed", async (req, res) => {
    const { username } = req.body;
    tempLoad(username);

    // Imports
    const { fetchPosts } = require("./public/js/feedHandler");
    const userInfo = require("./public/temp/user.json");
    const postData = await fetchPosts("campus");
    const arr = await countComments(postData);
    const likes = await countLikes(postData);
    const dataPopup = await popupData();

    let userR;
    userInfo.forEach((user) => {
        userR = user;
    });

    const userLikes = await checkLiked(userR.UserID);

    res.render("index", {
        username,
        data: postData,
        commentData: arr,
        likeData: likes,
        likesUser: userLikes,
        userData: userR,
        popupLikes: dataPopup,
        profilePicture: userR.ProfilePicture,
    });
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT} - http://localhost:${PORT}`);
});
