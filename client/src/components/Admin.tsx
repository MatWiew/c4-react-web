import React, { useState, useEffect } from "react";
import AdminLogin from "./AdminLogin";
import NewsPanel from "./AdminPanel/NewsPanel";
import TournamentsPanel from "./AdminPanel/TournamentsPanel";
import { UserProvider } from "./UserContext";
import NewsSlider from "./NewsComponents/NewsSlider";
import { Article } from "../Types";
import ClubPanel from "./AdminPanel/ClubPanel";

const Admin: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);

  const sessionDuration = 30 * 60 * 1000; // 30 minutes in milliseconds

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
  }, [isLoggedIn]);

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
            <NewsPanel
              selectedArticle={selectedArticle}
              onDeselectArticle={() => setSelectedArticle(null)} // Deselect article handler
            />
            <div className="w-3/4 mx-auto">
              <NewsSlider onClick={setSelectedArticle} />
            </div>
            <TournamentsPanel />
            <ClubPanel />
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
