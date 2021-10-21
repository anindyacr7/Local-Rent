mapboxgl.accessToken = mapToken;
const map = new mapboxgl.Map({
container: 'map',
style: 'mapbox://styles/mapbox/dark-v10',
center: [88.6113177612591,23.181200713382864],
zoom: 3
});
map.addControl(new mapboxgl.NavigationControl());
map.on('load', function () {
map.addSource('products', {
type: 'geojson',

data:products,
cluster: true,
clusterMaxZoom: 14, // Max zoom to cluster points on
clusterRadius: 50 // Radius of each cluster when clustering points (defaults to 50)
});
 
map.addLayer({
id: 'clusters',
type: 'circle',
source: 'products',
filter: ['has', 'point_count'],
paint: {
// https://docs.mapbox.com/mapbox-gl-js/style-spec/#expressions-step

'circle-color': [
'step',
['get', 'point_count'],
'#51bbd6',
50,
'#f1f075',
100,
'#f28cb1'
],
'circle-radius': [
'step',
['get', 'point_count'],
20,
100,
30,
750,
40
]
}
});
 
map.addLayer({
id: 'cluster-count',
type: 'symbol',
source: 'products',
filter: ['has', 'point_count'],
layout: {
'text-field': '{point_count_abbreviated}',
'text-font': ['DIN Offc Pro Medium', 'Arial Unicode MS Bold'],
'text-size': 12
}
});
 
map.addLayer({
id: 'unclustered-point',
type: 'circle',
source: 'products',
filter: ['!', ['has', 'point_count']],
paint: {
'circle-color': '#11b4da',
'circle-radius': 4,
'circle-stroke-width': 1,
'circle-stroke-color': '#fff'
}
});
 
// inspect a cluster on click
map.on('click', 'clusters', function (e) {
const features = map.queryRenderedFeatures(e.point, {
layers: ['clusters']
});
const clusterId = features[0].properties.cluster_id;
map.getSource('products').getClusterExpansionZoom(
clusterId,
function (err, zoom) {
if (err) return;
 
map.easeTo({
center: features[0].geometry.coordinates,
zoom: zoom
});
}
);
});
 


map.on('click', 'unclustered-point', function (e) {
const text = e.features[0].properties.popUpMarkUp;
const coordinates = e.features[0].geometry.coordinates.slice()

while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
}
 
new mapboxgl.Popup()
.setLngLat(coordinates)
.setHTML(text)
.addTo(map);
});
 
map.on('mouseenter', 'clusters', function () {
map.getCanvas().style.cursor = 'pointer';
});
map.on('mouseleave', 'clusters', function () {
map.getCanvas().style.cursor = '';
});
});