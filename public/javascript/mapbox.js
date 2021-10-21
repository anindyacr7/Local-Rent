mapboxgl.accessToken = mapToken;
const map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/streets-v11',
    center: product.geometry.coordinates,
    zoom: 10
});
map.addControl(new mapboxgl.NavigationControl());
new mapboxgl.Marker()
    .setLngLat(product.geometry.coordinates)
    .setPopup(
        new mapboxgl.Popup({ offset: 10 })
            .setHTML(
                `<h3>${product.title}</h3><p>${product.location}</p>`
            )
    )
    .addTo(map)