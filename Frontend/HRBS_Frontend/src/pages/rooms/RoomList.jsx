import { useEffect, useState, useContext } from "react";
import { roomsAPI } from "../../api/roomsAPI";
import { useNavigate } from "react-router-dom";
import { HiOutlineHeart, HiHeart } from "react-icons/hi";
import { FavoritesContext } from "../../context/FavoritesContext";

function RoomList({ hotelId }) {
  const { isRoomFavorite } = useContext(FavoritesContext);
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

  // Sort: Favorited rooms first
  const sortedRooms = [...rooms].sort((a, b) => {
    const aFav = isRoomFavorite(a.id);
    const bFav = isRoomFavorite(b.id);
    return bFav - aFav;
  });

  return (
    <div className="py-10">
      <div className="flex items-center justify-between mb-10">
         <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Available Rooms</h2>
         <div className="h-px flex-grow mx-8 bg-slate-200 hidden md:block"></div>
      </div>

      {/* Rooms Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {sortedRooms.map((room) => (
          <RoomCard key={room.id} room={room} navigate={navigate} />
        ))}
      </div>

      {rooms.length === 0 && (
        <div className="py-20 text-center bg-slate-50 rounded-xl border border-dashed border-slate-200">
          <p className="text-slate-400 text-xl font-medium">No rooms available at the moment.</p>
        </div>
      )}
    </div>
  );
}

// 🔥 Real Data + Screenshot Layout Room Card
function RoomCard({ room, navigate }) {
  const { isRoomFavorite, toggleFavoriteRoom, toggleFavoriteHotel } = useContext(FavoritesContext);
  const [currentIndex, setCurrentIndex] = useState(0);

  const images = room.images?.length
    ? room.images.map(img => img.image)
    : ["https://images.unsplash.com/photo-1611892440504-42a792e24d32?auto=format&fit=crop&q=80&w=800"];

  useEffect(() => {
    if (images.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
    }, 4000);
    return () => clearInterval(interval);
  }, [images.length]);

  const handleToggleFavorite = (e) => {
    e.stopPropagation();
    toggleFavoriteRoom(room.id);
    
    // Logic: "if i put heart for a room the hotel also show"
    // We automatically favorite the hotel if a room is favorited, OR we can handle this in the context.
    // Let's explicitly favorite the hotel too so it shows up in favorites.
    if (!isRoomFavorite(room.id)) {
       toggleFavoriteHotel(room.hotel); // room.hotel is the hotel ID in this model
    }
  };

  return (
    <div className="group bg-white rounded-xl shadow-sm border border-slate-100 flex flex-col overflow-hidden hover:shadow-md transition-shadow">
      {/* Image Slider Section - Flush with top */}
      <div className="h-56 w-full overflow-hidden relative bg-slate-100">
        <img
          src={images[currentIndex]}
          alt="Room"
          className="w-full h-full object-cover transition-all duration-1000 group-hover:scale-105"
        />
        
        {/* Heart Icon Overlay */}
        <button 
          onClick={handleToggleFavorite}
          className={`absolute top-4 right-4 transition-all drop-shadow-md hover:scale-110 active:scale-90 ${isRoomFavorite(room.id) ? "text-red-500" : "text-white hover:text-red-400"}`}
        >
           {isRoomFavorite(room.id) ? <HiHeart className="text-3xl" /> : <HiOutlineHeart className="text-3xl stroke-2" />}
        </button>

        {/* Slide Indicators */}
        {images.length > 1 && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5">
            {images.map((_, i) => (
              <div 
                key={i} 
                className={`h-1.5 rounded-full transition-all duration-500 ${i === currentIndex ? "w-6 bg-white" : "w-1.5 bg-white/40"}`}
              />
            ))}
          </div>
        )}
      </div>

      {/* Room Details Section */}
      <div className="p-5 flex flex-col flex-grow">
        <div className="flex justify-between items-center mb-1">
           <h3 className="text-xl font-bold text-slate-800 leading-tight">
             Room {room.room_number}
           </h3>
           <span className="text-[10px] font-bold bg-blue-50 text-blue-600 px-2 py-0.5 rounded uppercase">
              {room.room_type}
           </span>
        </div>

        <p className="text-sm font-medium text-slate-400 mb-6">
           Capacity: {room.capacity} Persons
        </p>

        {/* Footer Section */}
        <div className="mt-auto flex items-center justify-between border-t border-slate-50 pt-4">
          <div className="text-slate-600 font-medium text-sm">
            Rate <span className="text-slate-900 font-bold ml-1">₹{room.price_per_night} / night</span>
          </div>
          <button
            onClick={() => navigate(`/book-room/${room.id}`)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-bold text-sm transition-all shadow-lg"
          >
            Book Now
          </button>
        </div>
      </div>
    </div>
  );
}

export default RoomList;