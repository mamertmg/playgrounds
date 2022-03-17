const addressInput = document.querySelector('#address');
const cityInput = document.querySelector('#city');
const latInput = document.querySelector('#lat');
const lngInput = document.querySelector('#lng');

//Autocomplete
let autocomplete;

function initAutocomplete() {
    autocomplete = new google.maps.places.Autocomplete(addressInput, {
        componentRestrictions: { country: ['de'] },
        fields: ['geometry', 'name', 'place_id'],
        types: ['address'],
    });

    autocomplete.addListener('place_changed', onPlaceChanged);
}

// pass autocompleted address as value
function onPlaceChanged() {
    const place = autocomplete.getPlace();
    if (!place.geometry) {
        addressInput.placeholder = 'Enter a place';
    } else {
        const splitName = addressInput.value.split(', ');
        addressInput.value = splitName[0];
        cityInput.value = splitName[1];
        latInput.value = place.geometry.location.lat();
        lngInput.value = place.geometry.location.lng();
    }
}


// for disabling form submissions if there are invalid fields
(function () {
    'use strict'

    // Fetch all the forms we want to apply custom Bootstrap validation styles to
    const forms = document.querySelectorAll('.validated-form')

    // Loop over them and prevent submission
    Array.from(forms)
        .forEach(function (form) {
            form.addEventListener('submit', function (event) {
                if (!form.checkValidity()) {
                    event.preventDefault()
                    event.stopPropagation()
                }
                form.classList.add('was-validated')
            }, false)
        })
})()




