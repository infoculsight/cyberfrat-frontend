
import axios from 'axios';
export const AxiosFirst = axios.create({
  baseURL: 'https://api.cfgold.in/api/organization/',
  withCredentials: true,
});
const Axios = axios.create({
  baseURL: 'https://api.cfgold.in/api/organization/',
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
        // Clear cooklies
        document.cookie =
          "cf_at=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=None; Secure";
        document.cookie =
          "cf_rt=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=None; Secure";
      } catch (e) {}
      // Redirect to login
      //await logout();
      window.location.href = "/";
    }

    // ✅ Handle network or other server errors
    return Promise.reject(error);
  }
);
export default Axios; 




// import axios from 'axios';
// import { getUser } from '../../authService';
// export const TINY_KEY ="e6h4bto2malup58th41859aqxqq2xv42tys9byuuk1cpbjed";
// const Axios = axios.create({
// baseURL: 'https://development.cfgold.in/api/organization',
// });

// // Async interceptor
// Axios.interceptors.request.use( 
//   async (config) => {
//     try {
//       const user = await getUser();  // await user data
//       if (user && user.access_token) {
//         config.headers.Authorization = `Bearer ${user.access_token}`;
//       }
//     } catch (error) {
//       console.error("Error fetching user token", error);
//     }
//     return config;
//   },
//   (error) => {
//     return Promise.reject(error);
//   }
// );

// export default Axios;
