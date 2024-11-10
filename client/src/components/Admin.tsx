import React, { useState, useEffect } from "react";
import AdminLogin from "./AdminLogin";
import NewsPanel from "./AdminPanel/NewsPanel";
import TournamentsPanel from "./AdminPanel/TournamentsPanel";
import { UserProvider } from "./UserContext";
import ClubPanel from "./AdminPanel/ClubPanel";
import SponsorPanel from "./AdminPanel/SponsorPanel";

const Admin: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [countdown, setCountdown] = useState<number>(30 * 60); // 30 minutes in seconds

  const sessionDuration = 30 * 60;
  const inactivityTimeout = 5000; // 5 seconds

  useEffect(() => {
    const savedLoginState = localStorage.getItem("isLoggedIn");
    const lastClosedTimestamp = localStorage.getItem("lastClosedTimestamp");

    if (savedLoginState === "true") {
      // Check if the page was closed for more than 5 seconds
      const now = Date.now();
      if (
        lastClosedTimestamp &&
        now - Number(lastClosedTimestamp) > inactivityTimeout
      ) {
        handleLogout();
      } else {
        setIsLoggedIn(true);
      }
    }

    const handleActivity = () => {
      localStorage.setItem("lastActivity", Date.now().toString());
      setCountdown(sessionDuration); // Reset countdown on activity
    };

    const checkInactivity = () => {
      const lastActivity = localStorage.getItem("lastActivity");
      if (lastActivity) {
        const elapsed = Date.now() - Number(lastActivity);
        const remainingTime = Math.max(
          sessionDuration - Math.floor(elapsed / 1000),
          0
        );
        setCountdown(remainingTime);

        if (remainingTime <= 0) {
          handleLogout();
        }
      }
    };

    const handleUnload = () => {
      localStorage.setItem("lastClosedTimestamp", Date.now().toString());
    };

    window.addEventListener("beforeunload", handleUnload);

    if (isLoggedIn) {
      localStorage.setItem("lastActivity", Date.now().toString());
      localStorage.setItem("isLoggedIn", "true"); // Update login state
      const intervalId = setInterval(checkInactivity, 1000);
      window.addEventListener("keydown", handleActivity);
      window.addEventListener("mousedown", handleActivity);

      return () => {
        clearInterval(intervalId);
        window.removeEventListener("keydown", handleActivity);
        window.removeEventListener("mousedown", handleActivity);
      };
    }

    return () => {
      window.removeEventListener("beforeunload", handleUnload);
    };
  }, [isLoggedIn, sessionDuration]);

  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
    setCountdown(sessionDuration); // Start countdown on login
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setCountdown(sessionDuration); // Reset countdown
    localStorage.setItem("isLoggedIn", "false");
    localStorage.removeItem("lastActivity");
    localStorage.removeItem("lastClosedTimestamp");
  };

  // Format countdown as MM:SS
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, "0")}:${remainingSeconds
      .toString()
      .padStart(2, "0")}`;
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
            <div className="fixed right-5 top-5 flex items-center space-x-2">
              <span>{formatTime(countdown)}</span>
              <button
                className="rounded-lg bg-red-600 text-white p-1"
                onClick={handleLogout}
              >
                Wyloguj się
              </button>
            </div>
          </>
        )}
      </div>
    </UserProvider>
  );
};

export default Admin;
