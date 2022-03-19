//addPhoto form

const photoForm = document.querySelector('#photoForm');
const inputPhotoDescription = document.querySelector('#photoDescription');
const inputPlaygroundPhoto = document.querySelector('#playgroundPhoto');

const photoDescription = inputPhotoDescription.value;
const playgroundPhoto = inputPlaygroundPhoto.value;


const btnClose5 = document.getElementById('btnClose5');
btnClose5.onclick = function () {
    inputPhotoDescription.value = '';
    inputPlaygroundPhoto.value = '';
    document.getElementById('playgroundPhoto').value = null;
    framePhoto.src = '';
};

const btnClose6 = document.getElementById('btnClose6');
btnClose6.onclick = function () {
    inputPhotoDescription.value = '';
    inputPlaygroundPhoto.value = '';
    document.getElementById('playgroundPhoto').value = null;
    framePhoto.src = '';
};

// Image Upload
function preview3() {
    framePhoto.src = URL.createObjectURL(event.target.files[0]);
}
