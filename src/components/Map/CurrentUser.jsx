import React, { useState, useEffect } from 'react';
import { Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import Speedometer from './Speedometer';

function CurrentUser() {
  const [userPosition, setUserPosition] = useState(null);
  const [userDirection, setUserDirection] = useState(0);
  const [speed, setSpeed] = useState(0);

  useEffect(() => {
    if (navigator.geolocation) {
      const geoId = navigator.geolocation.watchPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setUserPosition([latitude, longitude]);
        },
        (error) => {
          console.error('Error occurred while retrieving location:', error);
        },
        { enableHighAccuracy: true }
      );

      return () => {
        navigator.geolocation.clearWatch(geoId);
      };
    } else {
      console.error('Geolocation is not supported by this browser.');
    }
  }, []);

  useEffect(() => {
    const handleOrientation = (event) => {
      let compassHeading;

      if (event.webkitCompassHeading) {
        compassHeading = event.webkitCompassHeading;
      } else if (event.alpha !== null) {
        const alpha = event.alpha;

        if (typeof window.orientation !== 'undefined') {
          if (window.orientation === 0) {
            compassHeading = alpha;
          } else if (window.orientation === 90) {
            compassHeading = alpha - 90;
          } else if (window.orientation === -90) {
            compassHeading = alpha + 90;
          } else {
            compassHeading = alpha + 180;
          }
        } else {
          compassHeading = alpha;
        }

        if (compassHeading < 0) {
          compassHeading += 360;
        }
        if (compassHeading >= 360) {
          compassHeading -= 360;
        }
      } else {
        compassHeading = 0;
      }

      setUserDirection(compassHeading);
    };

    if (window.DeviceOrientationEvent) {
      window.addEventListener('deviceorientation', handleOrientation, true);

      return () => {
        window.removeEventListener('deviceorientation', handleOrientation, true);
      };
    } else {
      console.error('Device orientation is not supported by this browser.');
    }
  }, []);

  useEffect(() => {
    const watchId = navigator.geolocation.watchPosition(
      (position) => {
        setSpeed(position.coords.speed || 0);
      },
      (error) => {
        console.error("Error getting speed:", error);
      }
    );

    return () => {
      navigator.geolocation.clearWatch(watchId);
    };
  }, []);

  return (
    userPosition && (
      <div className='flex flex-col items-center'>
        <Marker
          key={'001'}
          position={userPosition}
          icon={
            new L.DivIcon({
              className: 'custom-marker',
              html: `
                <div class="marker-icon" style="transform: rotate(${360 - userDirection}deg);">
                  <img src="../navigator.svg" class="w-4 h-4 border-none bg-transparent outline-none" />
                </div>
              `,
              iconSize: [15, 25],
              popupAnchor: [0, -46]
            })
          }
        >
          <Popup>
            <Speedometer speed={speed} />
          </Popup>
        </Marker>
      </div>
    )
  );
}

export default CurrentUser;
