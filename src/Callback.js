// src/Callback.js
import  { useEffect } from 'react';
import { signinRedirectCallback, login} from './authService';
import CulsightPageLoader from './User-panel/components/CulsightPageLoader';
import { jwtDecode } from 'jwt-decode';
import { GET_LAST_LOGIN } from './User-panel/apis/apis';

export default function Callback() {

  useEffect(() => {
    signinRedirectCallback()
      .then((user) => {
      if (user) {
          const decoded = jwtDecode(user.access_token);
          const roles = decoded?.resource_access?.["LMS_FRONTEND"]?.roles || [];
          if (roles.includes("learner")) {
            const formData = new FormData();
            GET_LAST_LOGIN(formData);
             window.location.href = "/";
          }else{
            window.location.href = "/";
          }
         
      }else{
        window.location.href = "/";
      }
      
      })
      .catch(err => {
        login()
      });
  }, []);

  return <div><CulsightPageLoader /></div>;
}


