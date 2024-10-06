import React, { createContext, useContext, useState } from "react";

interface UserContextType {
  userFullName: string; // Changed from userId to userFullName
  setUserFullName: (name: string) => void; 
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [userFullName, setUserFullName] = useState<string>("");

  return (
    <UserContext.Provider value={{ userFullName, setUserFullName }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};
