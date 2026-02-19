import { useEffect, useState } from "react";
import { hotelsAPI } from "../../api/hotelsAPI";
import { useNavigate } from "react-router-dom";

function HotelList() {
  const navigate = useNavigate();
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

  const handleSearch = (e) => {
    e.preventDefault();
    fetchHotels();
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      
      {/* Search */}
      <form
        onSubmit={handleSearch}
        className="mb-8 flex flex-col sm:flex-row gap-3 justify-center"
      >
        <input
          type="text"
          placeholder="Search by location..."
          className="border p-3 w-full sm:w-80 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition">
          Search
        </button>
      </form>

      {/* Hotels Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {hotels.map((hotel) => (
          <div
            key={hotel.id}
            className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-2xl transition duration-300 flex flex-col"
          >
            {/* Hotel Image */}
            <div className="h-52 w-full overflow-hidden">
              <img
                src={
                  hotel.image
                    ? hotel.image
                    : "https://via.placeholder.com/400x300?text=No+Image"
                }
                alt={hotel.name}
                className="w-full h-full object-cover hover:scale-105 transition duration-300"
              />
            </div>

            {/* Hotel Info */}
            <div className="p-5 flex flex-col flex-grow">
              <h2 className="text-xl font-bold text-blue-700">
                {hotel.name}
              </h2>

              <p className="text-gray-500 mt-1">
                📍 {hotel.location}
              </p>

              <p className="text-sm mt-3 text-gray-600 line-clamp-3">
                {hotel.amenities}
              </p>

              <button
                onClick={() => navigate(`/hotel-detail/${hotel.id}`)}
                className="mt-auto bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition"
              >
                View Rooms
              </button>
            </div>
          </div>
        ))}
      </div>

      {hotels.length === 0 && (
        <p className="text-center text-gray-500 mt-10">
          No hotels found.
        </p>
      )}
    </div>
  );
}

export default HotelList;