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
        navigate("/userlist");
      } else {
        navigate("/landing");
      }
      setCheckingAuth(false);
    });
    return () => unsubscribe();
  }, [navigate]);
  if (checkingAuth) return <Loader />;
}
