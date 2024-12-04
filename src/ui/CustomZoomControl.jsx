// CustomZoomControl.js

import React, { useEffect } from 'react';
import { useMap } from 'react-leaflet';
import L from 'leaflet';

function CustomZoomControl() {
  const map = useMap();

  useEffect(() => {
    const CustomControl = L.Control.extend({
      onAdd: function (map) {
        const container = L.DomUtil.create('div', 'leaflet-bar custom-control');

        // Zoom In Button
        const zoomInButton = L.DomUtil.create('a', 'custom-zoom-in', container);
        zoomInButton.innerHTML = '+';
        zoomInButton.href = '#';

        // Set styles directly on the zoomInButton
        zoomInButton.style.backgroundColor = '#801D14';
        zoomInButton.style.color = '#ffffff';
        zoomInButton.style.fontSize = '18px';
        zoomInButton.style.width = '40px';
        zoomInButton.style.height = '40px';
        zoomInButton.style.display = 'flex';
        zoomInButton.style.alignItems = 'center';
        zoomInButton.style.justifyContent = 'center';
        zoomInButton.style.textDecoration = 'none';
        zoomInButton.style.borderRadius = '50%';
        zoomInButton.style.marginBottom = '5px';
        zoomInButton.style.padding = '0';
        zoomInButton.style.border = 'none';
        zoomInButton.style.cursor = 'pointer';

        // Zoom Out Button
        const zoomOutButton = L.DomUtil.create('a', 'custom-zoom-out', container);
        zoomOutButton.innerHTML = '-';
        zoomOutButton.href = '#';

        // Set styles directly on the zoomOutButton
        zoomOutButton.style.backgroundColor = '#801D14';
        zoomOutButton.style.color = '#ffffff';
        zoomOutButton.style.fontSize = '18px';
        zoomOutButton.style.width = '40px';
        zoomOutButton.style.height = '40px';
        zoomOutButton.style.display = 'flex';
        zoomOutButton.style.alignItems = 'center';
        zoomOutButton.style.justifyContent = 'center';
        zoomOutButton.style.textDecoration = 'none';
        zoomOutButton.style.borderRadius = '50%';
        zoomOutButton.style.marginBottom = '0';
        zoomOutButton.style.padding = '0';
        zoomOutButton.style.border = 'none';
        zoomOutButton.style.cursor = 'pointer';

        // Event Listeners for Click
        L.DomEvent.on(zoomInButton, 'click', function (e) {
          L.DomEvent.stopPropagation(e);
          L.DomEvent.preventDefault(e);
          map.zoomIn();
        });

        L.DomEvent.on(zoomOutButton, 'click', function (e) {
          L.DomEvent.stopPropagation(e);
          L.DomEvent.preventDefault(e);
          map.zoomOut();
        });

        // Event Listeners for Hover Effects
        // Zoom In Button Hover
        L.DomEvent.on(zoomInButton, 'mouseenter', function () {
          zoomInButton.style.backgroundColor = '#801D14';
        });
        L.DomEvent.on(zoomInButton, 'mouseleave', function () {
          zoomInButton.style.backgroundColor = '#a1221a';
        });

        // Zoom Out Button Hover
        L.DomEvent.on(zoomOutButton, 'mouseenter', function () {
            zoomOutButton.style.backgroundColor = '#801D14';
        });
        L.DomEvent.on(zoomOutButton, 'mouseleave', function () {
         
          zoomOutButton.style.backgroundColor = '#a1221a';
        });

        return container;
      },
    });

    const customControl = new CustomControl({ position: 'bottomright' });
    map.addControl(customControl);

    // Cleanup on unmount
    return () => {
      map.removeControl(customControl);
    };
  }, [map]);

  return null;
}

export default CustomZoomControl;
