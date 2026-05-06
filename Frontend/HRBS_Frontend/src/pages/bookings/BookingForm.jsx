import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { roomsAPI } from "../../api/roomsAPI";
import { bookingAPI } from "../../api/bookingAPI";
import ConfirmModal from "../../components/ConfirmModal";
import toast from "react-hot-toast";
import { HiArrowLeft } from "react-icons/hi";

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
  const [isModalOpen, setIsModalOpen] = useState(false);

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

  const images = room?.images?.length
    ? room.images.map((img) => img.image)
    : ["https://images.unsplash.com/photo-1611892440504-42a792e24d32?auto=format&fit=crop&q=80&w=800"];

  useEffect(() => {
    if (!room || images.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
    }, 4000);
    return () => clearInterval(interval);
  }, [room, images.length]);

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

  const handleBookClick = (e) => {
    e.preventDefault();
    if (calculateNights() <= 0) {
      toast.error("Check-out must be after check-in.");
      return;
    }
    setIsModalOpen(true);
  };

  const processBooking = async () => {
    try {
      setLoading(true);
      await bookingAPI.create({
        room: roomId,
        check_in: formData.check_in,
        check_out: formData.check_out,
      });

      toast.success("Booking confirmed! Redirecting...", {
        duration: 3000,
        icon: '✅',
      });
      
      setTimeout(() => navigate("/bookings"), 2000);

    } catch (err) {
      console.error(err);
      const msg = err.response?.data?.detail || "Booking failed. Please try again.";
      toast.error(msg);
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  if (!room) return (
    <div className="flex items-center justify-center h-full min-h-[80vh]">
       <div className="animate-spin text-4xl">⌛</div>
    </div>
  );

  return (
    <div className="min-h-full flex flex-col pb-10">
      
      {/* Back Button */}
      <div className="mb-6">
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-slate-500 hover:text-slate-900 font-bold transition-all group"
        >
          <div className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center group-hover:bg-slate-900 group-hover:text-white transition-all">
             <HiArrowLeft className="text-xl" />
          </div>
          Back to list
        </button>
      </div>

      <div className="max-w-4xl w-full mx-auto bg-white rounded-[2.5rem] shadow-sm overflow-hidden border border-slate-100 flex flex-col flex-grow">
        
        {/* Top: Image Section - Responsive height */}
        <div className="w-full relative h-80 sm:h-96 md:h-[30rem] overflow-hidden">
          <img
            src={images[currentIndex]}
            alt="Room"
            className="w-full h-full object-cover transition-all duration-1000"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent flex items-end p-8">
             <div>
                <span className="bg-white/20 backdrop-blur-md text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest mb-2 inline-block">
                   Room Reservation
                </span>
                <h2 className="text-4xl font-bold text-white tracking-tight">Room {room.room_number}</h2>
             </div>
          </div>
        </div>

        {/* Bottom: Form Section */}
        <div className="p-10 flex-grow">
          <h2 className="text-2xl font-bold text-slate-900 mb-8">Complete Your Booking</h2>
          
          <form onSubmit={handleBookClick} className="space-y-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
              <div>
                <label className="block text-sm font-bold text-slate-400 uppercase tracking-widest mb-2">Check In</label>
                <input
                  type="date"
                  name="check_in"
                  min={today}
                  value={formData.check_in}
                  onChange={handleChange}
                  required
                  className="w-full border border-slate-200 bg-white p-4 rounded-2xl focus:ring-2 focus:ring-blue-600 outline-none transition-all font-medium"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-400 uppercase tracking-widest mb-2">Check Out</label>
                <input
                  type="date"
                  name="check_out"
                  min={formData.check_in || today}
                  value={formData.check_out}
                  onChange={handleChange}
                  required
                  className="w-full border border-slate-200 bg-white p-4 rounded-2xl focus:ring-2 focus:ring-blue-600 outline-none transition-all font-medium"
                />
              </div>
            </div>

            <div className="bg-slate-50 p-8 rounded-[2rem] border border-slate-100 space-y-4">
              <div className="flex justify-between text-slate-500 font-medium text-lg">
                 <span>Stay Duration</span>
                 <span>{calculateNights()} Nights</span>
              </div>
              <div className="flex justify-between text-slate-500 font-medium text-lg">
                 <span>Price per night</span>
                 <span>₹{roomPrice.toLocaleString()}</span>
              </div>
              <div className="pt-6 border-t border-slate-200 flex justify-between items-center">
                 <span className="text-slate-900 font-bold text-xl">Total Amount</span>
                 <span className="text-3xl font-bold text-blue-600">₹{calculateTotal().toLocaleString()}</span>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-slate-900 text-white py-6 rounded-2xl font-bold text-xl hover:bg-blue-600 transition-all disabled:opacity-50"
            >
              {loading ? "Processing..." : "Confirm & Book Now"}
            </button>
          </form>
        </div>
      </div>

      <ConfirmModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={processBooking}
        title="Confirm Booking"
        message={`Are you sure you want to book Room ${room?.room_number} for ₹${calculateTotal().toLocaleString()}?`}
        confirmText="Confirm Booking"
        type="primary"
      />
    </div>
  );
}

export default BookingForm;