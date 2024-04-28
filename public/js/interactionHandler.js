const commentIcon = document.querySelector(".comment-icon");
commentIcon.addEventListener("click", (event) => {
    const parentWithDataId = event.currentTarget.closest("[data-comment-id]");
    if (parentWithDataId) {
        const id = parentWithDataId.getAttribute("data-comment-id");
        comment(id);
    }
});

/*
  @description: Fetches the post with the given id and adds the comment to the post
  @param: id - the id of the post
  @param: user - the user who is commenting
  @param: comment - the comment to be added to the post
  @return: the updated post
  @run: location.reload();
*/
const comment = (id) => {
    console.log(id);
    const commentId = document.querySelector(`[data-comment-id="${id}"]`);
    console.log(commentId);
};

/*
    @description: Fetches the post with the given id and adds the like to the post
    @param: id - the id of the post
    @param: user - the user who is liking the post
    @return: the updated post
    @run: location.reload();
*/
const like = (id, user) => {
    return;
};
