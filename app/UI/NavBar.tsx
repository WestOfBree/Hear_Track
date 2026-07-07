"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../Firebase/init";
import { signOut } from "firebase/auth";
import { useRouter } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {faToggleOff, faToggleOn, faPowerOff} from "@fortawesome/free-solid-svg-icons";
import Image from "next/image";


export default function NavBar() {
  const pathname = usePathname();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const router = useRouter();
  const disabledNavMessage = "Log in to access this page.";
  const [theme, setTheme] = useState<"light" | "dark">(() => {
    if (typeof window === "undefined") {
      return "light";
    }

    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark" || savedTheme === "light") {
      return savedTheme;
    }

    return window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
  });

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
    localStorage.setItem("theme", theme);
  }, [theme]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setIsLoggedIn(Boolean(user));
    });

    return () => unsubscribe();
  }, []);

  const handleToggleTheme = () => {
    const nextTheme = theme === "dark" ? "light" : "dark";
    setTheme(nextTheme);
  };

    function logout() {
      signOut(auth)
        .then(() => {
          console.log("User logged out");
          router.push("/"); // Redirect to home or login page after logout
        })
        .catch((error) => {
          console.error("Error logging out:", error);
        });
    }

  return (
    <nav
      className={`flex w-full items-center justify-between p-4 ${theme === "dark" ? "bg-zinc-900" : "bg-gray-800"}`}
    >
      <div className="flex space-x-4">
        <Link
          href="/"
          className={pathname === "/" ? "text-white" : "text-gray-400"}
        >
          Home
        </Link>
        {isLoggedIn ? (
          <Link
            href="/RepairTracker"
            className={
              pathname === "/RepairTracker" ? "text-white" : "text-gray-400"
            }
          >
            Repair Tracker
          </Link>
        ) : (
          <span
            className="cursor-not-allowed text-gray-500"
            aria-disabled="true"
            title={disabledNavMessage}
            aria-label={disabledNavMessage}
          >
            Repair Tracker
          </span>
        )}
        {isLoggedIn ? (
          <Link
            href="/Summary"
            className={pathname === "/Summary" ? "text-white" : "text-gray-400"}
          >
            Summary
          </Link>
        ) : (
          <span
            className="cursor-not-allowed text-gray-500"
            aria-disabled="true"
            title={disabledNavMessage}
            aria-label={disabledNavMessage}
          >
            Summary
          </span>
        )}
      </div>
      <div className="flex space-x-4">
      <button 
      type="button"
      onClick={logout}
      className={`rounded-md border px-3 py-2 text-sm font-medium transition-colors cursor-pointer ${theme === "dark" ? "border-zinc-600 bg-zinc-800 text-zinc-100 hover:bg-zinc-700" : "border-zinc-300 bg-white text-zinc-900 hover:bg-zinc-100"}`}
      >
        <FontAwesomeIcon icon={faPowerOff} />
      </button>
      <button
        type="button"
        onClick={handleToggleTheme}
        aria-label="Toggle color theme"
        className={`rounded-md border px-3 py-2 text-sm font-medium cursor-pointer transition-colors ${theme === "dark" ? "border-zinc-600 bg-zinc-800 text-zinc-100 hover:bg-zinc-700" : "border-zinc-300 bg-white text-zinc-900 hover:bg-zinc-100"}`}
      >
        {theme === "dark" ? (
          <>
            <Image src="/assets/light.png" alt="Light mode icon" width={40} height={40} />
          </>
        ) : (
          <>
           <Image src="/assets/dark.png" alt="Dark mode icon" width={40} height={40} />
          </>
        )}
      </button>
      </div>
    </nav>
  );
}
