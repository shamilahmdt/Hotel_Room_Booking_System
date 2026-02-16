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
      console.log(error);
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
      console.log(error);
    }
  };

  const getStatusStyle = (status) => {
  switch (status) {
    case "confirmed":
      return "bg-green-100 text-green-700";
    case "cancelled":
      return "bg-red-100 text-red-700";
    default:
      return "bg-yellow-100 text-yellow-700";
  }
  };

  if (loading) {
    return (
      <div className="flex justify-center mt-10">
        <div className="h-10 w-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">My Bookings</h1>

      <div className="grid gap-6">
        {bookings.map((booking) => (
          <div
            key={booking.id}
            className="bg-white p-6 rounded-2xl shadow hover:shadow-xl transition"
          >
            <div className="flex justify-between items-center">
              <div>
                <p className="font-semibold text-lg">
                  Room {booking.room}
                </p>
                <p className="text-gray-500">
                  {booking.check_in} → {booking.check_out}
                </p>
              </div>

              <span
                className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusStyle(
                  booking.status
                )}`}
              >
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