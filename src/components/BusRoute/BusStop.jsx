// BusStop.js
import React, { useEffect, useState, useRef } from 'react';
import { Circle, Popup, useMap, Marker } from 'react-leaflet';
import L from 'leaflet'; // Import leaflet to create custom div icons

const BusStop = ({ busPositions }) => {
  const busStops = [
    { position: [27.61582, 84.54965], popupText: 'Jyamire Bus Stop' },
    { position: [27.62146, 84.51585], popupText: 'Tandi Bus Stop' },
    { position: [27.62273, 84.51230], popupText: 'Sauraha Bus Stop' },
    { position: [27.62953, 84.55358], popupText: 'temp Bus Stop' },
    { position: [27.62974, 84.55343], popupText: 'temp Bus Stop' },
    { position: [27.65048, 84.53134], popupText: 'temp Bus Stop' },
  ];

  const map = useMap();
  const [showBusStops, setShowBusStops] = useState(false);
  const [timers, setTimers] = useState({}); // Timers for each bus stop
  const countdownRefs = useRef({}); // Refs to handle countdowns

  useEffect(() => {
    const handleZoom = () => {
      setShowBusStops(map.getZoom() > 12);
    };
    map.on('zoomend', handleZoom);
    handleZoom();

    return () => {
      map.off('zoomend', handleZoom);
    };
  }, [map]);

  // Detect if bus enters or leaves the circle
  useEffect(() => {
    busStops.forEach((stop, index) => {
      busPositions.forEach((busPos) => {
        const distance = map.distance(stop.position, busPos);
        if (distance <= 5) { // Bus enters the circle
          if (!timers[index]) {
            countdownRefs.current[index] = setTimeout(() => {
              startCountdown(index);
            }, 5000); // Start countdown if bus stays for 5 seconds
          }
        } else { // Bus leaves the circle
          if (timers[index]) {
            resetCountdown(index);
          }
        }
      });
    });

    return () => {
      Object.values(countdownRefs.current).forEach(clearTimeout);
    };
  }, [busPositions, timers, map]);

  const startCountdown = (index) => {
    setTimers((prevTimers) => ({
      ...prevTimers,
      [index]: 180 // 3 minutes in seconds
    }));

    const countdownInterval = setInterval(() => {
      setTimers((prevTimers) => {
        const newTime = prevTimers[index] - 1;
        if (newTime <= 0) {
          clearInterval(countdownInterval);
          return { ...prevTimers, [index]: 0 };
        }
        return { ...prevTimers, [index]: newTime };
      });
    }, 1000);

    countdownRefs.current[index] = countdownInterval;
  };

  const resetCountdown = (index) => {
    clearInterval(countdownRefs.current[index]);
    setTimers((prevTimers) => ({
      ...prevTimers,
      [index]: null
    }));
  };

  const createDivIcon = (text) => {
    return L.divIcon({
      className: 'custom-div-icon',
      html: `<div style="background-color:rgba(255, 255, 255, 0.8);padding:2px 4px;border-radius:4px;">${text}</div>`,
      iconSize: [30, 15],
    });
  };

  return (
    <>
      {showBusStops &&
        busStops.map((stop, index) => (
          <>
            <Circle
              key={`circle-${index}`}
              center={stop.position}
              radius={10}
              color="blue"
              fillColor="blue"
              fillOpacity={0.5}
            >
              <Popup>
                <span>{stop.popupText}</span>
              </Popup>
            </Circle>
            {timers[index] !== null && (
              <Marker
                key={`timer-${index}`}
                position={stop.position}
                icon={createDivIcon(`Countdown: ${timers[index]}s`)}
                interactive={false} // Make marker non-interactive
              />
            )}
          </>
        ))}
    </>
  );
};

export default BusStop;
