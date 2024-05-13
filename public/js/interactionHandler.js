const likeIcons = document.querySelectorAll(".interaction-like");
function getCookie(name) {
    const cookies = document.cookie.split("; ");
    for (let cookie of cookies) {
        const [cookieName, cookieValue] = cookie.split("=");
        if (cookieName === name) {
            const username = decodeURIComponent(cookieValue);
            // Remove the prefix "username" if it exists
            if (username.startsWith("username")) {
                return username.substring("username".length);
            }
            return username;
        }
    }
    return null;
}

likeIcons.forEach((likeIcon) => {
    likeIcon.addEventListener("click", (e) => {
        const id = e.currentTarget.closest(".post").id;
        const username = getCookie("username");

        const pathID =
            e.currentTarget.closest(".interaction-like").childNodes[1].id;
        const path = e.currentTarget.closest(".interaction-like").childNodes[1];

        // Change the heart icon based on the current state
        if (pathID == "liked") {
            path.style.backgroundImage = "url('/assets/heart-empty.svg')";
            path.style.backgroundSize = "cover";
            path.id = "unliked";
        }
        if (pathID == "unliked") {
            path.style.backgroundImage = "url('/assets/heart-filled.svg')";
            path.style.backgroundSize = "cover";
            path.id = "liked";
        }

        // Change the window location to refresh the page
        window.location.href = `/feed`;

        // Call the like function
        like(id, username);
    });
});

const commentIcons = document.querySelectorAll(".interaction-comment");
commentIcons.forEach((commentIcon) => {
    commentIcon.addEventListener("click", (e) => {
        const id = e.currentTarget.closest(".post").id;
        const username = getCookie("username");

        comment(id, username);
        loadComments(id);
    });
});

document.addEventListener("DOMContentLoaded", function () {
        const timestamps = document.querySelectorAll("[data-timestamp]");
    timestamps.forEach((timestamp) => {
        const timestampValue = new Date(timestamp.dataset.timestamp);
        const currentTime = new Date()
        const currentUTCTime = currentTime.getTime();
        const swedishTimezoneOffset = 120; // CET is UTC+1
        const swedishTime = new Date(currentUTCTime + (swedishTimezoneOffset * 60000));
        
        const timeDifference = swedishTime - timestampValue;
        const minutesDifference = Math.floor(timeDifference / (1000 * 60));
        const hoursDifference = Math.floor(timeDifference / (1000 * 60 * 60));

        if (minutesDifference < 60) {
            timestamp.textContent = minutesDifference + " minutes ago";
            timestamp.classList.add("minutes-ago");
        } else if (hoursDifference < 24) {
            timestamp.textContent = hoursDifference + " hours ago";
            timestamp.classList.add("hours-ago");
        } else {
            const daysDifference = Math.floor(hoursDifference / 24);
            timestamp.textContent = daysDifference + " days ago";
            timestamp.classList.add("days-ago");
        }
    });
});

const setCookie = (name, value, days) => {
    const expirationDate = new Date();
    expirationDate.setDate(expirationDate.getDate() + days);
    const cookieValue = `${name}=${value}; expires=${expirationDate.toUTCString()}; path=/`;
    document.cookie = cookieValue;
};

function formatDate(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    
    const currentUTCTime = now.getTime();
    const swedishTimezoneOffset = 120; // CET is UTC+1
    const swedishTime = new Date(currentUTCTime + (swedishTimezoneOffset * 60000));
    
    const diffInMs = swedishTime - date;

    let timeReturn;
    const minutes = Math.floor(diffInMs / (1000 * 60));
    if (minutes > 60) {
        const hours = Math.floor(minutes / 60);

        if (hours > 24) {
            const days = Math.floor(hours / 24);
            timeReturn = `${days} days ago`;
            return timeReturn;
        }

        timeReturn = `${hours} hours ago`;
        return timeReturn;
    }

    timeReturn = `${minutes} minutes ago`;
    return timeReturn;
}
/*
    @param {string} id

    @description Fetches comments from the database
*/
function loadComments(id) {
    fetch("/fetchComments")
        .then((response) => {
            if (!response.ok) {
                throw new Error("Failed to load comments data");
            }
            return response.json();
        })
        .then((postData) => {
            // Loop through the comments and display them
            postData.forEach((post, index) => {
                if (post.PostID == id) {
                    const popupDate = formatDate(post.CommentedAt);

                    const popupUserInfo =
                        document.querySelector(".comment-section");

                    const createComment = document.createElement("div");
                    createComment.classList.add(`comment`);
                    createComment.id = `${index}`;
                    popupUserInfo.appendChild(createComment);

                    const createCommentUser = document.createElement("p");
                    createCommentUser.classList.add(`username`);
                    createComment.appendChild(createCommentUser);

                    const createCommentText = document.createElement("p");
                    createCommentText.classList.add(`comment`);
                    createComment.appendChild(createCommentText);

                    const createCommentDate = document.createElement("p");
                    createCommentDate.classList.add(`date`);
                    createComment.appendChild(createCommentDate);

                    // set
                    createCommentUser.innerText = post.Username;
                    createCommentText.innerText = post.Comment;
                    createCommentDate.innerText = popupDate;
                }
            });
        })
        .catch((error) => {
            console.error("Error loading comments data:", error);
        });
}

/*
    @param {string} id
    @param {string} username

    @description Opens a popup to comment on a post
*/
const comment = (id, username) => {
    // popup meny
    const popup = document.querySelector(".popup-menu");
    popup.style.display = "block";
    document.body.style.overflow = "hidden";

    // clear previous comments
    const popupUserInfo = document.querySelector(".comment-section");
    popupUserInfo.innerHTML = "";

    // close button
    const closeButton = document.querySelector(".close-popup");
    closeButton.addEventListener("click", () => {
        popup.style.display = "none";
        document.body.style.overflow = "auto";
    });

    // Set the PostID in the popup for reference
    popup.dataset.postId = id;

    //setCookie("PostID", id, 1);

    const form = popup.querySelector(".popup-form");
    form.addEventListener("submit", (e) => {
        e.preventDefault(true); // Prevent the form from submitting
        const comment = form.querySelector("input").value; // Retrieve the comment from the input field
        if (comment !== "") {
            // Ensure the comment is not empty
            const postId = popup.dataset.postId; // Retrieve the PostID from the popup
            commentPost(postId, username, comment);

            // clear input
            form.querySelector("input").value = "";
            popup.style.display = "none";
            document.body.style.overflow = "auto";

            // Change the window location to refresh the page
            window.location.href = `/feed`;
        }
    });
};

/*
    @param {string} id
    @param {string} username
    @param {string} comment

    @description Sends a POST request to comment on a post
*/
const commentPost = (id, username, comment) => {
    fetch("/comment", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ id, username, comment }),
    })
        .then((response) => {
            if (!response.ok) {
                throw new Error("Failed to comment the post");
            }
            console.log("Post commented successfully");
        })
        .catch((error) => {
            console.error("Error commenting the post:", error);
        });
};

/*
    @param {string} id
    @param {string} username

    @description Sends a POST request to like a post
*/
const like = (id, username) => {
    fetch("/like", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ id, username }),
    })
        .then((response) => {
            if (!response.ok) {
                throw new Error("Failed to like the post");
            }
            console.log("Post liked successfully");
        })
        .catch((error) => {
            console.error("Error liking the post:", error);
        });
};
