// src/authService.js
import Axios from "./User-panel/config/config";

export async function getUser() {
  try {
    const res = await Axios.get("check-auth/");
    if (res.data.status) return res.data.data;
    return null;
  } catch {
    return null;
  }
}

export async function logout() {
  try {
    await Axios.get("logout/");
    // Clear client-side cookies
    document.cookie = "cf_at=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=None; Secure";
    document.cookie = "cf_rt=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=None; Secure";
     window.location.href = "/";
  } catch(e) {
    console.error(e);
  }
}
