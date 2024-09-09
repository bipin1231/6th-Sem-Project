import React, { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import service from '../../appwrite/config';
import { useSelector } from 'react-redux';
import { OpenStreetMapProvider, GeoSearchControl } from 'leaflet-geosearch';
import 'leaflet-geosearch/dist/geosearch.css';
import "leaflet-routing-machine/dist/leaflet-routing-machine.css";
import "leaflet-routing-machine";
import "leaflet-control-geocoder";
// import LowerSlideBar from "./LowerSlideBar";
import ContextMenu from "./ContextMenu";
import CurrentUser from './CurrentUser';
import { data } from 'autoprefixer';
import Speedometer from './Speedometer';

const nepalBounds = L.latLngBounds(
  L.latLng(26.347, 80.058), // South-West
  L.latLng(30.447, 88.201) // North-East
);

const baseLayers = {
  Normal: L.tileLayer(
    "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
    {
      attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    }
  ),
  Detailed: L.tileLayer(
    "https://{s}.tile.openstreetmap.fr/osmfr/{z}/{x}/{y}.png",
    {
      attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    }
  ),
  // Satellite: L.tileLayer(
  //   "https://tiles.stadiamaps.com/tiles/alidade_satellite/{z}/{x}/{y}{r}.{ext}",
  //   {
  //     attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
  //     ext: "jpg",
  //   }
  // ),
};

function LayerControl() {
  const map = useMap();

  useEffect(() => {
    const layerControl = L.control.layers(baseLayers, {}, { position: 'topleft' }).addTo(map);
      setTimeout(() => {
        const layerControlElement = document.querySelector('.leaflet-control-layers');
        if (layerControlElement) {
          layerControlElement.classList.add('absolute', 'top-[10px]', 'scale-[0.9]', 'lg:scale-[1]');
        }
      }, 0);
    baseLayers["Normal"].addTo(map);

    return () => {
      map.removeControl(layerControl);
    };
  }, [map]);

  return null;
}
function SearchControl() {
  const map = useMap();

  useEffect(() => {
    const provider = new OpenStreetMapProvider();

    const searchControl = new GeoSearchControl({
      provider: provider,
      style: 'bar',
      autoClose: true,
      keepResult: true,
      // marker: (latlng) => {
      //   return L.marker(latlng, {
      //     icon: L.icon({
      //       iconUrl: '../pin.svg', // Ensure this path is correct
      //       iconSize: [25, 25], // Adjust size as needed
      //       iconAnchor: [12, 25], // Adjust anchor point if needed
      //     })
      //   });
      // },
    });
    map.addControl(searchControl);

    return () => map.removeControl(searchControl);
  }, [map]);

  return null;
}

function RoutingControl({ isRoutingEnabled }) {
  const map = useMap();

  useEffect(() => {
    let control;
    if (map && isRoutingEnabled) {
      control = L.Routing.control({
        waypoints: [],
        routeWhileDragging: true,
        draggableWaypoints: true,
        removeWaypoints: true,
        geocoder: L.Control.Geocoder.nominatim(),
        createMarker: function(i, waypoint, n) {
          return L.marker(waypoint.latLng, {
            icon: L.icon({
              iconUrl: '../pin.svg',
              iconSize: [25, 25], 
              iconAnchor: [14, 20],
            })
          });
        }
      }).addTo(map);
        const routingControlElement = control.getContainer();
        if (routingControlElement) {
          routingControlElement.classList.add('absolute', 'top-16');
        }

      return () => {
        if (map && control) {
          map.removeControl(control);
        }
      };
    }
  }, [map, isRoutingEnabled]);

  return null;
}

function ZoomControl() {
  const map = useMap();

  useEffect(() => {
    const zoomControl = L.control.zoom({ position: 'bottomleft' }).addTo(map);

    return () => {
      map.removeControl(zoomControl);
    };
  }, [map]);

  return null;
}

function MultipleUserMap() {
  const status = useSelector(state => state.auth.status);
  const userData = useSelector(state => state.auth.userData);

  const [isLocationStored,setLocationStored]=useState(false);
  const [users, setUsers] = useState([]);
  const [position,setPosition]=useState([]);
  const defaultPosition = [27.68167, 84.43007]; // Default location for Bharatpur
  const [isRoutingEnabled, setIsRoutingEnabled] = useState(false);
  const markerRefs = useRef({}); // To store references to user markers
  const mapRef = useRef(null); // To store reference to the map
  // const [showLocation, setShowLocation] = useState(false);
  const [speed, setSpeed] = useState(0);
  const [previousPositions, setPreviousPositions] = useState({});
  const [angles, setAngles] = useState({}); // Store angles for each user


  useEffect(() => {
    const fetchUserLocation = async () => {
      console.log("fetching.........");
      const data = await service.fetchUserLocation();
      console.log(data);
      const userLocations = data.documents.map((doc) => ({
        userId: doc.userId,
        position: [doc.latitude, doc.longitude],
        heading:doc.heading,
        Speed:doc.Speed,
      }));
      console.log(userLocations);
      const validUserLocations = userLocations.filter(user => user.position[0] !== null);
      setUsers(validUserLocations);
    }
   console.log("fetxherd users",users);
   
    fetchUserLocation(); // Initial fetch

    const intervalId = setInterval(fetchUserLocation, 3000); // Fetch every 5 seconds
  
    return () => clearInterval(intervalId); // Clean up on component unmount
  }, []);

  // useEffect(() => {
  //   let intervalId;
  
  //   if (navigator.geolocation) {
  //     intervalId = setInterval(() => {
  //       navigator.geolocation.getCurrentPosition(
  //         (position) => {
  //           const { latitude, longitude } = position.coords;
  //           setPosition([latitude, longitude]);
  //           console.log(`Updated position: Latitude ${latitude}, Longitude ${longitude}`);
  //         },
  //         (error) => {
  //           console.error('Error occurred while retrieving location:', error);
  //         },
  //         { enableHighAccuracy: true }
  //       );
  //     }, 3000); // Runs every 10 seconds
  //   }
  
  //   return () => {
  //     clearInterval(intervalId);
  //   };
  // }, []);



  useEffect(() => {
    let geoId;
  
    if (navigator.geolocation) {
      geoId = navigator.geolocation.watchPosition(
        (position) => {
          const { latitude, longitude, heading, speed } = position.coords;
          // Update the position state every time the user moves
          setPosition([latitude, longitude]);
          
        },
        (error) => {
          console.error('Error occurred while retrieving location:', error);
        },
        { enableHighAccuracy: true }
      );
    } else {
      console.error('Geolocation is not supported by this browser.');
    }
  
    // Cleanup on component unmount
    return () => {
      if (geoId) {
        navigator.geolocation.clearWatch(geoId);
      }
    };
  }, [position]);




  useEffect(() => {
    if (status) {
      const storeLocationInterval = setInterval(() => {
        if (!isLocationStored && position.length > 0) {
          const storeLoc = async () => {
            setLocationStored(true); // Prevent storing multiple locations at once
            console.log('Storing location...');
            try {
              await service.storeUserLocation({
                userId: userData.$id,
                name: userData.name,
                latitude: position[0],
                longitude: position[1],
                heading: position.heading || 0,
                Speed: position.Speed || 0, // Add speed if available
              });
              console.log('Location stored successfully');
            } catch (error) {
              console.error('Error storing location:', error);
            }
            setLocationStored(false); // Reset the flag
          };
          storeLoc();
        }
      }, 5000); // Store location every 5 seconds
  
      // Clear interval when the component unmounts
      return () => clearInterval(storeLocationInterval);
    }
  }, []);

//   useEffect(() => {
//     if(status){
//     if (navigator.geolocation) {
//       console.log("hey");
//       const geoId = navigator.geolocation.watchPosition(
//         (position) => {
//           const { latitude, longitude,heading,speed } = position.coords;
 
//            if(!isLocationStored){
//          const storeLoc=async()=>{ 
//           setLocationStored(true);
//           console.log("storing location");
//           const data=await service.storeUserLocation({userId:userData.$id,name:userData.name,latitude,longitude,heading,Speed:speed});
//           console.log("performing storing in database",data);
//           setLocationStored(false);        
//         }          
//           storeLoc();
//       }         
//         },
//         (error) => {
//           console.error('Error occurred while retrieving location:', error);
//         },
//         { enableHighAccuracy: true }
//       ); 
//       return () => {
//         navigator.geolocation.clearWatch(geoId);
//       };
//     } else {
//       console.error('Geolocation is not supported by this browser.');
//     }
// }
//   }, [position]);
  
  const toggleRouting = () => {
    setIsRoutingEnabled((prevState) => !prevState);
  };
  useEffect(() => {
    if (users.length > 0) {

      setPreviousPositions(prev => {
        const newPos = {};
        users.forEach(user => {
          newPos[user.userId] = user.position;
        });
        return newPos;
      });

      setAngles(prevAngles => {
        const newAngles = {};
        users.forEach(user => {
          const prevPos = previousPositions[user.userId];       
          const newPos = user.position;   
          const angle = prevPos ? calculateAngle(prevPos, newPos) : 0;
          newAngles[user.userId] = angle;
        });
        return newAngles;
      });
    }
  }, [users]);
 // console.log("position previous of multiple user",previousPositions);

  const calculateAngle = (prevPos, newPos) => {
    const [lat1, lon1] = prevPos;
    const [lat2, lon2] = newPos;
    const deltaLon = lon2 - lon1;
    const y = Math.sin(deltaLon) * Math.cos(lat2);
    const x = Math.cos(lat1) * Math.sin(lat2) - Math.sin(lat1) * Math.cos(lat2) * Math.cos(deltaLon);
    const angle = Math.atan2(y, x) * (180 / Math.PI);
    return (angle + 360) % 360; // Normalize to 0-360 degrees
  };
  // console.log("multiple angles ......",angles);

  return (
    <div className='h-[90vh] w-full relative flex flex-col items-center mt-[58px]'>
      <MapContainer
        center={defaultPosition}
        zoom={10}
        style={{ height: "100%", width: "100%" }}
        maxZoom={18}
        minZoom={7.5}
        maxBounds={nepalBounds}
        maxBoundsViscosity={0.8}
        zoomControl={false}
        whenCreated={(map) => { mapRef.current = map; }}
      >
        <LayerControl />
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

{users.map(user => {
 
          if (user.position[0]==null) {
            console.error(`Invalid position for user: ${user.userId}`, user.position);
            return null;
          }

          // Calculate the angle of rotation
        //  const angle = angles[user.userId] || 0;
        const angle=user.heading || 0;
// console.log("angle is ......",angle);

const isCurrentUser = userData && user.userId === userData.$id;
const iconSrc = isCurrentUser ? 'navigator.svg' : 'bus.png';
          return (

            <Marker
            key={user.userId}
            position={user.position}
            icon={new L.divIcon({
             // html: `<img src="${iconSrc}" style="transform: rotate(${angles[user.userId]}deg);/>`,
            //  html: `<img src="bus.png" style="transform: rotate(${angle}deg);/>`,

            // iconUrl:"bus.png",
            //   iconSize: [25, 45],
            //   iconAnchor: [17, 46],
            //   popupAnchor: [3, -46],
            html: `<div style="transform: rotate(${angle}deg) transition: transform 0.5s ease;">
            <img src="${iconSrc}" style="width: 15px; height: 25px;" alt="Bus Icon"/>
          </div>`,
              className: "leaflet-marker-icon",
            })}
            ref={(marker) => { markerRefs.current[user.userId] = marker; }}
          >
            <Popup>
              <div className='flex flex-col items-center'>
                BusNo:
                {/* <Speedometer speed={speed} /> */}
                speed:{user.Speed}

              </div>
            </Popup>
          </Marker>
          );
        })}
        {!status && <CurrentUser/>}
        <SearchControl />
        <RoutingControl isRoutingEnabled={isRoutingEnabled} />
        <ZoomControl />
        <ContextMenu />
      </MapContainer>
      <button 
        className="absolute top-[10px] right-[10px] z-[1600] bg-white border-2 border-gray-400 rounded-md w-[46px] h-11 scale-[0.9] lg:scale-[1]" 
        onClick={toggleRouting}
      >
        <img src="../route-icon.png" className='absolute left-[6px] top-1 w-15 h-8' alt="Routing Icon" />
      </button>
      {/* <LowerSlideBar /> */}
    </div>
  );
}

export default MultipleUserMap;
