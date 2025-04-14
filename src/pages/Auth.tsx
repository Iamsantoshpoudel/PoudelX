import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import Loader from "@/components/Loader";

const auth = getAuth();

export default function AuthRedirector() {
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [redirected, setRedirected] = useState(false);
  const navigate = useNavigate();

  // 🔄 Fast redirect from localStorage
  useEffect(() => {
    const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
    if (isLoggedIn && !redirected) {
      navigate("/userlist", { replace: true });
      setRedirected(true);
    }
  }, [navigate, redirected]);

  // 🔐 Firebase auth state listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCheckingAuth(false); // always stop loading

      if (user) {
        localStorage.setItem("isLoggedIn", "true");
        if (!redirected) {
          navigate("/userlist", { replace: true });
          setRedirected(true);
        }
      } else {
        localStorage.removeItem("isLoggedIn");
        if (!redirected) {
          navigate("/landing", { replace: true });
          setRedirected(true);
        }
      }
    });

    return () => unsubscribe();
  }, [navigate, redirected]);

  if (checkingAuth) return <Loader />;
  return null;
}
