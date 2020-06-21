// /* eslint-disable */

export const displayMap = (locations) =>
{
  mapboxgl.accessToken = 'pk.eyJ1IjoicHJhdmVlbi1tYXBib3giLCJhIjoiY2tiMjJtYmV5MDZtYzJxcGhybHQ5MmE1ZyJ9.t8XizDspHgS-a7MWfry_Xg';

  var map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/praveen-mapbox/ckb22xk0z0su51ipi5qyji5mm',
    // center: [-118.113491, 34.111745],
    // zoom: 10,
    // interactive: false,
    scrollZoom: false
  });

  const bounds = new mapboxgl.LngLatBounds();

  locations.forEach(loc =>
  {
    // Create marker
    const el = document.createElement('div');
    el.className = 'marker';

    // Add marker
    new mapboxgl.Marker({
      element: el,
      anchor: 'bottom'
    })
      .setLngLat(loc.coordinates)
      .addTo(map);

    // Add popup
    new mapboxgl.Popup({
      offset: 30
    })
      .setLngLat(loc.coordinates)
      .setHTML(`<p>Day ${loc.day}: ${loc.description}</p>`)
      .addTo(map);

    // Extend map bounds to include current location
    bounds.extend(loc.coordinates);
  });

  map.fitBounds(bounds, {
    padding: {
      top: 200,
      bottom: 150,
      left: 100,
      right: 100
    }
  });
}


