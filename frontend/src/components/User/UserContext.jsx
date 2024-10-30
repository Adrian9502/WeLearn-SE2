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

  // Listen for changes to the `coins` key in localStorage
  useEffect(() => {
    const handleStorageChange = (event) => {
      if (event.key === "coins") {
        const updatedCoins = parseInt(event.newValue, 10) || 0;
        setUser((prevUser) => ({
          ...prevUser,
          coins: updatedCoins,
        }));
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  // Function to save user data to state and localStorage
  const saveUser = (userData) => {
    setUser(userData);
    localStorage.setItem("username", userData.username);
    localStorage.setItem("userId", userData.userId);
    localStorage.setItem("coins", userData.coins);
  };

  // Function to update user data
  const updateUser = (updatedData) => {
    setUser((prevUser) => ({
      ...prevUser,
      ...updatedData,
    }));
    // Update localStorage
    localStorage.setItem("username", updatedData.username || user.username);
    localStorage.setItem("userId", updatedData.userId || user.userId);
    localStorage.setItem("coins", updatedData.coins || user.coins);
  };
  return (
    <UserContext.Provider value={{ user, saveUser, updateUser }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
