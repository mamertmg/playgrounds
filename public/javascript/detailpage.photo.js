//addPhoto form

const photoForm = document.querySelector('#photoForm');
const inputPhotoDescription = document.querySelector('#photoDescription');
const inputPlaygroundPhoto = document.querySelector('#playgroundPhoto');

const photoDescription = inputPhotoDescription.value;
const playgroundPhoto = inputPlaygroundPhoto.value;

const submitMessagePhoto = document.getElementById('submitMessagePhoto');
submitMessagePhoto.style.display = 'none';
const btnSubmitPhoto = document.getElementById('btnSubmitPhoto');

// btnSubmitPhoto.onclick = function () {

//   photoForm.style.display = 'none';
//   btnSubmitPhoto.style.display = 'none';
//   submitMessagePhoto.style.display = 'inline-block';
// }

const btnClose5 = document.getElementById('btnClose5');
btnClose5.onclick = function () {
    photoForm.style.display = 'block';
    btnSubmitPhoto.style.display = 'block';
    submitMessagePhoto.style.display = 'none';
    inputPhotoDescription.value = '';
    inputPlaygroundPhoto.value = '';
    document.getElementById('playgroundPhoto').value = null;
    framePhoto.src = '';
};

const btnClose6 = document.getElementById('btnClose6');
btnClose6.onclick = function () {
    photoForm.style.display = 'block';
    btnSubmitPhoto.style.display = 'block';
    submitMessagePhoto.style.display = 'none';
    inputPhotoDescription.value = '';
    inputPlaygroundPhoto.value = '';
    document.getElementById('playgroundPhoto').value = null;
    framePhoto.src = '';
};

// Image Upload
function preview3() {
    framePhoto.src = URL.createObjectURL(event.target.files[0]);
}
