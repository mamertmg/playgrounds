// lost & found form

const lostForm = document.querySelector('#lostForm');
const inputLostDate = document.querySelector('#lostDate');
const inputLostItem = document.querySelector('#lostItem');
const inputLostItemLong = document.querySelector('#lostItemLong');
const inputLostContact = document.querySelector('#lostContact');
const inputLostPhoto = document.querySelector('#lostPhoto');
const frame2 = document.getElementById('frame2');
const radioLost = document.querySelector('#radioLost');
const radioFound = document.querySelector('#radioFound');

const lostDate = inputLostDate.value;
const lostItem = inputLostItem.value;
const lostItemLong = inputLostItemLong.value;
const lostContact = inputLostContact.value;
const lostPhoto = inputLostPhoto.value;

const submitMessage2 = document.getElementById('submitMessage2');
submitMessage2.style.display = 'none';
const targetDiv2 = document.getElementById('lostForm');
targetDiv2.style.display = 'block';
const btnSubmit2 = document.getElementById('btnSubmit2');

// btnSubmit2.onclick = function () {
//   targetDiv2.style.display = 'none';
//   btnSubmit2.style.display = 'none';
//   submitMessage2.style.display = 'inline-block';
// }

const btnClose3 = document.getElementById('btnClose3');
btnClose3.onclick = function () {
    targetDiv2.style.display = 'block';
    btnSubmit2.style.display = 'block';
    submitMessage2.style.display = 'none';
    inputLostDate.value = '';
    inputLostItem.value = '';
    inputLostItemLong.value = '';
    inputLostContact.value = '';
    inputLostPhoto.value = '';
    document.getElementById('lostPhoto').value = null;
    frame2.src = '';
};

const btnClose4 = document.getElementById('btnClose4');
btnClose4.onclick = function () {
    targetDiv2.style.display = 'block';
    btnSubmit2.style.display = 'block';
    submitMessage2.style.display = 'none';
    inputLostDate.value = '';
    inputLostItem.value = '';
    inputLostItemLong.value = '';
    inputLostContact.value = '';
    inputLostPhoto.value = '';
    document.getElementById('lostPhoto').value = null;
    frame2.src = '';
};
// Image Upload
function preview2() {
    frame2.src = URL.createObjectURL(event.target.files[0]);
}

// Lost&Found form modal
const lostFoundFormModal = new bootstrap.Modal(
    document.querySelector('#staticBackdroplostfound'),
    {}
);

const lostFoundForm = document.querySelector('#form-lost');
const createLostFoundBtn = document.querySelector('#createLostFoundBtn');
createLostFoundBtn.addEventListener('click', () => {
    // if more than 4 occurences of '/', then action of event form still set to update route
    if (lostFoundForm.getAttribute('action').split('/').length > 4) {
        lostFoundForm.setAttribute(
            'action',
            lostFoundForm.getAttribute('action').split('/', 4).join('/')
        );
    }
});

// Fill event form with data for updates
const lostFoundEditBtns = document.querySelectorAll('button.editLostFoundBtn');
for (button of lostFoundEditBtns) {
    button.addEventListener('click', (event) => {
        console.log('click');
        const lfId = event.target.getAttribute('data-id');
        axios
            .get(`/api/lost-found?id=${lfId}`)
            .then((res) => {
                const lostFound = res.data;

                lostFoundFormModal.show();
                if (lostFound.status === 'lost') {
                    radioLost.checked = true;
                } else {
                    radioFound.checked = true;
                }
                inputLostItem.value = lostFound.title;
                const dateAndTime = lostFound.date.split('T');
                inputLostDate.value = dateAndTime[0];
                inputLostItemLong.value = lostFound.description;
                inputLostContact.value = lostFound.contact;
                if (
                    lostFoundForm.getAttribute('action').split('/').length <= 4
                ) {
                    lostFoundForm.setAttribute(
                        'action',
                        lostFoundForm.getAttribute('action') +
                            '/' +
                            lfId +
                            '?_method=PUT'
                    );
                }
            })
            .catch((e) => {
                console.log(e);
            });
    });
}