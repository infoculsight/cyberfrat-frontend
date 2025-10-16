// src/Callback.js
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import CulsightPageLoader from "./User-panel/components/CulsightPageLoader";
import { signinRedirectCallback, login, getUser } from "./authService";
import { GET_LAST_LOGIN } from "./User-panel/apis/apis";

export default function Callback() {
  const navigate = useNavigate();

  useEffect(() => {
    const handleCallback = async () => {
      try {
        // Keycloak redirect response handle
        const user = await signinRedirectCallback();

        if (!user) {
          // अगर कोई user info नहीं मिला → login page
          login();
          return;
        }

        // Cookie में set token check via backend
        const backendUser = await getUser();

        if (!backendUser) {
          // Cookie expired या login नहीं → redirect login
          login();
          return;
        }
        
        navigate("/", { replace: true });
      } catch (err) {
        console.error("Callback error:", err);
        // कुछ भी error → login page
        login();
      }
    };

    handleCallback();
  }, [navigate]);

  return <div><CulsightPageLoader /></div>;
}
