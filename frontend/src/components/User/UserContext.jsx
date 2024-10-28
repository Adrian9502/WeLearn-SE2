import React, { createContext, useContext, useState, useEffect } from "react";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  // Load user data from localStorage on initial render
  useEffect(() => {
    const savedUser = {
      username: localStorage.getItem("username"),
      userId: localStorage.getItem("userId"),
      coins: parseInt(localStorage.getItem("coins"), 10) || 0,
    };
    if (savedUser.username) {
      setUser(savedUser);
    }
  }, []);

  // Storage event listener to update `coins` in the context when changed
  useEffect(() => {
    const handleStorageChange = (event) => {
      if (event.key === "coins") {
        setUser((prevUser) => ({
          ...prevUser,
          coins: parseInt(event.newValue, 10) || 0,
        }));
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  const saveUser = (userData) => {
    setUser(userData);
    localStorage.setItem("username", userData.username);
    localStorage.setItem("userId", userData.userId);
    localStorage.setItem("coins", userData.coins);
  };

  return (
    <UserContext.Provider value={{ user, saveUser }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
