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
    const res =  await Axios.get("logout/"); // because baseURL = https://development.culsight.com/api/learner/
     // Client side cookies remove (extra safety)
    document.cookie = "cf_at=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=None; Secure";
    document.cookie = "cf_rt=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=None; Secure";
    console.error("Logout done", res);
  } catch (e) {
    console.error("Logout failed", e);
  } finally {
    // window.location.href = "/"; // redirect after logout
  }
}
