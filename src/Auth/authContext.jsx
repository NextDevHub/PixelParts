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

  const signUpWithGoogle = async () => {
    try {
      const response = await fetch(
        "https://pixelparts-dev-api.up.railway.app/api/v1/auth/google",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          // body: JSON.stringify({ token: googleToken }),
        },
      );

      if (!response.ok) throw new Error("Google Sign-In failed.");

      const data = await response.json();
      const { user, token } = data;

      Cookies.set("authToken", token, { expires: 7 });
      Cookies.set("userData", JSON.stringify(user), { expires: 7 });

      setCurrentUser(user);
    } catch (error) {
      console.error("Google Signup Error:", error);
    }
  };

  const updateUserData = async (userData) => {
    try {
      const authToken = Cookies.get("authToken");
      if (!authToken) {
        throw new Error("User is not authenticated.");
      }

      const response = await fetch(
        "https://pixelparts-dev-api.up.railway.app/api/v1/user/updateMyInfo",
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${authToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(userData),
        },
      );

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Server response error: ", errorData);
        throw new Error(errorData.message || "Failed to update user data.");
      }

      const data = await response.json();
      console.log("User data updated successfully: ", data.data.updatedUser);
      Cookies.set("userData", JSON.stringify(data.data.updatedUser), {
        expires: 7,
      });
      setCurrentUser(data.data.updatedUser);
      return { success: true, message: "User data updated successfully!" };
    } catch (error) {
      console.error("Update user data error: ", error);
      return { success: false, message: error.message };
    }
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        setCurrentUser,
        logIn,
        logOut,
        signUp,
        signUpWithGoogle,
        updateUserData,
      }}
    >
      {!loading && children}
    </AuthContext.Provider>
  );
};

export { AuthContext };
