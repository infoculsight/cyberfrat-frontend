// src/authService.js
import Axios from "./User-panel/config/config";

export async function getUser() {
  try {
    const res = await Axios.get("check-auth/");
    if (res.data.status) return res.data.data;
    return null;
  } catch (err) {
    console.warn("Token expired or auth failed");
    return null;
  }
}

export async function logout() {
  try {
    await Axios.get("logout/");
  } catch(e) {
    console.error(e);
  } finally {
    document.cookie = "cf_at=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=None; Secure";
    document.cookie = "cf_rt=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=None; Secure";
    localStorage.removeItem("token_expired");
    localStorage.removeItem("user");        
    localStorage.removeItem("user_info");   
    localStorage.removeItem("token_expired");
    window.location.href = "/";
  }
}
