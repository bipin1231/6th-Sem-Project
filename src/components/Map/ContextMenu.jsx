import React, { useEffect, useState } from 'react';
import { useMapEvents } from 'react-leaflet';
import L from 'leaflet';

// Define the custom icon
const customIcon = L.icon({
  iconUrl: '../pin.svg',
  iconSize: [25, 25],
  iconAnchor: [14, 20],
  popupAnchor: [1, -34],
});

const ContextMenu = () => {
  const [popupOpen, setPopupOpen] = useState(false);
  const [popupLatLng, setPopupLatLng] = useState(null);
  const [markerText, setMarkerText] = useState('');

  const map = useMapEvents({
    contextmenu: (e) => {
      e.originalEvent.preventDefault();

      const { lat, lng } = e.latlng;
      const contextMenu = L.DomUtil.create('div', 'context-menu');
      contextMenu.style.cssText = `
        position: absolute;
        background-color: white;
        border: 1px solid gray;
        border-radius: 5px;
        padding: 8px;
        z-index: 1000;
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
        top: ${e.containerPoint.y}px;
        left: ${e.containerPoint.x}px;
      `;

      const coordinatesText = `${lat.toFixed(5)}, ${lng.toFixed(5)}`;
      const showCoordinatesItem = createMenuItem(coordinatesText, () => {
        navigator.clipboard.writeText(coordinatesText);
      });

      const addMarkerItem = createMenuItem('Add Marker', () => {
        setPopupLatLng(e.latlng);
        setPopupOpen(true);
      });

      contextMenu.appendChild(showCoordinatesItem);
      contextMenu.appendChild(addMarkerItem);

      const existingMenu = document.querySelector('.context-menu');
      if (existingMenu) {
        existingMenu.parentNode.removeChild(existingMenu);
      }

      map.getContainer().appendChild(contextMenu);

      map.on('click', () => {
        if (contextMenu.parentNode) {
          contextMenu.parentNode.removeChild(contextMenu);
        }
      });
    },
  });

  const createMenuItem = (text, onClick) => {
    const menuItem = L.DomUtil.create('div', '');
    menuItem.innerText = text;
    menuItem.style.cssText = `
      padding: 5px 10px;
      cursor: pointer;
      border-radius: 5px;
    `;
    menuItem.onmouseenter = () => {
      menuItem.style.backgroundColor = '#bab4b4';
    };
    menuItem.onmouseleave = () => {
      menuItem.style.backgroundColor = 'transparent';
    };
    menuItem.onclick = () => {
      onClick();
      const contextMenu = document.querySelector('.context-menu');
      if (contextMenu && contextMenu.parentNode) {
        contextMenu.parentNode.removeChild(contextMenu);
      }
    };
    return menuItem;
  };

  useEffect(() => {
    if (popupOpen && popupLatLng) {
      const popupContent = L.DomUtil.create('div', '');
      popupContent.innerHTML = `
        <div style="text-align: center; zIndex: 1600;">
          <input type="text" id="marker-input" placeholder="Enter marker text" class="w-full p-1 mb-1" />
          <button id="add-marker-btn" class="w-full p-1 bg-blue-200 rounded duration-200 hover:bg-blue-50">Add Marker</button>
        </div>
      `;

      const popupOptions = {
        minWidth: 200,
        closeButton: true,
        closeOnClick: false,
        autoClose: false,
        maxWidth: 300,
        className: 'custom-popup'
      };

      const popup = L.popup(popupOptions)
        .setLatLng(popupLatLng)
        .setContent(popupContent)
        .openOn(map);

      document.getElementById('add-marker-btn').addEventListener('click', () => {
        const input = document.getElementById('marker-input').value;
        // Add marker with custom icon
        L.marker(popupLatLng, { icon: customIcon })
          .addTo(map)
          .bindPopup(input)
          .openPopup();
        setPopupOpen(false);
        map.closePopup(popup);
      });
    }
  }, [popupOpen, popupLatLng, map]);

  useEffect(() => {
    return () => {
      map.off('contextmenu');
      map.off('click');
    };
  }, [map]);

  return null;
};

export default ContextMenu;
