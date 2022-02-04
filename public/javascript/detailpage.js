var popoverTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="popover"]'))
var popoverList = popoverTriggerList.map(function (popoverTriggerEl) {
  return new bootstrap.Popover(popoverTriggerEl)
})





const form = document.querySelector('#eventForm');
const inputEventDate = document.querySelector('#eventDate');
const inputEventTime = document.querySelector('#eventTime');
const inputEventName = document.querySelector('#eventName');
const inputEventInfo = document.querySelector('#eventInfo');
const list = document.querySelector('#events');
form.addEventListener("submit", function (e) {
  e.preventDefault();
  const eventDate = inputEventDate.value;
  const eventTime = inputEventTime.value;
  const eventName = inputEventName.value;
  const eventInfo = inputEventInfo.value;
  const newLI = document.createElement('LI');
  newLI.innerText = eventDate + " " + eventTime + " " + eventName + " " + eventInfo;
  list.append(newLI);
  inputEventDate.value = '';
  inputEventTime.value = '';
  inputEventName.value = '';
  inputEventInfo.value = '';
});