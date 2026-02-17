import { useEffect, useState } from "react";
import { bookingAPI } from "../../api/bookingAPI";

function BookingHistory() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchBookings = async () => {
    try {
      const response = await bookingAPI.list();
      setBookings(response.data.data || response.data);
    } catch (error) {
      console.log("Error fetching bookings:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleCancel = async (id) => {
    try {
      await bookingAPI.cancel(id);
      fetchBookings();
    } catch (error) {
      console.log("Error cancelling booking:", error);
      alert("Failed to cancel booking.");
    }
  };

  const getStatusStyle = (status) => {
    switch (status.toLowerCase()) {
      case "confirmed":
        return "bg-green-100 text-green-700";
      case "cancelled":
        return "bg-red-100 text-red-700";
      default:
        return "bg-yellow-100 text-yellow-700";
    }
  };

  if (loading)
    return (
      <div className="flex justify-center mt-10">
        <div className="h-10 w-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">My Bookings</h1>

      {bookings.length === 0 && <p className="text-gray-500">No bookings yet.</p>}

      <div className="grid gap-6">
        {bookings.map((booking) => (
          <div key={booking.id} className="bg-white p-6 rounded-2xl shadow hover:shadow-xl transition">
            <div className="flex justify-between items-center">
              <div>
                <p className="font-semibold text-lg">
                  Room: {booking.room.room_number || booking.room}
                </p>
                <p className="text-gray-500">
                  {booking.check_in} → {booking.check_out}
                </p>
                <p className="text-gray-700 font-medium mt-2">
                  Total: ₹ {booking.total_price}
                </p>
                {booking.payment && (
                  <p className="text-gray-700 font-medium mt-1">
                    Payment Status: {booking.payment.payment_status}
                  </p>
                )}
              </div>

              <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusStyle(booking.status)}`}>
                {booking.status}
              </span>
            </div>

            {booking.status !== "cancelled" && (
              <button
                onClick={() => handleCancel(booking.id)}
                className="mt-4 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
              >
                Cancel Booking
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default BookingHistory;