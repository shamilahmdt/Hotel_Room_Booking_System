import { useEffect, useState, useContext } from "react";
import { hotelsAPI } from "../../api/hotelsAPI";
import { Link } from "react-router-dom";
import { HiOutlineHeart, HiHeart, HiArrowLeft } from "react-icons/hi";
import { FavoritesContext } from "../../context/FavoritesContext";

function Favorites() {
  const { isHotelFavorite, toggleFavoriteHotel, favorites } = useContext(FavoritesContext);
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHotels = async () => {
      try {
        const response = await hotelsAPI.list();
        setHotels(response.data.data || response.data);
      } catch (error) {
        console.error("Error fetching hotels:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchHotels();
  }, []);

  const favoritedHotels = hotels.filter(hotel => isHotelFavorite(hotel.id));

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      
      {/* Header */}
      <div className="mb-12">
        <h1 className="text-4xl font-bold text-slate-900 mb-2 tracking-tight flex items-center gap-3">
           My Favorites
        </h1>
        <p className="text-slate-500 text-lg font-medium">Your saved hotels and rooms are kept here.</p>
      </div>

      {loading ? (
        <div className="py-20 text-center">
           <div className="animate-spin text-4xl">⌛</div>
        </div>
      ) : favoritedHotels.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {favoritedHotels.map((hotel) => (
            <div 
              key={hotel.id} 
              className="group bg-white rounded-xl shadow-sm border border-slate-100 flex flex-col overflow-hidden hover:shadow-md transition-shadow"
            >
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
                <button 
                  onClick={() => toggleFavoriteHotel(hotel.id)}
                  className="absolute top-4 right-4 text-red-500 drop-shadow-md hover:scale-110 active:scale-90 transition-all"
                >
                   <HiHeart className="text-3xl" />
                </button>
              </div>

              <div className="p-5 flex flex-col flex-grow">
                <h2 className="text-xl font-bold text-slate-800 mb-1 leading-tight">
                  {hotel.name}
                </h2>
                <div className="flex items-center gap-1 text-slate-400 mb-4 text-sm font-medium">
                  📍 {hotel.location}
                </div>
                
                <div className="mt-auto flex items-center justify-between border-t border-slate-50 pt-4">
                  <div className="text-slate-400 text-xs font-bold uppercase tracking-widest">
                    Favorited
                  </div>
                  <Link
                    to={`/hotel-detail/${hotel.id}`}
                    className="bg-slate-900 hover:bg-blue-600 text-white px-6 py-2 rounded-lg font-bold text-sm transition-all"
                  >
                    View
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="py-24 text-center bg-white rounded-2xl border-2 border-dashed border-slate-100">
           <div className="text-7xl mb-6 grayscale opacity-20">❤️</div>
           <h2 className="text-2xl font-bold text-slate-900 mb-2">No favorites yet</h2>
           <p className="text-slate-400 mb-8 max-w-sm mx-auto">Start exploring hotels and tap the heart icon to save them to this list.</p>
           <Link 
             to="/dashboard" 
             className="inline-flex items-center gap-2 bg-blue-600 text-white px-8 py-4 rounded-xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/20"
           >
             <HiArrowLeft /> Browse Hotels
           </Link>
        </div>
      )}
    </div>
  );
}

export default Favorites;
