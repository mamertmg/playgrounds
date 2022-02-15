//top navbar turn white on scroll

const nav = document.querySelector("nav");
const sectionOne = document.querySelector(".top-container");

const sectionOneOptions = {
    threshold: 0.1
};

const sectionOneObserver = new IntersectionObserver(function (
    entries,
    sectionOneObserver
) {
    entries.forEach(entry => {
        if (!entry.isIntersecting) {
            nav.classList.add("bg-white");
        } else {
            console.log(entry.target);

            nav.classList.remove("bg-white");
        }
    });
},
    sectionOneOptions);

sectionOneObserver.observe(sectionOne);

const searchBar = document.getElementById('searchBar')
searchBar.addEventListener('click', event => {
    console.log(event.detail)
});


