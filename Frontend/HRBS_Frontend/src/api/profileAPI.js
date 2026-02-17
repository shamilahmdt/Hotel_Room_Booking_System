import baseAPI from "./baseAPI";

export const profileAPI = {
  getProfile: () => baseAPI.get("customer/profile/"),
  updateProfile: (data) => baseAPI.patch("customer/profile_update/", data),
};