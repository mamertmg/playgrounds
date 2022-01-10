function initMap() {

    const map = new google.maps.Map(document.getElementById("map"), {
        mapId: "546de97e85a128a6",
        center: { lat: 51.22, lng: 6.77 },
        zoom: 15,
    });

    const markers = [
        ["Seilspielplatz", 51.232928391458785, 6.7731710355280015, "Bolzplatz", 5],
        ["Spielplatz Spee‘scher Graben", 51.221624427602734, 6.77031014027715, "Kinderspielplatz", 4],
        ["Spielplatz Schwanenmarkt", 51.22014623354839, 6.773571536911311, "Bolzplatz", 3],
        ["Spielplatz im WGZ Bank-Park", 51.2187728973201, 6.798678328408502, "Bolzplatz", 5],
        ["Spielplatz Lessingplatz", 51.21409645756707, 6.793783676859652, "Kinderspielplatz", 4],
    ];


    for (let i = 0; i < markers.length; i++) {
        const currMarker = markers[i];
        const currMarkerImgSrc = `"https://picsum.photos/200?random=${i}"`;
        const marker = new google.maps.Marker({
            position: { lat: currMarker[1], lng: currMarker[2] },
            map,
            title: currMarker[0],
            icon: {
                url: "playground-pixel.png",
                scaledSize: new google.maps.Size(40, 40)
            },
            animation: google.maps.Animation.DROP,
        });


        const contentString = `
        <div id='currMarkerImg'><a href='www.google.com'><img src=${currMarkerImgSrc}></a></div>
        <b>${currMarker[0]}</b>
        <p id='currMarkerDescr'>
        <div id='currMarkerRating'>Adresse: ${currMarker[4]}</div> 
        Type: ${currMarker[3]}</p>`;

        const infowindow = new google.maps.InfoWindow({
            content: contentString
        });

        marker.addListener("click", () => {
            infowindow.open(map, marker);
        })


    }


}
