/* Array fylld med post data, kommer antagligen att få data ifrån databas eller något liknande senare
men just nu bara för att visa*/
export const posts = [
  {
    id: 1,
    userId: 1,
    username: "Alice",
    profilePicture: "assets/profile/profile-placeholder-one.jpg",
    image: "assets/posts/post-placeholder-one.jpg",
    info: "Alice's post description here...",
    createdAt: new Date("2024-04-20").toLocaleString(),
    likes: 5,
    comments: [
      {
        userId: 2,
        username: "Bob",
        text: "Great post, Alice!",
        commentedAt: new Date().toLocaleString(),
      },
      {
        userId: 1,
        username: "Alice",
        text: "Wow, Ben! That looks incredible! ",
        commentedAt: new Date().toLocaleString(),
      },
      {
        userId: 2,
        username: "Bob",
        text: "Great post, Alice!",
        commentedAt: new Date().toLocaleString(),
      },
      {
        userId: 1,
        username: "Alice",
        text: "Wow, Ben! That looks incredible! ",
        commentedAt: new Date().toLocaleString(),
      },
      {
        userId: 2,
        username: "Bob",
        text: "Great post, Alice!",
        commentedAt: new Date().toLocaleString(),
      },
      {
        userId: 1,
        username: "Alice",
        text: "Wow, Ben! That looks incredible! ",
        commentedAt: new Date().toLocaleString(),
      },
    ],
  },
  {
    id: 2,
    userId: 3,
    username: "Ben",
    profilePicture: "assets/profile/profile-placeholder-two.jpg",
    image: "assets/posts/post-placeholder-two.jpg",
    info: "Just witnessed the most amazing aurora borealis in Luleå!  #Sweden #NorthernLights",
    createdAt: new Date().toLocaleString(),
    likes: 12,
    comments: [
      {
        userId: 1,
        username: "Alice",
        text: "Wow, Ben! That looks incredible! ",
        commentedAt: new Date().toLocaleString(),
      },
      {
        userId: 4,
        username: "Charlie",
        text: "Adding this to my travel bucket list! ",
        commentedAt: new Date().toLocaleString(),
      },
    ],
  },
  {
    id: 3,
    userId: 2,
    username: "Bob",
    profilePicture: "assets/profile/profile-placeholder-three.jpg",
    image: "assets/posts/post-placeholder-three.jpg",
    info: "Looking for recommendations for the best fika spots in Luleå. Any suggestions? ☕️",
    createdAt: new Date().toLocaleString(),
    likes: 3,
    comments: [
      {
        userId: 1,
        username: "Alice",
        text: "Hey Bob, I love going to 'Fika by Maja'! They have delicious pastries ",
        commentedAt: new Date().toLocaleString(),
      },
    ],
  },
  {
    id: 4,
    userId: 4,
    username: "Charlie",
    profilePicture: "assets/profile/profile-placeholder-one.jpg",
    image: "assets/posts/post-placeholder-four.jpg",
    info: "What are your favorite things to do in Luleå? I'm here for the weekend and open to exploring! ",
    createdAt: new Date().toLocaleString(),
    likes: 0,
    comments: [], // No comments yet
  },
  {
    id: 5,
    userId: 5,
    username: "David",
    profilePicture: "assets/profile/profile-placeholder-two.jpg",
    image: "assets/posts/post-placeholder-one.jpg",
    info: '"The greatest glory in living lies not in never falling, but in rising every time we fall."',
    createdAt: new Date().toLocaleString(),
    likes: 7,
    comments: [], // No comments yet
  },
  {
    id: 6,
    userId: 1,
    profilePicture: "assets/profile/profile-placeholder-three.jpg",
    image: "assets/posts/post-placeholder-four.jpg",
    info: "Planning a picnic in Stadsparken this weekend. What kind of food should I bring? ",
    createdAt: new Date().toLocaleString(),
    likes: 2,
    comments: [],
  },
];

