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

export default Axios;
