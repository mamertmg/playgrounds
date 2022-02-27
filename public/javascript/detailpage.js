var popoverTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="popover"]'))
var popoverList = popoverTriggerList.map(function (popoverTriggerEl) {
  return new bootstrap.Popover(popoverTriggerEl)
})




// let eventListPGNumber = {};

// let eventListPGNumber = addEventListener('submit') = function input {
//   eventListPGNumber.push({
//     eventDate: document.getElementById("eventDate").value,
//     eventTime: document.getElementById("eventTime").value,
//     eventName: document.getElementById("eventName").value,
//     eventInfo: document.getElementById("eventInfo").value
//   })
// };


//event form
const form = document.querySelector('#eventForm');
const inputEventDate = document.querySelector('#eventDate');
const inputEventTime = document.querySelector('#eventTime');
const inputEventName = document.querySelector('#eventName');
const inputEventInfo = document.querySelector('#eventInfo');
const inputEventLink = document.querySelector('#eventLink');
const inputEventPhoto = document.querySelector('#eventPhoto');
const frame = document.getElementById("frame");

const eventDate = inputEventDate.value;
const eventTime = inputEventTime.value;
const eventName = inputEventName.value;
const eventInfo = inputEventInfo.value;
const eventLink = inputEventLink.value;
const eventPhoto = inputEventPhoto.value;

const submitMessage = document.getElementById("submitMessage");
submitMessage.style.display = 'none';
const targetDiv = document.getElementById("eventForm");
targetDiv.style.display = 'block';
const btnSubmit = document.getElementById("btnSubmit");
// btnSubmit.onclick = function () {
//   targetDiv.style.display = 'none';
//   btnSubmit.style.display = 'none';
//   submitMessage.style.display = 'inline-block';

// };

const btnClose1 = document.getElementById("btnClose1");
btnClose1.onclick = function () {
  targetDiv.style.display = "block";
  btnSubmit.style.display = 'block';
  submitMessage.style.display = 'none';
  inputEventDate.value = '';
  inputEventTime.value = '';
  inputEventName.value = '';
  inputEventInfo.value = '';
  inputEventLink.value = '';
  inputEventPhoto.value = '';
  document.getElementById('eventPhoto').value = null;
  frame.src = "";
}

const btnClose2 = document.getElementById("btnClose2");
btnClose2.onclick = function () {
  targetDiv.style.display = "block";
  btnSubmit.style.display = 'block';
  submitMessage.style.display = 'none';
  inputEventDate.value = '';
  inputEventTime.value = '';
  inputEventName.value = '';
  inputEventInfo.value = '';
  inputEventLink.value = '';
  inputEventPhoto.value = '';
  document.getElementById('eventPhoto').value = null;
  frame.src = "";
}
// Image Upload
function preview() {
  frame.src = URL.createObjectURL(event.target.files[0]);
}
// function clearImage() {
//   document.getElementById('eventPhoto').value = null;
//   frame.src = "";
// }

// lost & found form

const lostForm = document.querySelector('#lostForm');
const inputLostDate = document.querySelector('#lostDate');
const inputLostItem = document.querySelector('#lostItem');
const inputLostItemLong = document.querySelector('#lostItemLong');
const inputLostContact = document.querySelector('#lostContact');
const inputLostPhoto = document.querySelector('#lostPhoto');
const frame2 = document.getElementById("frame2");

const lostDate = inputLostDate.value;
const lostItem = inputLostItem.value;
const lostItemLong = inputLostItemLong.value;
const lostContact = inputLostContact.value;
const lostPhoto = inputLostPhoto.value;

const submitMessage2 = document.getElementById("submitMessage2");
submitMessage2.style.display = 'none';
const targetDiv2 = document.getElementById("lostForm");
targetDiv2.style.display = 'block';
const btnSubmit2 = document.getElementById("btnSubmit2");

btnSubmit2.onclick = function () {
  targetDiv2.style.display = 'none';
  btnSubmit2.style.display = 'none';
  submitMessage2.style.display = 'inline-block';
}

const btnClose3 = document.getElementById("btnClose3");
btnClose3.onclick = function () {
  targetDiv2.style.display = "block";
  btnSubmit2.style.display = 'block';
  submitMessage2.style.display = 'none';
  inputLostDate.value = '';
  inputLostItem.value = '';
  inputLostItemLong.value = '';
  inputLostContact.value = '';
  inputLostPhoto.value = '';
  document.getElementById('lostPhoto').value = null;
  frame2.src = "";
}

const btnClose4 = document.getElementById("btnClose4");
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
  frame2.src = "";
}
// Image Upload
function preview2() {
  frame2.src = URL.createObjectURL(event.target.files[0]);
}
// function clearImage2() {
//   document.getElementById('lostPhoto').value = null;
//   frame2.src = "";
// }

//addPhoto form

const photoForm = document.querySelector('#photoForm');
const inputPhotoDescription = document.querySelector('#photoDescription');
const inputPlaygroundPhoto = document.querySelector('#playgroundPhoto');

const photoDescription = inputPhotoDescription.value;
const playgroundPhoto = inputPlaygroundPhoto.value;

const submitMessagePhoto = document.getElementById('submitMessagePhoto');
submitMessagePhoto.style.display = 'none';
const targetDiv3Photo = document.getElementById('photoForm');
const btnSubmitPhoto = document.getElementById('btnSubmitPhoto');

btnSubmitPhoto.onclick = function () {

  targetDiv3Photo.style.display = 'none';
  btnSubmitPhoto.style.display = 'none';
  submitMessagePhoto.style.display = 'inline-block';
}

const btnClose5 = document.getElementById('btnClose5');
btnClose5.onclick = function () {
  targetDiv3Photo.style.display = "block";
  btnSubmitPhoto.style.display = 'block';
  submitMessagePhoto.style.display = 'none';
  inputPhotoDescription.value = '';
  inputPlaygroundPhoto.value = '';
  document.getElementById('playgroundPhoto').value = null;
  framePhoto.src = "";
}

const btnClose6 = document.getElementById('btnClose6');
btnClose6.onclick = function () {
  targetDiv3Photo.style.display = "block";
  btnSubmitPhoto.style.display = 'block';
  submitMessagePhoto.style.display = 'none';
  inputPhotoDescription.value = '';
  inputPlaygroundPhoto.value = '';
  document.getElementById('playgroundPhoto').value = null;
  framePhoto.src = "";
}

// Image Upload
function preview3() {
  framePhoto.src = URL.createObjectURL(event.target.files[0]);
}
// function clearImage() {
//   document.getElementById('playgroundPhoto').value = null;
//   framePhoto.src = "";
// }

