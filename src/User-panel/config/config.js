import axios from 'axios';
export const AxiosFirst = axios.create({
  baseURL: 'https://development.culsight.com/api/learner/',
  withCredentials: true,
});
const Axios = axios.create({
  baseURL: 'https://development.culsight.com/api/learner/',
  withCredentials: true,
});

// --- Request Interceptor ---
// Axios.interceptors.request.use(config => {
//   if (localStorage.getItem("loggedOut") === "true") {
//     // Agar user logout hua hai, request block karo
//     return Promise.reject({ message: "User logged out, API blocked" });
//   }
//   return config;
// }, error => {
//   return Promise.reject(error);
// });

// 🔥 Add a global response interceptor
Axios.interceptors.response.use(
  (response) => {
    // Normal successful response
    return response;
  },
  async (error) => {
    // ✅ Check if token expired (401 or 403)
    if (error.response && [401, 403].includes(error.response.status)) {
      try {
        // Clear cookies
        document.cookie =
          "cf_at=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=None; Secure";
        document.cookie =
          "cf_rt=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=None; Secure";
      } catch (e) {}
      // Redirect to login
      window.location.href = "/";
    }

    // ✅ Handle network or other server errors
    return Promise.reject(error);
  }
);
export default Axios;
