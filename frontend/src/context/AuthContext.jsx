import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext(null);

const storageKey = "lifelink_auth";
const defaultAuthState = {
  token: "demo-token-hospital-admin",
  user: {
    id: "user-admin",
    name: "Dr. Aris Thorne",
    email: "admin@lifelink.org",
    role: "Hospital Admin",
    hospitalName: "Metro Care Hospital",
  },
};

export const AuthProvider = ({ children }) => {
  const [authState, setAuthState] = useState(() => {
    const saved = localStorage.getItem(storageKey);
    return saved ? JSON.parse(saved) : defaultAuthState;
  });

  useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify(authState));
  }, [authState]);

  const login = (payload) => setAuthState(payload);
  const logout = () => setAuthState(defaultAuthState);

  return (
    <AuthContext.Provider value={{ ...authState, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
