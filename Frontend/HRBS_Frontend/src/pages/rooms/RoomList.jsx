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
    <div className="p-6">

      <h2 className="text-2xl font-bold mb-6">Available Rooms</h2>

      {/* Price Filter */}
      <form onSubmit={handleFilter} className="mb-8 flex gap-3">
        <input
          type="number"
          placeholder="Max Price"
          className="border p-3 w-40 rounded-lg"
          value={maxPrice}
          onChange={(e) => setMaxPrice(e.target.value)}
        />
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-lg transition">
          Filter
        </button>
      </form>

      {/* Rooms Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {rooms.map((room) => (
          <RoomCard key={room.id} room={room} navigate={navigate} />
        ))}
      </div>

      {rooms.length === 0 && (
        <p className="text-gray-500 text-center mt-10">
          No rooms available.
        </p>
      )}
    </div>
  );
}

export default RoomList;



// 🔥 Separate Room Card Component With Auto Slide
function RoomCard({ room, navigate }) {
  const [currentIndex, setCurrentIndex] = useState(0);

const images = room.images?.length
  ? room.images.map(img => img.image)
  : ["https://via.placeholder.com/400x300?text=No+Image"];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) =>
        prev === images.length - 1 ? 0 : prev + 1
      );
    }, 3000); // 3 seconds auto slide

    return () => clearInterval(interval);
  }, [images.length]);

  return (
    <div className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-2xl transition duration-300 flex flex-col">

      {/* Image Slider */}
      <div className="h-52 w-full overflow-hidden relative">
        <img
          src={images[currentIndex]}
          alt="Room"
          className="w-full h-full object-cover transition duration-500"
        />
      </div>

      {/* Room Info */}
      <div className="p-5 flex flex-col flex-grow">
        <h3 className="text-lg font-bold">
          Room {room.room_number}
        </h3>

        <p className="text-gray-600 mt-1">
          Type: {room.room_type}
        </p>

        <p className="text-blue-600 font-semibold mt-2">
          ₹ {room.price_per_night} / night
        </p>

        <button
          onClick={() => navigate(`/book-room/${room.id}`)}
          className="mt-auto bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition"
        >
          Book Now
        </button>
      </div>
    </div>
  );
}