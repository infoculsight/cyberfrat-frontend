// src/authService.js
import Axios from "./Admin-panel/config/config";

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



// export function login() {
//   return UserManager.signinRedirect();
// }


// export function signinRedirectCallback() {
//   return UserManager.signinRedirectCallback();
// }




// // src/authService.js

// import { UserManager } from 'oidc-client';

// const config = {
//   authority: 'https://auth.cyberfrat.com/realms/DEVELOPMENT', // Keycloak server URL + realm
//   client_id: 'LMS_FRONTEND',       // Keycloak client id
//   redirect_uri: window.location.origin + '/callback',  // redirect URI jahan Keycloak redirect karega
//   response_type: 'code',
//   scope: 'openid profile email',     // jo scopes chahiye
//   post_logout_redirect_uri: window.location.origin + '/callback',
//   silent_redirect_uri: window.location.origin + '/silent-renew.html',
//   automaticSilentRenew: true,
//   accessTokenExpiringNotificationTime: 60,
// };

// const userManager = new UserManager(config);
// export function logout() {
//   return userManager.signoutRedirect();
// }

// userManager.events.addAccessTokenExpired(() => {
//   logout(); // logout automatically
// });



// export function getUser() {
//   return userManager.getUser();
// }




