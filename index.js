const express = require("express");
const session = require("express-session");
const bodyParser = require("body-parser");
const fileForge = require('express-fileforge');
const path = require('path');
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

app.set("view engine", "ejs");
app.use(express.static("public"));

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json());

const routes = require("./routes");
app.use("/", routes);

/*
app.post("/posta-inlagg", async function (req, res) {
    try {
        const { text, val, "dela-foretag": delaForetag } = req.body;

        let uploadedFile = await fileForge.saveFile(req, path.join(__dirname, 'uploads'), 'uploadedFile.jpg');

        const postinlaggQuery = `INSERT INTO posts (UserID, Image, Info, Choice) VALUES ((SELECT UserID FROM users WHERE Username =?),?,?,?)`;

        connection.query(postinlaggQuery, [userID, uploadedFile, text, val, delaForetag], (error, results) => {
            if (error) {
                console.error("Error inserting post into database: ", error);
                res.status(500).send("Error inserting post.");
            } else {
                res.send("Post added successfully!");
            }
        });

        // Tbx till startsidan??
        res.redirect('/feed');
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal Server Error");
    }
}); */

const PORT = process.env.PORT || 5000;

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

app.get("/fetchComments", (req, res) => {
    const { fetchComments } = require("./public/js/feedHandler");
    fetchComments().then((data) => {
        res.send(data[0]);
    });
});

const addLike = async (id, username) => {
    const insertQuery = `INSERT INTO likes (PostID, UserID) SELECT ?, UserID FROM users WHERE Username = ?`;
    connection.query(insertQuery, [id, username], (error, results, fields) => {
        if (error) {
            console.error("Error inserting like into database" + error.stack);
        }
        console.log("Inserted like into database");
    });
};

const removeLike = async (id, username) => {
    const deleteQuery = `DELETE FROM likes WHERE PostID = ? AND UserID = (SELECT UserID FROM users WHERE Username = ?)`;
    connection.query(deleteQuery, [id, username], (error, results, fields) => {
        if (error) {
            console.error("Error deleting like from database" + error.stack);
        }
        console.log("Deleted like from database");
    });
};

const checkIfLiked = async (id, username) => {
    const checkQuery = `SELECT * FROM likes WHERE PostID = ? AND UserID = (SELECT UserID FROM users WHERE Username = ?)`;
    return new Promise((resolve, reject) => {
        connection.query(checkQuery, [id, username], (error, results, fields) => {
            if (error) {
                console.error("Error checking if liked" + error.stack);
                reject(error);
            }
            resolve(results.length > 0);
        });
    });
}

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

const countComments = async (posts) => {
    const { fetchComments } = require("./public/js/feedHandler")
    const length = await fetchComments();

    let arr = [] // return arr

    posts[0].forEach(post => {
        const postID = post.PostID
        let commentNr = 0;

        length[0].forEach(comment => {
            if (comment.PostID == postID) {
                commentNr++;
            }
        });

        arr.push({
            PostID: postID,
            count: commentNr
        })
    })

    return arr;
}

const countLikes = async (posts) => {
    const { fetchLikes } = require("./public/js/feedHandler")
    const length = await fetchLikes();

    let arr = [] // return arr

    posts[0].forEach(post => {
        const postID = post.PostID
        let likeNr = 0;

        length[0].forEach(like => {
            if (like.PostID == postID) {
                likeNr++;
            }
        });

        arr.push({
            PostID: postID, // 0
            count: likeNr // 1
        })
    })

    return arr;
}

const checkLiked = async (userID) => {
    const { fetchLikes } = require("./public/js/feedHandler")
    const length = await fetchLikes();

    let userLike = [];

    length[0].forEach(like => {
        if(like.UserID == userID){
            userLike.push({
                PostID: like.PostID,
                UserID: like.UserID
            })
        }  
    });

    return userLike;
}

const tempLoad = async (username) => {
    const { fetchUserInfo } = require("./public/js/feedHandler");
    const userData = await fetchUserInfo(username);

    const jsonData = JSON.stringify(userData[0]);
    try {
        await fs.writeFileSync("./public/temp/user.json", jsonData);   
    } catch (err) {
        console.error(err);
    }
}


// Flöde sidan
app.get("/feed", async (req, res) => {
    const { fetchPosts } = require("./public/js/feedHandler")
    const userInfo = require("./public/temp/user.json");
    const postData = await fetchPosts("campus");
    const arr = await countComments(postData);
    const likes = await countLikes(postData);

    let userR;
    userInfo.forEach(user => {
        userR = user
    })

    const userLikes = await checkLiked(userR.UserID);
    res.render("index", {
        data: postData,
        commentData: arr,
        likeData: likes,
        likesUser: userLikes,
        userData: userR
    });
});



// Vart användaren kommer efter att ha loggat in, vilket är flödesidan såklart!
app.post("/feed", async (req, res) => {
    const { username } = req.body
    tempLoad(username);

    const { fetchPosts } = require("./public/js/feedHandler");
    const userInfo = require("./public/temp/user.json");
    
    const postData = await fetchPosts("campus");
    const arr = await countComments(postData);
    const likes = await countLikes(postData);

    let userR;
    userInfo.forEach(user => {
        userR = user
    })
    
    const userLikes = await checkLiked(userR.UserID);
   
    res.render("index", {
        username,
        data: postData,
        commentData: arr,
        likeData: likes,
        likesUser: userLikes,
        userData: userR
    });
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT} - http://localhost:${PORT}`);
});