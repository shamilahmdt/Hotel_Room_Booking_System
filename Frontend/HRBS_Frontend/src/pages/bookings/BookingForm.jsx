import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import baseAPI from "../../api/baseAPI";
import { bookingAPI } from "../../api/bookingAPI";

function BookingForm() {
  const { roomId } = useParams();
  const navigate = useNavigate();

  const [roomPrice, setRoomPrice] = useState(0);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const [formData, setFormData] = useState({
    check_in: "",
    check_out: "",
  });

  // 🔹 Fetch room price
  useEffect(() => {
    const fetchRoom = async () => {
      try {
        const res = await baseAPI.get(`rooms/${roomId}/`);
        setRoomPrice(res.data.price);
      } catch (error) {
        console.log("Error fetching room:", error);
      }
    };

    fetchRoom();
  }, [roomId]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // 🔹 Calculate Nights
  const calculateNights = () => {
    if (!formData.check_in || !formData.check_out) return 0;

    const start = new Date(formData.check_in);
    const end = new Date(formData.check_out);

    const diffTime = end - start;
    const diffDays = diffTime / (1000 * 60 * 60 * 24);

    return diffDays > 0 ? diffDays : 0;
  };

  // 🔹 Calculate Total
  const calculateTotal = () => {
    return calculateNights() * roomPrice;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const checkIn = new Date(formData.check_in);
    const checkOut = new Date(formData.check_out);

    if (checkOut <= checkIn) {
      alert("Check-out must be after check-in");
      return;
    }

    setLoading(true);

    try {
      await bookingAPI.create({
        room: roomId,
        check_in: formData.check_in,
        check_out: formData.check_out,
      });

      setShowModal(true);
    } catch (error) {
      console.log("Booking failed:", error);
      alert("Booking failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="bg-white p-6 rounded-2xl shadow max-w-lg mx-auto">
        <h2 className="text-2xl font-bold mb-6 text-blue-700">
          Book Room
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Check-in */}
          <input
            type="date"
            name="check_in"
            min={new Date().toISOString().split("T")[0]}
            value={formData.check_in}
            onChange={handleChange}
            className="w-full border p-2 rounded"
            required
          />

          {/* Check-out */}
          <input
            type="date"
            name="check_out"
            value={formData.check_out}
            onChange={handleChange}
            className="w-full border p-2 rounded"
            required
          />

          {/* Nights + Price */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-gray-600">
              Price per Night: ₹ {roomPrice}
            </p>

            <p className="text-gray-600">
              Nights: {calculateNights()}
            </p>

            <p className="text-lg font-semibold text-blue-700">
              Total: ₹ {calculateTotal()}
            </p>
          </div>

          {/* Submit Button */}
          <button
            disabled={loading}
            className="w-full bg-green-600 text-white py-2 rounded flex justify-center items-center"
          >
            {loading ? (
              <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              "Confirm Booking"
            )}
          </button>
        </form>
      </div>

      {/* Success Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center">
          <div className="bg-white p-6 rounded-2xl shadow-xl text-center w-96">
            <h2 className="text-xl font-bold mb-4 text-green-600">
              Booking Successful 🎉
            </h2>

            <button
              onClick={() => navigate("/bookings")}
              className="bg-blue-600 text-white px-4 py-2 rounded"
            >
              View My Bookings
            </button>
          </div>
        </div>
      )}
    </>
  );
}

export default BookingForm;