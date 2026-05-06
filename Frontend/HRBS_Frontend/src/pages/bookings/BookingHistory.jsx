import { useEffect, useState } from "react";
import { bookingAPI } from "../../api/bookingAPI";
import ConfirmModal from "../../components/ConfirmModal";
import toast from "react-hot-toast";

function BookingHistory() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);

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

  const openCancelModal = (booking) => {
    setSelectedBooking(booking);
    setIsModalOpen(true);
  };

  const handleCancel = async () => {
    if (!selectedBooking) return;
    
    try {
      await bookingAPI.cancel(selectedBooking.id);
      toast.success("Booking cancelled successfully", {
        icon: '🗑️'
      });
      fetchBookings();
    } catch (error) {
      console.error("Error cancelling booking:", error);
      toast.error("Failed to cancel booking. Please try again.");
    } finally {
      setSelectedBooking(null);
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
      <div className="flex justify-center items-center h-screen">
        <div className="h-12 w-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );

  return (
    <div className="max-w-5xl mx-auto p-6 md:p-10">
      <div className="mb-10">
        <h1 className="text-4xl font-bold text-slate-900 mb-2">My Bookings</h1>
        <p className="text-slate-500 font-medium">Manage your reservations and stay history.</p>
      </div>

      {bookings.length === 0 && (
         <div className="py-20 text-center bg-white rounded-3xl border border-dashed border-slate-200">
            <p className="text-slate-400 text-xl font-medium">You haven't made any bookings yet.</p>
         </div>
      )}

      <div className="grid gap-6">
        {bookings.map((booking) => (
          <div key={booking.id} className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
            <div className="flex flex-col md:flex-row justify-between md:items-center gap-6">
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                   <span className="text-2xl">🏨</span>
                   <div>
                      <h3 className="text-xl font-bold text-slate-800">
                        {booking.hotel_name || "Hotel Room"}
                      </h3>
                      <p className="text-slate-400 font-bold text-xs uppercase tracking-widest">
                        Room {booking.room.room_number || booking.room}
                      </p>
                   </div>
                </div>
                
                <div className="flex items-center gap-4 text-slate-500 font-medium">
                   <div className="flex items-center gap-2">
                      <span>📅</span> {booking.check_in}
                   </div>
                   <span className="text-slate-200">→</span>
                   <div className="flex items-center gap-2">
                      <span>📅</span> {booking.check_out}
                   </div>
                </div>

                <div className="flex items-center gap-6 pt-2">
                   <div className="flex flex-col">
                      <span className="text-[10px] font-bold text-slate-400 uppercase">Total Paid</span>
                      <span className="text-lg font-bold text-slate-900">₹{booking.total_price.toLocaleString()}</span>
                   </div>
                   {booking.payment && (
                      <div className="flex flex-col border-l border-slate-100 pl-6">
                         <span className="text-[10px] font-bold text-slate-400 uppercase">Payment</span>
                         <span className="text-sm font-bold text-blue-600">{booking.payment.payment_status}</span>
                      </div>
                   )}
                </div>
              </div>

              <div className="flex flex-col items-end gap-4">
                <span className={`px-5 py-2 rounded-2xl text-xs font-bold uppercase tracking-widest ${getStatusStyle(booking.status)}`}>
                  {booking.status}
                </span>

                {booking.status !== "cancelled" && (
                  <button
                    onClick={() => openCancelModal(booking)}
                    className="bg-red-600 text-white px-6 py-3 rounded-2xl font-bold text-sm hover:bg-red-700 transition-all active:scale-95 shadow-lg shadow-red-600/10"
                  >
                    Cancel Booking
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      <ConfirmModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleCancel}
        title="Cancel Reservation?"
        message="Are you sure you want to cancel this booking? This action cannot be undone."
        confirmText="Yes, Cancel Booking"
        cancelText="No, Keep it"
        type="danger"
      />
    </div>
  );
}

export default BookingHistory;