import baseAPI from "./baseAPI";

export const authAPI = {
  login: (data) => baseAPI.post("customer/login/", data),
  register: (data) => baseAPI.post("customer/register/", data),
};