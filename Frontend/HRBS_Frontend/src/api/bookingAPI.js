import baseAPI from "./baseAPI";

export const bookingAPI = {
  create: (data) => baseAPI.post("bookings/", data),
  list: () => baseAPI.get("bookings/"),
  cancel: (id) => baseAPI.delete(`bookings/${id}/`),
};