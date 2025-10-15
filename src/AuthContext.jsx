import { createContext, useContext, useState } from "react";

const API = "https://fsa-jwt-practice.herokuapp.com";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [token, setToken] = useState(null);
  const [location, setLocation] = useState("GATE");

  // TODO: signup
  async function signup(username) {
    try {
      const response = await fetch(`${API}/signup`, {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({ username }),
      });

      if (!response.ok) throw new Error("Signup Failed");
      const data = await response.json();
      
      setToken(data.token);
      setLocation("TABLET");
    } catch (err) {
      console.error("Signup error:", err);
      alert("Error signing up. Please try again.");
    }
  }

  // TODO: authenticate
  async function authenticate() {
    if (!token) {
      throw new Error("No token found. Please sign up first.");
    }

    try {
      const response = await fetch(`${API}/authenticate`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error("Authentication failed");

      const data = await response.json();
      console.log("Authenticated as:", data);
      setLocation("TUNNEL");
    } catch (err) {
      console.error("Authentication error:", err);
      alert("Authentication failed. Please try again.");
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
