"use client";
import { client } from "../components/client";

class AuthService {
  login = async (username: string, password: string) => {
    const config = {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    };

    const body = JSON.stringify({ username, password });
    try {
      const res = await client.post("/login", body, config);

      if (res.data.success) {
        localStorage.setItem("accessToken", res.data.token);
        localStorage.setItem("username", username);
      }
    } catch (err) {
      console.log(err);
    }
  };

  logout = async () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("username");
  };

  isAuthenticated = () => {
    return !!localStorage.getItem("accessToken");
  };
}

export default new AuthService();
