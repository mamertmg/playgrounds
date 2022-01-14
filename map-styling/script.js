async function initMap() {

    // const markers = async (index) => {

    //     const res = await axios.get('https://opendata.duesseldorf.de/api/action/datastore/search.json?resource_id=6d19eaa3-9967-4af4-b4b6-b2bcebe301a2&limit=5&fields[]=objektbezeichnung&fields[] =latitude&fields[]=longitude&fields[]=objektart&fields[]=strasse_hausnr')
    //     arr = res.data.result.records
    //     return arr[index]
    // }



    const map = new google.maps.Map(document.getElementById("map"), {
        mapId: "546de97e85a128a6",
        center: { lat: 51.22, lng: 6.77 },
        zoom: 15,
    });






    const markers = [
        { objektbezeichung: "Seilspielplatz", latitude: 51.232928391458785, longitude: 6.7731710355280015, objektart: "Bolzplatz", strasse_hausnr: 5 },
        { objektbezeichung: "Spielplatz Spee‘scher Graben", latitude: 51.221624427602734, longitude: 6.77031014027715, objektart: "Kinderspielplatz", strasse_hausnr: 4 },
        { objektbezeichung: "Spielplatz Schwanenmarkt", latitude: 51.22014623354839, longitude: 6.773571536911311, objektart: "Bolzplatz", strasse_hausnr: 3 },
        { objektbezeichung: "Spielplatz im WGZ Bank-Park", latitude: 51.2187728973201, longitude: 6.798678328408502, objektart: "Bolzplatz", strasse_hausnr: 5 },
        { objektbezeichung: "Spielplatz Lessingplatz", latitude: 51.21409645756707, longitude: 6.793783676859652, objektart: "Kinderspielplatz", strasse_hausnr: 4 },
    ];



    for (let i = 0; i < 5; i++) {

        const currMarker = markers[i];
        const currMarkerImgSrc = `"https://picsum.photos/200?random=${i}"`;
        const marker = new google.maps.Marker(

            {

                position: { lat: currMarker.latitude, lng: currMarker.longitude },
                map,
                title: currMarker.objektbezeichung,
                icon: {
                    url: "playground-pixel.png",
                    scaledSize: new google.maps.Size(40, 40)
                },
                animation: google.maps.Animation.DROP,
            });


        const contentString = ` 
        <div id='currMarkerImg'><a href='www.google.com'><img src=${currMarkerImgSrc}></a></div>
        <b> ${currMarker.objektbezeichung}</b>
        <p id='currMarkerDescr'>
        <div id='currMarkerRating'>Adresse: ${currMarker.strasse_hausnr}</div> 
        Type: ${currMarker.objektart}</p>`;

        const infowindow = new google.maps.InfoWindow({
            content: contentString
        });

        marker.addListener("click", () => {
            infowindow.open(map, marker);
        })


    }


}


function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function (pos) {


            document.querySelector('#searchbox').value = `lat: ${pos.coords.latitude}, lng: ${pos.coords.longitude}`



        });
    } else {
        console.log("Geolocation is not supported by this browser.");
    }
}
