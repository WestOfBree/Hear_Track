"use client";

import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { useRouter } from "next/navigation";
import { auth } from "../Firebase/init";
import LoadingState from "./LoadingState";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const router = useRouter();
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      const loggedIn = Boolean(user);
      setIsAuthenticated(loggedIn);
      setIsCheckingAuth(false);

      if (!loggedIn) {
        router.replace("/");
      }
    });

    return () => unsubscribe();
  }, [router]);

  if (isCheckingAuth) {
    return <LoadingState message="Checking authentication..." />;
  }

  if (!isAuthenticated) {
    return <LoadingState message="Redirecting to login..." showSpinner={false} />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;