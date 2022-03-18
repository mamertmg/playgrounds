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