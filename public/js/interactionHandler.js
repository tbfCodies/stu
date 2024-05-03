const likeIcons = document.querySelectorAll(".interaction-like");
function getCookie(name) {
    const cookies = document.cookie.split('; ');
    for (let cookie of cookies) {
        const [cookieName, cookieValue] = cookie.split('=');
        if (cookieName === name) {
            const username = decodeURIComponent(cookieValue);
            // Remove the prefix "username" if it exists
            if (username.startsWith("username")) {
                return username.substring("username".length);
                // or
                // return username.slice("username".length);
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
        
        const pathID = e.currentTarget.closest(".interaction-like").childNodes[1].id;
        const path = e.currentTarget.closest(".interaction-like").childNodes[1];

        console.log(path)


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

        like(id,username);
    });
});

const commentIcons = document.querySelectorAll(".interaction-comment");
commentIcons.forEach((commentIcon) => {
    commentIcon.addEventListener("click", (e) => {
        const id = e.currentTarget.closest(".post").id;
        const username = getCookie("username");

        comment(id,username);
        loadComments(id);
    });
});

document.addEventListener("DOMContentLoaded", function() {
    const timestamps = document.querySelectorAll("[data-timestamp]");

    timestamps.forEach(timestamp => {
        const timestampValue = new Date(timestamp.dataset.timestamp);
        const currentTime = new Date();
        const timeDifference = currentTime - timestampValue;
        const hoursDifference = Math.floor(timeDifference / (1000 * 60 * 60));
        
        if (hoursDifference < 24) {
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
function loadComments(id) {
    fetch("/fetchComments")
        .then((response) => {
            if (!response.ok) {
                throw new Error("Failed to load comments data");
            }
            return response.json();
        })
        .then((postData) => {
            // Popup ID
            
            postData.forEach((post, index) => {
                if (post.PostID == id) {
                    const popupUserInfo = document.querySelector(".comment-section");

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
                    createCommentDate.innerText = post.CommentedAt;

                }   
            })
        })
        .catch((error) => {
            console.error("Error loading comments data:", error);
        });
}

const comment = (id,username) => {
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
        e.preventDefault(true);
        const comment = form.querySelector("input").value;
        if (comment !== "") {
            const postId = popup.dataset.postId; // Retrieve the PostID from the popup
            commentPost(postId, username, comment);

            // clear input
            form.querySelector("input").value = "";
            popup.style.display = "none";
            document.body.style.overflow = "auto";
        }
    });
};

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