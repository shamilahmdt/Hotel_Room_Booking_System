import baseAPI from "./baseAPI";

export const hotelsAPI = {
  list: (params) => baseAPI.get("hotels/hotel-list/", { params }),
  detail: (id) => baseAPI.get(`hotels/hotel-detail/${id}/`),
};