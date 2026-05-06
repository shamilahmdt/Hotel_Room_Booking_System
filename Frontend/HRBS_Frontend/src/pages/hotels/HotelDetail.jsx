import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { hotelsAPI } from "../../api/hotelsAPI";
import { HiArrowNarrowLeft } from "react-icons/hi";
import RoomList from "../rooms/RoomList";

function HotelDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [hotel, setHotel] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHotel = async () => {
      try {
        const response = await hotelsAPI.detail(id);

        // Supports both DRF and normal JSON response
        setHotel(response.data.data || response.data);
      } catch (error) {
        console.error("Error fetching hotel:", error);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchHotel();
    }
  }, [id]);

  if (loading) return <p>Loading...</p>;
  if (!hotel) return <p>Hotel not found.</p>;

  return (
    <div className="max-w-6xl mx-auto">
      {/* Back Button */}
      <button 
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-blue-700 font-bold mb-6 hover:text-blue-800 transition"
      >
        <HiArrowNarrowLeft className="text-2xl" />
        Back
      </button>

      <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 mb-8">
        <h1 className="text-3xl font-extrabold text-gray-900 mb-2">
          {hotel.name}
        </h1>

        <p className="text-blue-600 font-medium mb-4 flex items-center gap-1">
          <span className="text-gray-400">📍</span> {hotel.location}
        </p>

        <div className="prose max-w-none text-gray-600">
          <p>{hotel.amenities}</p>
        </div>
      </div>

      {/* Pass correct hotel id to RoomList */}
      <RoomList hotelId={hotel.id} />
    </div>
  );
}

export default HotelDetail;