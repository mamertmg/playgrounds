// REVIEW SECTION

// fetch all buttons opening the review edit form
const editReviewBtns = document.querySelectorAll('.editReviewBtn');
for (let btn of editReviewBtns) {
    const idx = Number(btn.getAttribute('id').split('-')[1]);

    const reviewDisplay = document.querySelector(`#review-${idx}`);
    const reviewEditDisplay = document.querySelector(`#revEdit-${idx}`);

    btn.addEventListener('click', () => {
        reviewDisplay.hidden = true;
        reviewEditDisplay.hidden = false;
    });

    // Cancel button in review edit form
    document
        .querySelector(`#cancelRevEdit-${idx}`)
        .addEventListener('click', (event) => {
            event.preventDefault();
            reviewDisplay.hidden = false;
            reviewEditDisplay.hidden = true;
        });
}

// set up event listeners for like buttons
const likeReviewBtns = document.querySelectorAll('.reviewLikeBtn');
for (let btn of likeReviewBtns) {
    btn.addEventListener('click', async (event) => {
        const label = event.target.nextElementSibling;
        let reqPath = `http://localhost:3000/reviews/${event.target.getAttribute('data-id')}/`;
        if (btn.classList.contains('bi-heart')) {
            btn.classList.toggle('bi-heart');
            btn.classList.toggle('bi-heart-fill');
            reqPath += 'addLike';
        } else if (btn.classList.contains('bi-heart-fill')) {
            btn.classList.toggle('bi-heart');
            btn.classList.toggle('bi-heart-fill');
            reqPath += 'rmvLike';
        }

        await axios
            .get(reqPath)
            .then((res) => {
                const numLikes = res.data.numLikes;
                label.textContent = numLikes;
            })
            .catch((e) => console.log(e));
    });
}
