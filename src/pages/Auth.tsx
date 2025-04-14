import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import Loader from "@/components/Loader";

const auth = getAuth();

export default function AuthRedirector() {
  const [checkingAuth, setCheckingAuth] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        localStorage.setItem("isLoggedIn", "true");
        navigate("/userlist", { replace: true });
      } else {
        localStorage.removeItem("isLoggedIn");
        navigate("/landing", { replace: true });
      }
      setCheckingAuth(false);
    });

    return () => unsubscribe();
  }, [navigate]);

  // 👇 Check localStorage to speed up initial decision
  if (checkingAuth && localStorage.getItem("isLoggedIn") === "true") {
    // Quickly redirect while Firebase finishes loading
    navigate("/userlist", { replace: true });
    return null;
  }

  if (checkingAuth) return <Loader />;

  return null;
}
