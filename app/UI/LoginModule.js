"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { auth } from "../Firebase/init";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInAnonymously,
  onAuthStateChanged
} from "firebase/auth";
import { FaUserAstronaut } from "react-icons/fa";

export default function LoginModule() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();
  const [isRegisterMode, setIsRegisterMode] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  function register() {
    // Registration logic using auth
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Successfully registered
        const user = userCredential.user;
        console.log("User registered:", user);
        login(); // Automatically log in after registration
      })
      .catch((error) => {
        console.error("Error registering user:", error);
      });
  }

  function loginAsGuest() {
    // Login as guest logic using auth
    signInAnonymously(auth)
      .then((userCredential) => {
        const user = userCredential.user;
        console.log("Guest user logged in:", user);
        router.push("/Summary");
      })
      .catch((error) => {
        console.error("Error logging in as guest:", error);
      });
  }



  function login() {
    // Login logic using auth
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;

        console.log("User logged in:", user);
        router.push("/Summary");
      })
      .catch((error) => {
        setErrorMessage("Error logging in: " + error.message);
      });
    console.log("Login function called");
  }

  onAuthStateChanged(auth, (user) => {
    console.log("Auth state changed:", user);
  });

  if (isRegisterMode) {
    return (
      <div className="flex w-full items-center justify-center py-10">
        <div className="relative w-full max-w-100 rounded-lg bg-white p-7.5">
          <h2 style={{ display: "flex", justifyContent: "center", fontSize: "24px" }}>
            Register for HearTrack
          </h2>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              register();
            }}
          >
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="my-2.5 w-full box-border rounded-sm border border-[#ddd] p-2.5"
              required
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="my-2.5 w-full box-border rounded-sm border border-[#ddd] p-2.5"
              required
            />
            <button
              type="submit"
              className="mt-2.5 w-full cursor-pointer rounded-sm border-none p-2.5 text-white"
              style={{ backgroundColor: "#0f766e" }}
            >
              Register
            </button>
          </form>

          <button
            type="button"
            className="mt-3 w-full cursor-pointer rounded-sm border border-[#cbd5e1] bg-white p-2.5 text-[#334155]"
            onClick={() => setIsRegisterMode(false)}
          >
            Back to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex w-full items-center justify-center py-10">
      <div className="relative w-full max-w-100 rounded-lg bg-white p-7.5">
        <h2 style={{ display: "flex", justifyContent: "center", fontSize: "24px" }}>Login to HearTrack</h2>

        <button
          className="mt-2.5 flex w-full cursor-pointer items-center justify-center rounded-sm border-none bg-[#6c757d] p-2.5 text-white"
          onClick={loginAsGuest}
        >
          <FaUserAstronaut />
          <span className="ml-2">Login as a Guest</span>
        </button>

        <div className="my-4 text-center text-[#888] before:mr-2.5 before:inline-block before:h-px before:w-[40%] before:align-middle before:bg-[#bac8ce] before:content-[''] after:ml-2.5 after:inline-block after:h-px after:w-[40%] after:align-middle after:bg-[#bac8ce] after:content-['']">
          or
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            login();
          }}
        >
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="my-2.5 w-full box-border rounded-sm border border-[#ddd] p-2.5"
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="my-2.5 w-full box-border rounded-sm border border-[#ddd] p-2.5"
            required
          />

          <div
            style={{ display: "flex", justifyContent: "center", marginBottom: "15px", color: "red" }}
            className="error-message"
          >
            {errorMessage}
          </div>

          <button
            type="submit"
            className="mt-2.5 w-full cursor-pointer rounded-sm border-none p-2.5 text-white"
            style={{ backgroundColor: "#0f766e" }}
          >
            Login
          </button>

          <a href="#" onClick={() => alert("That sucks...")}>Forgot Password?</a>
          <br />
          <a href="#" onClick={() => setIsRegisterMode(true)} className="register-link">
            Don&apos;t have an account? Register
          </a>
        </form>
      </div>
    </div>
  );
}
