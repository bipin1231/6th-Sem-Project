import React, { useState, useEffect } from "react";
import "leaflet-routing-machine/dist/leaflet-routing-machine.css";
import L from "leaflet";
import "leaflet-routing-machine";
import "leaflet-control-geocoder";

const RoutingMachine = ({ map }) => {
  const [routingControl, setRoutingControl] = useState(null);
  const [isRoutingEnabled, setIsRoutingEnabled] = useState(false);

  useEffect(() => {
    if (isRoutingEnabled) {
      // Add routing control to the map
      const control = L.Routing.control({
        waypoints: [],
        routeWhileDragging: true,
        draggableWaypoints: false,
        removeWaypoints: false,
        altLineOptions: {
          styles: [
            { color: "black", opacity: 0.15, weight: 9 },
            { color: "white", opacity: 0.8, weight: 6 },
            { color: "blue", opacity: 0.5, weight: 2 },
          ],
        },
        geocoder: L.Control.Geocoder.nominatim(),
      }).addTo(map);

      setRoutingControl(control);
    } else {
      // Remove routing control from the map
      if (routingControl) {
        map.removeControl(routingControl);
        setRoutingControl(null);
      }
    }
  }, [isRoutingEnabled]);

  const toggleRouting = () => {
    setIsRoutingEnabled((prevState) => !prevState);
  };

  return (
    <button className="absolute top-[85px] right-[30%] z-[1300] m-1" onClick={toggleRouting}>
      <img src="../route-icon.png" className='w-15 h-8' />
    </button>
  );
};

export default RoutingMachine;
