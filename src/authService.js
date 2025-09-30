// src/authService.js

import { UserManager, WebStorageStateStore } from 'oidc-client';

const config = {
  authority: 'https://auth.cyberfrat.com/realms/CYBERFRAT', // Keycloak server URL + realm
  client_id: 'LMS_FRONTEND',       // Keycloak client id
  redirect_uri: window.location.origin + '/callback',  // redirect URI jahan Keycloak redirect karega
  response_type: 'code',
  scope: 'openid profile email',     
  post_logout_redirect_uri: window.location.origin + '/callback',
  silent_redirect_uri: window.location.origin + '/silent-renew.html',
  automaticSilentRenew: true,
  accessTokenExpiringNotificationTime: 60,
  userStore: new WebStorageStateStore({ store: window.localStorage }), 
};

const userManager = new UserManager(config);
export function logout() {
  return userManager.signoutRedirect();
}

userManager.events.addAccessTokenExpired(() => {
  logout(); // logout automatically
});


export function login() {
  return userManager.signinRedirect();
}


export function getUser() {
  return userManager.getUser();
}

export function signinRedirectCallback() {
  return userManager.signinRedirectCallback();
}


