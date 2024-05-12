const express = require("express");
const { connection, connectDB } = require("../../database");

/*
    @param {string} username
    @returns {Promise}

    @description Fetches user information from the database
*/
const fetchUserInfo = async (username) => {
    try {
        const userQuery = `SELECT * FROM users WHERE Username = ?`;
        const results = await connection.promise().query(userQuery, [username]);
        return results;
    } catch (error) {
        console.error("Error selecting from database" + error.stack);
        throw error; // Rethrow the error or handle it accordingly
    }
};

/*
    @param {string} choice
    @returns {Promise}

    @description Fetches posts from the database
*/
const choiceSelect = (selection) => {
    let campusQuery;
    if (selection == "campus") {
        campusQuery = `SELECT * FROM posts JOIN users ON posts.UserID=users.UserID ORDER BY CreatedAt DESC`;
        return campusQuery;
    }
    campusQuery = `SELECT * FROM posts JOIN users ON posts.UserID=users.UserID WHERE posts.Choice=? ORDER BY CreatedAt DESC`;
    return campusQuery;
};

/*
    @param {string} choice
    @returns {Promise}

    @description Fetches posts from the database
*/
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

/*
    @param {string} postID
    @returns {Promise}

    @description Fetches comments from the database
*/
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

/*
    @param {string} postID
    @returns {Promise}

    @description Fetches likes from the database
*/
const fetchLikes = async (postID) => {
    try {
        let likeQuery = "";
        if (!postID) {
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

/*
    @param {string} postID
    @returns {Promise}

    @description Fetches likes from the database
*/
const fetchPostLikes = async () => {
    try {
        let likeQuery = `SELECT * FROM likes JOIN users ON likes.UserID=users.UserID`;
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
    fetchLikes,
    fetchPostLikes,
};
