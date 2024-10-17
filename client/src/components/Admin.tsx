import React, { useState, useEffect } from "react";
import AdminLogin from "./AdminLogin";
import NewsPanel from "./AdminPanel/NewsPanel";
import TournamentsPanel from "./AdminPanel/TournamentsPanel";
import { UserProvider } from "./UserContext";
import ClubPanel from "./AdminPanel/ClubPanel";
import SponsorPanel from "./AdminPanel/SponsorPanel";

const Admin: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

  const sessionDuration = 15 * 60; // 15 minutes

  useEffect(() => {
    const savedLoginState = localStorage.getItem("isLoggedIn");
    if (savedLoginState === "true") {
      setIsLoggedIn(true);
    }

    const handleActivity = () => {
      localStorage.setItem("lastActivity", Date.now().toString());
    };

    const checkInactivity = () => {
      const lastActivity = localStorage.getItem("lastActivity");
      if (lastActivity) {
        const elapsed = Date.now() - Number(lastActivity);
        if (elapsed > sessionDuration) {
          setIsLoggedIn(false);
          localStorage.removeItem("lastActivity");
          localStorage.setItem("isLoggedIn", "false"); // Update login state
        }
      }
    };

    if (isLoggedIn) {
      localStorage.setItem("lastActivity", Date.now().toString());
      localStorage.setItem("isLoggedIn", "true"); // Update login state
      const intervalId = setInterval(checkInactivity, 1000 * 60);

      window.addEventListener("mousemove", handleActivity);
      window.addEventListener("keydown", handleActivity);

      return () => {
        clearInterval(intervalId);
        window.removeEventListener("mousemove", handleActivity);
        window.removeEventListener("keydown", handleActivity);
      };
    }
  }, [isLoggedIn, sessionDuration]);

  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
  };

  return (
    <UserProvider>
      <div>
        {!isLoggedIn ? (
          <AdminLogin onLoginSuccess={handleLoginSuccess} />
        ) : (
          <>
            <NewsPanel />
            <TournamentsPanel />
            <ClubPanel />
            <SponsorPanel />
            <button
              className="fixed rounded-lg right-5 top-5 bg-red-600 text-white p-1"
              onClick={() => {
                setIsLoggedIn(false);
                localStorage.setItem("isLoggedIn", "false");
                localStorage.removeItem("lastActivity");
              }}
            >
              Wyloguj się
            </button>
          </>
        )}
      </div>
    </UserProvider>
  );
};

export default Admin;
