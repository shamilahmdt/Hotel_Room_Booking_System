import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { roomsAPI } from "../../api/roomsAPI";
import { bookingAPI } from "../../api/bookingAPI";

function BookingForm() {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const today = new Date().toISOString().split("T")[0];

  const [room, setRoom] = useState(null);
  const [roomPrice, setRoomPrice] = useState(0);
  const [formData, setFormData] = useState({ check_in: "", check_out: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Fetch room details
  useEffect(() => {
    const fetchRoom = async () => {
      try {
        const res = await roomsAPI.detail(roomId);
        const roomData = res.data.data || res.data;
        setRoom(roomData);
        setRoomPrice(Number(roomData.price_per_night));
      } catch (err) {
        console.error(err);
        setError("Failed to load room details.");
      }
    };
    fetchRoom();
  }, [roomId]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const calculateNights = () => {
    if (!formData.check_in || !formData.check_out) return 0;
    const diffTime = new Date(formData.check_out) - new Date(formData.check_in);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 0;
  };

  const calculateTotal = () => calculateNights() * roomPrice;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (calculateNights() <= 0) {
      setError("Check-out must be after check-in.");
      return;
    }

    try {
      setLoading(true);

      await bookingAPI.create({
        room: roomId,
        check_in: formData.check_in,
        check_out: formData.check_out,
      });

      alert("Booking created successfully!");
      navigate("/bookings"); // Redirect to BookingHistory

    } catch (err) {
      console.error(err);
      if (err.response && err.response.data) {
        const data = err.response.data;
        setError(
          data.detail || data.non_field_errors?.[0] || JSON.stringify(data)
        );
      } else {
        setError("Booking failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  if (!room) return <p className="p-4">Loading room details...</p>;

  return (
    <div className="max-w-xl mx-auto p-6 bg-white shadow rounded mt-6">
      <h2 className="text-2xl font-bold mb-4">Book Room {room.room_number}</h2>
      <p className="mb-3 text-gray-700">Price per night: ₹ {roomPrice.toLocaleString()}</p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1">Check In</label>
          <input
            type="date"
            name="check_in"
            min={today}
            value={formData.check_in}
            onChange={handleChange}
            required
            className="w-full border p-2 rounded"
          />
        </div>

        <div>
          <label className="block mb-1">Check Out</label>
          <input
            type="date"
            name="check_out"
            min={formData.check_in || today}
            value={formData.check_out}
            onChange={handleChange}
            required
            className="w-full border p-2 rounded"
          />
        </div>

        <div className="bg-gray-100 p-3 rounded">
          <p>Nights: {calculateNights()}</p>
          <p className="font-semibold">Total: ₹ {calculateTotal().toLocaleString()}</p>
        </div>

        {error && <p className="text-red-600 text-sm">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          {loading ? "Processing..." : "Confirm Booking"}
        </button>
      </form>
    </div>
  );
}

export default BookingForm;