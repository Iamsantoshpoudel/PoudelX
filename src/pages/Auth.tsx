import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import Loader from "@/components/Loader";

const auth = getAuth();

export default function AuthRedirector() {
  const [checkingAuth, setCheckingAuth] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Make sure this only runs once, and captures the correct state
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCheckingAuth(false); // Always stop loader
      if (user) {
        navigate("/userlist", { replace: true });
      } else {
        navigate("/landing", { replace: true });
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  if (checkingAuth) {
    return <Loader />;
  }

  // Optional fallback if something goes wrong
  return null;
}
