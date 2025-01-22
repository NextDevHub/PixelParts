// authContext.jsx
/* eslint-disable react-refresh/only-export-components */
/* eslint-disable react/prop-types */
import { createContext, useState, useEffect } from "react";
import Cookies from "js-cookie";
import Axios from "axios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Retrieve user data from cookies on load
    const userData = Cookies.get("userData");
    if (userData) {
      setCurrentUser(JSON.parse(userData));
    }
    setLoading(false);
  }, []);

  const signUp = async (formData, setSuccess, setError) => {
    try {
      const { confirmPassword, ...rest } = formData;
      const response = await fetch(
      "https://pixelparts-dev-api.up.railway.app/api/v1/auth/register",
      {
        method: "POST",
        headers: {
        "Content-Type": "application/json",
        },
        body: JSON.stringify(rest),
      },
      );

      // Handle response
      if (!response.ok) {
        const errorData = await response.json();
        if (errorData.err?.code === "23505") {
          throw new Error(
            "This email is already registered. Please use a different email.",
          );
        }
        throw new Error(
          errorData.message || "Signup failed. Please try again.",
        );
      }

      const data = await response.json();
      setSuccess("Account created successfully!");
      console.log("User created successfully: ", data);
      return { success: true, message: "Account created successfully!" };
    } catch (error) {
      setError(error.message);
      console.error("Signup error: ", error);
      return { success: false, message: error.message };
    }
  };

  const logIn = async (email, password) => {
    try {
      const response = await Axios.post(
        "https://pixelparts-dev-api.up.railway.app/api/v1/auth/logIn",
        { email, password },
      );

      const { token, date } = response.data;
      const user = date?.user;

      // Store token and user data in cookies
      Cookies.set("authToken", token, { expires: 7 }); // Store token for 7 days
      Cookies.set("userData", JSON.stringify(user), { expires: 7 });

      setCurrentUser(user);
    } catch (error) {
      throw new Error(error.response?.data?.message || "Login failed.");
    }
  };

  const logOut = () => {
    Cookies.remove("authToken");
    Cookies.remove("userData");
    setCurrentUser(null);
  };

  const updateUserData = async (userId, userData) => {
    try {
      await Axios.put(
        `https://pixelparts-dev-api.up.railway.app/api/v1/users/${userId}`,
        userData,
        {
          headers: { Authorization: `Bearer ${Cookies.get("authToken")}` },
        },
      );
      setCurrentUser({ ...currentUser, ...userData });
    } catch (error) {
      throw new Error(error.response?.data?.message || "Update failed.");
    }
  };

  return (
    <AuthContext.Provider
      value={{ currentUser, logIn, logOut, signUp, updateUserData }}
    >
      {!loading && children}
    </AuthContext.Provider>
  );
};

export { AuthContext };
