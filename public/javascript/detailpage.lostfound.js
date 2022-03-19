// lost & found form

const lostForm = document.querySelector('#lostForm');
const inputLostDate = document.querySelector('#lostDate');
const inputLostItem = document.querySelector('#lostItem');
const inputLostItemLong = document.querySelector('#lostItemLong');
const inputLostContact = document.querySelector('#lostContact');
const inputRadioLost = document.querySelector('#radioLost');
const inputRadioFound = document.querySelector('#radioFound');



const btnClose3 = document.getElementById('btnClose3');
btnClose3.onclick = function () {
    setTimeout(function () { window.location.reload(); }, 10)
};

const btnClose4 = document.getElementById('btnClose4');
btnClose4.onclick = function () {
    inputLostDate.value = '';
    inputLostItem.value = '';
    inputLostItemLong.value = '';
    inputLostContact.value = '';
    inputRadioLost.checked = false;
    inputRadioFound.checked = false;
};


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