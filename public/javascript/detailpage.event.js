//event form
const form = document.querySelector('#eventForm');
const inputEventDate = document.querySelector('#eventDate');
const inputEventTime = document.querySelector('#eventTime');
const inputEventName = document.querySelector('#eventName');
const inputEventInfo = document.querySelector('#eventInfo');
const inputEventLink = document.querySelector('#eventLink');


const btnClose1 = document.getElementById('btnClose1');
btnClose1.onclick = function () {
    inputEventDate.value = '';
    inputEventTime.value = '';
    inputEventName.value = '';
    inputEventInfo.value = '';
    inputEventLink.value = '';
};

const btnClose2 = document.getElementById('btnClose2');
btnClose2.onclick = function () {
    inputEventDate.value = '';
    inputEventTime.value = '';
    inputEventName.value = '';
    inputEventInfo.value = '';
    inputEventLink.value = '';
};

// Event form modal
const eventFormModal = new bootstrap.Modal(
    document.querySelector('#staticBackdrop'),
    {}
);

const eventForm = document.querySelector('#actualEventForm');
const createEventBtn = document.querySelector('#createEventBtn');
createEventBtn.addEventListener('click', () => {
    // if more than 4 occurences of '/', then action of event form still set to update route
    if (eventForm.getAttribute('action').split('/').length > 4) {
        eventForm.setAttribute(
            'action',
            eventForm.getAttribute('action').split('/', 4).join('/')
        );
    }
});

// Fill event form with data for updates
const eventEditBtns = document.querySelectorAll('button.editEventBtn');
for (button of eventEditBtns) {
    button.addEventListener('click', (event) => {
        console.log('click');
        const eventId = event.target.getAttribute('data-id');
        axios
            .get(`/api/events?id=${eventId}`)
            .then((res) => {
                const event = res.data;

                eventFormModal.show();
                inputEventName.value = event.title;
                const dateAndTime = event.date.split('T');
                inputEventDate.value = dateAndTime[0];
                inputEventTime.value = dateAndTime[1]
                    .split('.')[0]
                    .substring(0, 5);
                inputEventInfo.value = event.description;
                inputEventLink.value = event.link;
                if (eventForm.getAttribute('action').split('/').length <= 4) {
                    eventForm.setAttribute(
                        'action',
                        eventForm.getAttribute('action') +
                            '/' +
                            eventId +
                            '?_method=PUT'
                    );
                }
            })
            .catch((e) => {
                console.log(e);
            });
    });
}