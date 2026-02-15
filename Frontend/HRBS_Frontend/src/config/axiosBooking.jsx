import axios from "axios";

export const bookingAPI = axios.create({
  baseURL: "http://127.0.0.1:8000/api/v1/bookings/",
  withCredentials: true,
});