const likeIcons = document.querySelectorAll(".interaction-like");
likeIcons.forEach((likeIcon) => {
    likeIcon.addEventListener("click", (e) => {
        const id = e.currentTarget.closest(".post").id;
        like(id);
    });
});

const commentIcons = document.querySelectorAll(".interaction-comment");
commentIcons.forEach((commentIcon) => {
    commentIcon.addEventListener("click", (e) => {
        const id = e.currentTarget.closest(".post").id;
        comment(id);
        loadComments(id);
    });
});

const setCookie = (name, value, days) => {
    const expirationDate = new Date();
    expirationDate.setDate(expirationDate.getDate() + days);
    const cookieValue = `${name}=${value}; expires=${expirationDate.toUTCString()}; path=/`;
    document.cookie = cookieValue;
};
function loadComments(id) {
    fetch("/temp/data.json")
        .then((response) => {
            if (!response.ok) {
                throw new Error("Failed to load comments data");
            }
            return response.json();
        })
        .then((postData) => {
            const post = postData.post.find(
                (post) => post.PostID === parseInt(id)
            );

            const popupUserInfo = document.querySelector(".comment-section");
            post.comments.forEach((comment, index) => {
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

                createCommentUser.innerText = comment.Username;
                createCommentText.innerText = comment.Comment;
            });
        })
        .catch((error) => {
            console.error("Error loading comments data:", error);
        });
}

const comment = (id) => {
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
    document.cookie = `PostID=${id}; expires=Fri, 31 Dec 9999 23:59:59 GMT; path=/; domain=localhost`;

    const form = popup.querySelector(".popup-form");
    form.addEventListener("submit", (e) => {
        e.preventDefault(true);
        const comment = form.querySelector("input").value;
        if (comment !== "") {
            const username = "Alfred"; // FIXME: get username from login
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

const like = (id) => {
    const username = "Alfred"; // FIXME: get username from login

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
