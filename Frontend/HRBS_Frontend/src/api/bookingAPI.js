import baseAPI from "./baseAPI";

export const bookingAPI = {
  create: (data) => baseAPI.post("booking/create-booking/", data),
  list: () => baseAPI.get("booking/my-booking/"),
  cancel: (id) => baseAPI.patch(`booking/cancel-booking/${id}/`),
};