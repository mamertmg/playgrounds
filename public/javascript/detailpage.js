let popoverTriggerList = [].slice.call(
    document.querySelectorAll('[data-bs-toggle="popover"]')
);
let popoverList = popoverTriggerList.map(function (popoverTriggerEl) {
    return new bootstrap.Popover(popoverTriggerEl);
});

const form = document.querySelector('#eventForm');
const inputEventDate = document.querySelector('#eventDate');
const inputEventTime = document.querySelector('#eventTime');
const inputEventName = document.querySelector('#eventName');
const inputEventLink = document.querySelector('#eventLink');
const list = document.querySelector('#events');

// TODO: move clearing of event form to different event
// form.addEventListener('submit', function (e) {
//e.preventDefault();
// const eventDate = inputEventDate.value;
// const eventTime = inputEventTime.value;
// const eventName = inputEventName.value;
// const eventInfo = inputEventLink.value;
// const newLI = document.createElement('LI');
// newLI.innerText =
//     eventDate + ' ' + eventTime + ' ' + eventName + ' ' + eventInfo;
// //list.append(newLI);
// inputEventDate.value = '';
// inputEventTime.value = '';
// inputEventName.value = '';
// inputEventLink.value = '';
// });

const eventFormModal = new bootstrap.Modal(
    document.querySelector('#staticBackdrop'),
    {}
);

// Displaying all event information
const eventModal = new bootstrap.Modal(
    document.querySelector('#eventModal'),
    {}
);
const title = document.querySelector('#eTitle');
const descr = document.querySelector('#eDescr');
const footer = document.querySelector('#eFooter');
const eventModalBtns = document.querySelectorAll('button.eventBtn');
const deleteEventForm = document.querySelector('#deleteEvent');

for (button of eventModalBtns) {
    button.addEventListener('click', (event) => {
        eventModal.show();
        const eventId = event.target.closest('td').getAttribute('data-id');
        deleteEventForm.setAttribute(
            'action',
            deleteEventForm.getAttribute('action') + eventId + '?_method=delete'
        );

        axios
            .get(`/api/events?id=${eventId}`)
            .then((res) => {
                const event = res.data;
                title.innerHTML = event.title;
                descr.innerHTML = event.description;
                footer.setAttribute('data-id', event._id);
            })
            .catch((e) => {
                console.log(e);
            });
    });

    // Force click event to show event detail page after update
    if (button.getAttribute('data-id')) {
        button.setAttribute('data-id', '');
        button.click();
    }
}

// Fill event form with data
const eventEditBtn = document.querySelector('#editEventBtn');
eventEditBtn.addEventListener('click', () => {
    const eventId = footer.getAttribute('data-id');
    axios
        .get(`/api/events?id=${eventId}`)
        .then((res) => {
            const event = res.data;

            eventModal.hide();
            eventFormModal.show();
            inputEventName.value = event.title;
            const dateAndTime = event.date.split('T');
            console.log(dateAndTime);
            inputEventDate.value = dateAndTime[0];
            inputEventTime.value = dateAndTime[1].split('.')[0].substring(0, 5);
            form.setAttribute(
                'action',
                form.getAttribute('action') + '/' + eventId + '?_method=PUT'
            );
        })
        .catch((e) => {
            console.log(e);
        });
});