/* 
Bara en hjälp fuktion för att beräkna tiden sen ett inlägg eller kommentar skapades.
*/
function timeSince(date) {
  let seconds = Math.floor((new Date() - date) / 1000);
  let interval = seconds / 31536000;
  if (interval > 1) return Math.floor(interval) + " years";
  interval = seconds / 2592000;
  if (interval > 1) return Math.floor(interval) + " months";
  interval = seconds / 86400;
  if (interval > 1) return Math.floor(interval) + " days";
  interval = seconds / 3600;
  if (interval > 1) return Math.floor(interval) + " hours";
  interval = seconds / 60;
  if (interval > 1) return Math.floor(interval) + " minutes";
  return Math.floor(seconds) + " seconds";
}

/* Skapar dynamiskt alla inläggen
Lade även till att gilla ikonen ändras,
men kommer troligtvis behöva göra några ändringar.
*/
function displayPosts() {
  const postsContainer = document.querySelector(".posts");
  if (!postsContainer) return;

  posts.forEach((post, index) => {
    const postElement = document.createElement("div");
    postElement.classList.add("post");
    const createdAt = new Date(post.createdAt);

    // Beorende på om aktiva användaren har gillat inlägget eller inte,
    // kommer ikonen att se annorlunda ut

    const likeIcon = post.liked
      ? "assets/heart-filled.svg"
      : "assets/heart-empty.svg";
    const likedClass = post.liked ? "liked" : "";

    postElement.innerHTML = `
        <div class="post-left-column">
          <div class="user-info">
            <img class="profile-picture" src="${post.profilePicture}" alt="${
      post.username
    }">
            <h3 class="username">${post.username}</h3>
          </div>
          ${
            post.image
              ? `<div class="post-image-container"> <img class="post-image" src="${post.image}" alt="Post Image"> </div>`
              : ""
          }
          <div class="interactions">
            <div class="interactions-likes" data-like-id="${index}">
              <img src="${likeIcon}" alt="Likes" class="likes-icon ${likedClass}">
              <span class="likes-count">${post.likes}</span>
            </div>
            <div class="interactions-time">
              <span class="post-time">${timeSince(createdAt)} ago</span>
            </div>
          </div>
        </div>
        <div class="post-right-column">
          <div class="post-info"><p>${post.info}</p></div>
          <div class="comments-section">
            <div class="comments-preview">
              ${post.comments
                .map(
                  (comment) => `
                <div class="comment-content">
                  <strong>${comment.username}</strong>: ${comment.text}
                  <div class="comment-time">${timeSince(
                    new Date(comment.commentedAt)
                  )} ago</div>
                </div>
              `
                )
                .join("")}
            </div>
            <div class="comment-icon" data-comment-id="${index}">
              <img src="assets/message-circle.svg" alt="Comments" />
            </div>
          </div>
        </div>
      `;

    postsContainer.appendChild(postElement);
    
    // Lägger till evenListner på like ikonen och ändrar statusen
    const likeButton = postElement.querySelector(`[data-like-id="${index}"]`);
    likeButton.addEventListener("click", () => {
      post.liked = !post.liked;
    
      // ändrar nummret brevid gilla ikonen, kommer behöva ändra beroende på hur vi gör databasen
      const likeCountElement = likeButton.querySelector(".likes-count");
      if (post.liked) {
        post.likes++;
        likeCountElement.textContent = post.likes;
      } else {
        post.likes--;
        likeCountElement.textContent = post.likes;
      }

      // Byt bild mellan ett rött och tomt hjärta
      likeButton.querySelector(".likes-icon").src = post.liked
        ? "assets/heart-filled.svg"
        : "assets/heart-empty.svg";
      likeButton.classList.toggle("liked");
    });

    // om man håller musen över ikonen när man gillat den, så får man en annan bild.
    likeButton
      .querySelector(".likes-icon")
      .addEventListener("mouseover", () => {
        if (post.liked) {
          likeButton.querySelector(".likes-icon").src =
            "assets/heart-cross.svg";
        }
      });

      // Återställ bilden när musen flyttas
    likeButton.querySelector(".likes-icon").addEventListener("mouseout", () => {
      if (post.liked) {
        likeButton.querySelector(".likes-icon").src = "assets/heart-filled.svg";
      }
    });
  });
}

displayPosts();
