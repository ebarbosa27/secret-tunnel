import { createContext, useContext, useState } from "react";

const API = "https://fsa-jwt-practice.herokuapp.com";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [token, setToken] = useState();
  const [location, setLocation] = useState("GATE");

  // TODO: signup
  async function signup(username) {
    try {
      const response = await fetch(API + "/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username,
        }),
      });
      const resJson = await response.json();
      if (!resJson.success) throw Error(response);
      setToken(resJson.token);
      setLocation("TABLET");
    } catch (e) {
      console.error(e);
    }
  }

  // TODO: authenticate
  async function authenticate() {
    try {
      if (!token) throw Error("No token found.");
      const response = await fetch(API + "/authenticate", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      const resJson = await response.json();
      if (!resJson.success) throw Error(response);
      setLocation("Tunnel");
    } catch (e) {
      console.error(e);
    }
  }

  const value = { location, signup, authenticate };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw Error("useAuth must be used within an AuthProvider");
  return context;
}
