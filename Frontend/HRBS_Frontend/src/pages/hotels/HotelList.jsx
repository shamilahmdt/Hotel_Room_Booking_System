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

      // Handles both DRF Response and normal JSON
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
    <div className="p-6">
      {/* Search */}
      <form onSubmit={handleSearch} className="mb-6 flex gap-3">
        <input
          type="text"
          placeholder="Search by location..."
          className="border p-2 w-64"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button className="bg-blue-600 text-white px-4 py-2 rounded">
          Search
        </button>
      </form>

      {/* Hotels Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {hotels.map((hotel) => (
          <div
            key={hotel.id}
            className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition duration-300"
          >
            <h2 className="text-xl font-bold text-blue-700">
              {hotel.name}
            </h2>

            <p className="text-gray-500">{hotel.location}</p>

            <p className="text-sm mt-3 text-gray-600">
              {hotel.amenities}
            </p>

            <button
              onClick={() => navigate(`/hotel-detail/${hotel.id}`)}
              className="mt-4 bg-blue-600 text-white px-4 py-2 rounded"
            >
              View Rooms
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default HotelList;