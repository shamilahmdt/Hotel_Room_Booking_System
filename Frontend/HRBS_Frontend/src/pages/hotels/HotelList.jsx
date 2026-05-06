import { useEffect, useState, useContext } from "react";
import { hotelsAPI } from "../../api/hotelsAPI";
import { Link } from "react-router-dom";
import { HiOutlineHeart, HiHeart } from "react-icons/hi";
import { FavoritesContext } from "../../context/FavoritesContext";

function HotelList() {
  const { isHotelFavorite, toggleFavoriteHotel, favorites } = useContext(FavoritesContext);
  const [hotels, setHotels] = useState([]);
  const [search, setSearch] = useState("");

  const fetchHotels = async () => {
    try {
      const response = await hotelsAPI.list({
        location: search,
      });
      setHotels(response.data.data || response.data);
    } catch (error) {
      console.error("Error fetching hotels:", error);
    }
  };

  useEffect(() => {
    fetchHotels();
  }, []);

  // Sort: Favorites first. 
  // Requirement: "if i put heart for a room the hotel also show"
  // We'll treat a hotel as prioritized if it's explicitly favorited OR if any of its rooms (in the favorites list) belong to it.
  // Note: The hotel object from the API doesn't list its rooms here, but we can check if the hotel ID is in the "favorited hotels" list.
  // The user also mentioned: "if i put heart for a room the hotel also show" - this might mean in the Favorites page.
  // But in the main list, we'll sort explicitly favorited hotels first.
  
  const filteredHotels = Array.isArray(hotels) ? [...hotels].filter(hotel => 
    hotel.name.toLowerCase().includes(search.toLowerCase()) || 
    hotel.location.toLowerCase().includes(search.toLowerCase())
  ).sort((a, b) => {
     const aFav = isHotelFavorite(a.id);
     const bFav = isHotelFavorite(b.id);
     return bFav - aFav; // True (1) before False (0)
  }) : [];

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      
      {/* Header Section */}
      <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl font-bold text-slate-900 mb-2 tracking-tight">Discover Hotels</h1>
          <p className="text-slate-500 text-lg font-medium">Explore the best rooms for your next stay.</p>
        </div>
        
        {/* Search Bar */}
        <div className="relative w-full md:w-96">
          <input
            type="text"
            placeholder="Search by name or location..."
            className="w-full bg-white border border-slate-200 px-6 py-4 rounded-xl focus:ring-2 focus:ring-blue-600 transition-all outline-none text-slate-700 font-medium"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Hotels Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredHotels.length > 0 ? (
          filteredHotels.map((hotel) => (
            <div 
              key={hotel.id} 
              className="group bg-white rounded-xl shadow-sm border border-slate-100 flex flex-col overflow-hidden hover:shadow-md transition-shadow"
            >
              {/* Hotel Image Container - Flush with top */}
              <div className="relative h-56 w-full overflow-hidden bg-slate-100">
                {hotel.image ? (
                  <img
                    src={hotel.image}
                    alt={hotel.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-slate-300 bg-slate-50">
                     <span className="text-5xl">🏨</span>
                  </div>
                )}
                {/* Heart Icon Overlay */}
                <button 
                  onClick={() => toggleFavoriteHotel(hotel.id)}
                  className={`absolute top-4 right-4 transition-all drop-shadow-md hover:scale-110 active:scale-90 ${isHotelFavorite(hotel.id) ? "text-red-500" : "text-white hover:text-red-400"}`}
                >
                   {isHotelFavorite(hotel.id) ? <HiHeart className="text-3xl" /> : <HiOutlineHeart className="text-3xl stroke-2" />}
                </button>
              </div>

              {/* Content Section */}
              <div className="p-5 flex flex-col flex-grow">
                <h2 className="text-xl font-bold text-slate-800 mb-1 leading-tight">
                  {hotel.name}
                </h2>
                
                <div className="flex items-center gap-1 text-slate-400 mb-2 text-sm font-medium">
                  📍 {hotel.location}
                </div>

                {/* Amenities as tags */}
                <div className="flex flex-wrap gap-1 mb-4">
                   {hotel.amenities && hotel.amenities.split(',').slice(0, 2).map((amenity, i) => (
                      <span key={i} className="text-[10px] font-bold text-slate-400 uppercase tracking-widest bg-slate-50 px-2 py-0.5 rounded">
                         {amenity.trim()}
                      </span>
                   ))}
                </div>
                
                {/* Footer Section */}
                <div className="mt-auto flex items-center justify-between border-t border-slate-50 pt-4">
                  <div className="text-slate-600 font-medium text-sm">
                    Rooms Available
                  </div>
                  <Link
                    to={`/hotel-detail/${hotel.id}`}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-bold text-sm transition-all shadow-lg"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full py-20 text-center">
             <div className="text-6xl mb-4 text-slate-200">🔍</div>
             <p className="text-slate-400 text-xl font-medium">No hotels found matching your search.</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default HotelList;