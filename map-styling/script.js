function initMap() {
    map = new google.maps.Map(document.getElementById("map"), {
        mapId: "546de97e85a128a6",
        center: { lat: 51.22, lng: 6.77 },
        zoom: 15,
    });

    const markers = [
        ["Seilspielplatz", 51.232928391458785, 6.7731710355280015],
        ["Spielplatz Spee‘scher Graben", 51.221624427602734, 6.77031014027715],
        ["Spielplatz Schwanenmarkt", 51.22014623354839, 6.773571536911311],
        ["Spielplatz im WGZ Bank-Park", 51.2187728973201, 6.798678328408502],
        ["Spielplatz Lessingplatz", 51.21409645756707, 6.793783676859652],
    ];


    for (let i = 0; i < markers.length; i++) {
        const currMarker = markers[i];
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

        const infowindow = new google.maps.InfoWindow({
            content: currMarker[0],
        });

        marker.addListener("click", () => {
            infowindow.open(map, marker);
        })


    }


}
