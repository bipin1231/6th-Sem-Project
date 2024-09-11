import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

function SelectBus() {
  const location = useLocation();
  const navigate = useNavigate();
  const routeName = location.state?.routeName || "No route selected"; // Safely access routeName
  const pricePerSeat = location.state?.pricePerSeat || 0; 

  const handleBusSelection = (busName) => {
    navigate("/bookingpage", { state: { routeName, busName, pricePerSeat } });
  };

  return (
    <>
    <h1 className='mt-[60px] text-center font-semibold lg:font-bold text-lg lg:text-3xl py-2'>
      Select Bus
    </h1>
      <p className="text-center py-1 md:py-3">
        Selected Route: {routeName}
      </p>
      <p className="text-center py-1 md:py-3">
        Price per seat: Rs. {pricePerSeat}/-
      </p>
      <div className="flex justify-center">
        <div className="w-[95%] md:w-[60%] bg-blue-300 rounded-lg p-4 grid gap-y-3">
          <div className="flex items-center gap-3 p-3 bg-blue-200 rounded-lg">
            <h1>Super Express</h1>
            <button className="bg-green-500 px-3 py-2 rounded-lg" onClick={() => handleBusSelection("Super Express")}>
              Book Ticket
            </button>
            <p>
              Total Available Buses: 
              <span className="ml-1 bg-white px-2 py-1 rounded">5</span>
            </p>
          </div>

          <div className="flex items-center gap-3 p-3 bg-blue-200 rounded-lg">
            <h1>Bipin Travels</h1>
            <button className="bg-green-500 px-3 py-2 rounded-lg" onClick={() => handleBusSelection("Bipin Travels")}>
              Book Ticket
            </button>
            <p>
              Total Available Buses: 
              <span className="ml-1 bg-white px-2 py-1 rounded">7</span>
            </p>
          </div>

        </div>
      </div>
    </>
  );
}

export default SelectBus;
