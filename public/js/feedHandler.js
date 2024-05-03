const express = require('express');
const { connection, connectDB } = require("../../database");

// 0. when the page is loaded for the first time, load 10-15 posts
// 1. 10-15 posts, then load the page and location.reload()
// 2. liked or commented, update the page location.reload()
// 3. if commented, update the page instantly - so the comment shows within the popup-menu

// username { username }

const fetchUserInfo = async (username) => {
    try {
        const userQuery = `SELECT * FROM users WHERE Username = ?`;
        const results = await connection.promise().query(userQuery, [username]);  
        return results;
    } catch (error) {
        console.error("Error selecting from database" + error.stack);
        throw error; // Rethrow the error or handle it accordingly
    }
}

const choiceSelect = (selection) => {
    let campusQuery;
    if (selection == "campus") {
        campusQuery = `SELECT * FROM posts JOIN users WHERE posts.UserID=users.UserID ORDER BY CreatedAt DESC`;
        return campusQuery;
    }
    campusQuery = `SELECT * FROM posts JOIN users WHERE posts.UserID=users.UserID,posts.Choice=? ORDER BY CreatedAt DESC`;
    return campusQuery;
};

const fetchPosts = async (choice) => {
    try {
        const campusQuery = choiceSelect(choice);
        const results = await connection.promise().query(campusQuery, [choice]);
        // console.log("Fetched posts", results);
        return results;
    } catch (error) {
        console.error("Error selecting from database" + error.stack);
        throw error; // Rethrow the error or handle it accordingly
    }
};

const fetchComments = async (postID) => {
    try {
        const commentQuery = `SELECT * FROM comments JOIN users WHERE comments.UserID=users.UserID`;
        const results = await connection.promise().query(commentQuery);
        return results;
    } catch (error) {
        console.error("Error selecting from database" + error.stack);
        throw error; // Rethrow the error or handle it accordingly
    }
};

const fetchLikes = async (postID) => {
    try {
        let likeQuery = "";
        if(!postID){
            likeQuery = `SELECT * FROM likes JOIN posts WHERE likes.PostID=posts.PostID`;
        }
        likeQuery = `SELECT * FROM likes`;
        const results = await connection.promise().query(likeQuery);
        return results;
    } catch (error) {
        console.error("Error selecting from database" + error.stack);
        throw error; // Rethrow the error or handle it accordingly
    }
};

module.exports = {
    fetchUserInfo,
    fetchPosts,
    fetchComments,
    fetchLikes
};