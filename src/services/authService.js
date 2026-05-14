const API_BASE_URL = "http://localhost:3000/api";

const authService = {
  async login(email, password, rememberMe = false) {
    try {
      const response = await fetch(
        `${API_BASE_URL}/auth/login`,
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            email,
            password,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Login failed"
        );
      }

      if (data.token) {
        localStorage.setItem(
          "token",
          data.token
        );

        localStorage.setItem(
          "user",
          JSON.stringify(data.user || {})
        );

        if (rememberMe) {
          localStorage.setItem(
            "rememberMe",
            "true"
          );
        } else {
          localStorage.removeItem(
            "rememberMe"
          );
        }
      }

      return data;

    } catch (error) {

      console.error(
        "AUTH LOGIN ERROR:",
        error
      );

      throw error;
    }
  },

  async register(userData) {
    try {
      const response = await fetch(
        `${API_BASE_URL}/auth/register`,
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify(userData),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Registration failed"
        );
      }

      return data;

    } catch (error) {

      console.error(
        "AUTH REGISTER ERROR:",
        error
      );

      throw error;
    }
  },

  logout() {

    localStorage.removeItem("token");

    localStorage.removeItem("user");

    localStorage.removeItem(
      "rememberMe"
    );
  },

  getToken() {

    return localStorage.getItem(
      "token"
    );
  },

  getUser() {

    const user =
      localStorage.getItem("user");

    return user
      ? JSON.parse(user)
      : null;
  },

  isAuthenticated() {

    return !!localStorage.getItem(
      "token"
    );
  },
};

export default authService;