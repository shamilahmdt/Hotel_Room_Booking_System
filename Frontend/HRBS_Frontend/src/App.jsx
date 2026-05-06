import { Routes, Route, Navigate } from "react-router-dom";
import DashboardLayout from "./layouts/DashboardLayout";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import HotelList from "./pages/hotels/HotelList";
import HotelDetail from "./pages/hotels/HotelDetail";
import BookingForm from "./pages/bookings/BookingForm";
import BookingHistory from "./pages/bookings/BookingHistory";
import Favorites from "./pages/favorites/Favorites";
import Profile from "./pages/profile/Profile"; 
import PrivateRoute from "./routes/PrivateRoute";

import { Toaster } from "react-hot-toast";

function App() {
  return (
    <>
      <Toaster position="top-center" reverseOrder={false} />
      <Routes>

      {/* Default route → Login */}
      <Route path="/" element={<Navigate to="/login" />} />

      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Protected Dashboard Routes */}
      <Route
        path="/dashboard"
        element={
          <PrivateRoute>
            <DashboardLayout>
              <HotelList />
            </DashboardLayout>
          </PrivateRoute>
        }
      />

      <Route
        path="/hotel-detail/:id"
        element={
          <PrivateRoute>
            <DashboardLayout>
              <HotelDetail />
            </DashboardLayout>
          </PrivateRoute>
        }
      />

      <Route
        path="/book-room/:roomId"
        element={
          <PrivateRoute>
            <DashboardLayout>
              <BookingForm />
            </DashboardLayout>
          </PrivateRoute>
        }
      />

      <Route
        path="/bookings"
        element={
          <PrivateRoute>
            <DashboardLayout>
              <BookingHistory />
            </DashboardLayout>
          </PrivateRoute>
        } 
      />

      <Route
        path="/favorites"
        element={
          <PrivateRoute>
            <DashboardLayout>
              <Favorites />
            </DashboardLayout>
          </PrivateRoute>
        }
      />

      <Route
        path="/profile"
        element={
          <PrivateRoute>
            <DashboardLayout>
              <Profile />
            </DashboardLayout>
          </PrivateRoute>
        }
      />

      </Routes>
    </>
  );
}

export default App;