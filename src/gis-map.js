// src/gis-map.js — Interactive Leaflet GIS Map

export function initGisMap() {
  const mapContainer = document.getElementById('gis-map');
  if (!mapContainer) return;

  const mapObserver = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting && typeof L !== 'undefined') {
      mapObserver.disconnect();

      const map = L.map('gis-map').setView([28.3949, 84.1240], 7);

      // Force Leaflet to recalculate container size after IntersectionObserver reveals the element
      setTimeout(() => map.invalidateSize(), 100);

      L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; OpenStreetMap &copy; CARTO',
        subdomains: 'abcd',
        maxZoom: 20
      }).addTo(map);

      const surkhetMarker = L.marker([28.6015, 81.6322]).addTo(map);
      surkhetMarker.bindPopup(`
        <div style="color: #0f172a; font-family: 'Space Mono', monospace;">
          <h4 style="font-weight: bold; margin-bottom: 4px;">Birendranagar, Surkhet</h4>
          <p style="font-size: 12px; margin:0;">LULC Analysis using Random Forest</p>
        </div>
      `).openPopup();

      const nawalparasiMarker = L.marker([27.5319, 83.6922]).addTo(map);
      nawalparasiMarker.bindPopup(`
        <div style="color: #0f172a; font-family: 'Space Mono', monospace;">
          <h4 style="font-weight: bold; margin-bottom: 4px;">Nawalparasi West</h4>
          <p style="font-size: 12px; margin:0;">Decadal LULC Dynamics (2016-2026)</p>
        </div>
      `);
    }
  });

  mapObserver.observe(mapContainer);
}
