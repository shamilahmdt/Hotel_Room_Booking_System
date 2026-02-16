import { useEffect, useState } from "react";
import { roomsAPI } from "../../api/roomsAPI";
import { useNavigate } from "react-router-dom";

function RoomList({ hotelId }) {

  const navigate = useNavigate();  

  const [rooms, setRooms] = useState([]);
  const [maxPrice, setMaxPrice] = useState("");

  const fetchRooms = async () => {
    try {
      const response = await roomsAPI.list(hotelId, {
        price_lte: maxPrice,
      });
      setRooms(response.data.data || response.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchRooms();
  }, [hotelId]);

  const handleFilter = (e) => {
    e.preventDefault();
    fetchRooms();
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Available Rooms</h2>

      {/* Price Filter */}
      <form onSubmit={handleFilter} className="mb-6 flex gap-3">
        <input
          type="number"
          placeholder="Max Price"
          className="border p-2 w-40"
          value={maxPrice}
          onChange={(e) => setMaxPrice(e.target.value)}
        />
        <button className="bg-blue-600 text-white px-4 py-2 rounded">
          Filter
        </button>
      </form>

      {/* Rooms Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {rooms.map((room) => (
          <div
            key={room.id}
            className="bg-white p-4 rounded-2xl shadow hover:shadow-xl transition"
          >
            <h3 className="text-lg font-bold">
              Room {room.room_number}
            </h3>

            <p className="text-gray-600">
              Type: {room.room_type}
            </p>

            <p className="text-blue-600 font-semibold mt-2">
              ₹ {room.price} / night
            </p>

            <button
            onClick={() => navigate(`/book-room/${room.id}`)}
            className="mt-4 bg-green-600 text-white px-4 py-2 rounded"
            >
            Book Now
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default RoomList;