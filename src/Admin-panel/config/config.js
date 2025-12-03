import axios from 'axios';
import { getUser } from '../../authService';
export const TINY_KEY ="e6h4bto2malup58th41859aqxqq2xv42tys9byuuk1cpbjed";
const Axios = axios.create({
baseURL: 'https://api.cfgold.in/api/organization',
});

// Async interceptor
Axios.interceptors.request.use( 
  async (config) => {
    try {
      const user = await getUser();  // await user data
      if (user && user.access_token) {
        config.headers.Authorization = `Bearer ${user.access_token}`;
      }
    } catch (error) {
      console.error("Error fetching user token", error);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default Axios;
