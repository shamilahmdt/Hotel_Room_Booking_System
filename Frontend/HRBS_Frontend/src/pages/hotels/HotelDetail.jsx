import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { hotelsAPI } from "../../api/hotelsAPI";
import RoomList from "../rooms/RoomList";

function HotelDetail() {
  const { id } = useParams();
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
    <div className="p-6">
      <div className="bg-white p-6 rounded-2xl shadow mb-6">
        <h1 className="text-2xl font-bold text-blue-700">
          {hotel.name}
        </h1>

        <p className="text-gray-500">{hotel.location}</p>

        <p className="mt-3 text-gray-600">
          {hotel.amenities}
        </p>
      </div>

      {/* Pass correct hotel id to RoomList */}
      <RoomList hotelId={hotel.id} />
    </div>
  );
}

export default HotelDetail;