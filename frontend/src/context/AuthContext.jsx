import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext(null);

const storageKey = "lifelink_auth";

export const AuthProvider = ({ children }) => {
  const [authState, setAuthState] = useState(() => {
    const saved = localStorage.getItem(storageKey);
    return saved ? JSON.parse(saved) : { token: "", user: null };
  });

  useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify(authState));
  }, [authState]);

  const login = (payload) => setAuthState(payload);
  const logout = () => setAuthState({ token: "", user: null });

  return (
    <AuthContext.Provider value={{ ...authState, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
