import React, { useState, useEffect } from "react";
import AdminLogin from "./AdminLogin";
import NewsPanel from "./AdminPanel/NewsPanel";
import { UserProvider } from "./UserContext";

const Admin: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false); // State to track login status


  // Callback to set login status
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
          </>
        )}
      </div>
    </UserProvider>
  );
};

export default Admin;
