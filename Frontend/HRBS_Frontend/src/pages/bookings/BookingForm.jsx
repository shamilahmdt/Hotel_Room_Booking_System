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
  const [currentIndex, setCurrentIndex] = useState(0);

  // ===============================
  // Fetch Room Details
  // ===============================
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

  // ===============================
  // Prepare Image List
  // ===============================
  const images = room?.images?.length
    ? room.images.map((img) => img.image)
    : ["https://via.placeholder.com/600x400?text=No+Image"];

  // ===============================
  // Auto Slide Effect
  // ===============================
  useEffect(() => {
    if (!room || images.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) =>
        prev === images.length - 1 ? 0 : prev + 1
      );
    }, 3000);

    return () => clearInterval(interval);
  }, [room, images.length]);

  const nextSlide = () => {
    setCurrentIndex((prev) =>
      prev === images.length - 1 ? 0 : prev + 1
    );
  };

  const prevSlide = () => {
    setCurrentIndex((prev) =>
      prev === 0 ? images.length - 1 : prev - 1
    );
  };

  // ===============================
  // Form Handlers
  // ===============================
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const calculateNights = () => {
    if (!formData.check_in || !formData.check_out) return 0;
    const diffTime =
      new Date(formData.check_out) - new Date(formData.check_in);
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
      navigate("/bookings");

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

  // ===============================
  // UI
  // ===============================
  return (
    <div className="max-w-2xl mx-auto p-6 bg-white shadow-xl rounded-2xl mt-6">

      {/* ===============================
          Image Slider
      =============================== */}
      <div className="relative h-60 mb-6 overflow-hidden rounded-xl">
        <img
          src={images[currentIndex]}
          alt="Room"
          className="w-full h-full object-cover transition duration-500"
        />

        {images.length > 1 && (
          <>
            {/* Left Arrow */}
            <button
              onClick={prevSlide}
              className="absolute left-3 top-1/2 -translate-y-1/2 bg-black/50 text-white px-3 py-1 rounded-full"
            >
              ‹
            </button>

            {/* Right Arrow */}
            <button
              onClick={nextSlide}
              className="absolute right-3 top-1/2 -translate-y-1/2 bg-black/50 text-white px-3 py-1 rounded-full"
            >
              ›
            </button>

            {/* Dots */}
            <div className="absolute bottom-3 w-full flex justify-center gap-2">
              {images.map((_, index) => (
                <div
                  key={index}
                  className={`h-2 w-2 rounded-full ${
                    index === currentIndex
                      ? "bg-white"
                      : "bg-white/50"
                  }`}
                />
              ))}
            </div>
          </>
        )}
      </div>

      {/* ===============================
          Room Info
      =============================== */}
      <h2 className="text-2xl font-bold mb-2">
        Book Room {room.room_number}
      </h2>

      <p className="mb-4 text-gray-700">
        Price per night: ₹ {roomPrice.toLocaleString()}
      </p>

      {/* ===============================
          Booking Form
      =============================== */}
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
            className="w-full border p-2 rounded-lg"
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
            className="w-full border p-2 rounded-lg"
          />
        </div>

        <div className="bg-gray-100 p-4 rounded-lg">
          <p>Nights: {calculateNights()}</p>
          <p className="font-semibold text-lg">
            Total: ₹ {calculateTotal().toLocaleString()}
          </p>
        </div>

        {error && (
          <p className="text-red-600 text-sm">{error}</p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition"
        >
          {loading ? "Processing..." : "Confirm Booking"}
        </button>
      </form>
    </div>
  );
}

export default BookingForm;