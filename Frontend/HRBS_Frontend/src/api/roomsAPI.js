import baseAPI from "./baseAPI";

export const roomsAPI = {
  list: (hotelId, params = {}) =>
    baseAPI.get("hotels/room-list/", {
      params: {
        hotel: hotelId,
        ...params,
      },
    }),
};