import { useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { TextField, Button, Snackbar, MenuItem } from "@mui/material";
import { Alert } from "@mui/material";
import SignImg from "./SignImg.png";
import { AuthContext } from "../Auth/authContext";
import i18n from "../components/common/components/LangConfig";

const SignUp = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    gender: "",
    birthDate: "",
    password: "",
    confirmPassword: "",
  });

  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [open, setOpen] = useState(false);
  const { signUp } = useContext(AuthContext);

  // Password validation function
  const isPasswordValid = (password) => {
    const passwordRegex = /^(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8,}$/;
    return passwordRegex.test(password);
  };
  const generateRandomPassword = () => {
    const { firstName = "", birthDate = "" } = formData;

    // Extract birth year if valid; otherwise, use a placeholder
    const birthYear = birthDate ? new Date(birthDate).getFullYear() : "0000";

    // Ensure the first name is trimmed and capitalize the first letter
    const sanitizedFirstName =
      firstName.trim().charAt(0).toUpperCase() +
      firstName.trim().slice(1).toLowerCase();

    // Generate a secure random suffix
    const randomSuffix = Math.random().toString(36).substring(2, 6); // 4-character string

    // Combine elements and limit the password length to 16 characters
    const password =
      `${sanitizedFirstName.slice(0, 4)}${birthYear}${randomSuffix}`.substring(
        0,
        12,
      );

    return password;
  };

  const handleGeneratePassword = () => {
    const generatedPassword = generateRandomPassword();
    setFormData((prevData) => ({
      ...prevData,
      password: generatedPassword,
      confirmPassword: generatedPassword,
    }));
  };

  const isBirthDateValid = (birthDate) => {
    const today = new Date();
    const birthDateObj = new Date(birthDate);
    let age = today.getFullYear() - birthDateObj.getFullYear();
    const monthDiff = today.getMonth() - birthDateObj.getMonth();
    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birthDateObj.getDate())
    ) {
      age--;
    }
    return age >= 10;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    const { birthDate, password, confirmPassword } = formData;

    if (!isBirthDateValid(birthDate)) {
      setError(i18n.t("signUpPage.ageError"));
      setOpen(true);
      return;
    }

    if (!isPasswordValid(password)) {
      setError(i18n.t("signUpPage.passwordError"));
      setOpen(true);
      return;
    }

    if (password !== confirmPassword) {
      setError(i18n.t("signUpPage.passwordMismatch"));
      setOpen(true);
      return;
    }

    await signUp(formData, setSuccess, setError);
    setOpen(true);
  };

  const navigate = useNavigate();

  const handleGoogleSignUp = async () => {
    try {
      navigate("./signupWithGoogle");
      const response = await fetch(
        "https://pixelparts-dev-api.up.railway.app/api/v1/auth/google",
        {
          credentials: "include", // Ensure session/cookie-based auth
        },
      );
      const data = await response.json();

      if (data) {
        setFormData({
          firstName: data.firstName || "",
          lastName: data.lastName || "",
          email: data.email || "",
        });

        navigate("/signup"); // Redirect if user data is not found
      }
    } catch (error) {
      console.error("Error fetching user:", error);
    }
  };

  return (
    <div className="relative flex max-lg:flex-col-reverse justify-center xl:justify-center md:justify-start items-center gap-12 lg:mt-32 xl:gap-24">
      <img src={SignImg} alt={i18n.t("signUpPage.imageAlt")} />
      <div className="flex flex-col gap-6 md:gap-8 md:mx-10 items-center sm:items-start max-lg:mt-40 justify-center">
        <h1 className="text-4xl font-medium font-inter">
          {i18n.t("signUpPage.title")}
        </h1>
        <p>{i18n.t("signUpPage.enter")}</p>
        <form
          className="flex flex-col gap-6 w-72 md:w-96"
          onSubmit={handleSignUp}
        >
          <TextField
            name="firstName"
            label={i18n.t("signUpPage.firstName")}
            variant="standard"
            value={formData.firstName}
            onChange={handleChange}
            required
          />
          <TextField
            name="lastName"
            label={i18n.t("signUpPage.lastName")}
            variant="standard"
            value={formData.lastName}
            onChange={handleChange}
            required
          />
          <TextField
            name="email"
            label={i18n.t("signUpPage.email")}
            variant="standard"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <TextField
            name="phoneNumber"
            label={i18n.t("signUpPage.phoneNumber")}
            variant="standard"
            value={formData.phoneNumber}
            onChange={handleChange}
            required
          />
          <TextField
            select
            name="gender"
            label={i18n.t("signUpPage.gender")}
            variant="standard"
            value={formData.gender}
            onChange={handleChange}
            required
          >
            <MenuItem value="">
              <em>{i18n.t("signUpPage.none")}</em>
            </MenuItem>
            <MenuItem value="Male">{i18n.t("signUpPage.male")}</MenuItem>
            <MenuItem value="Female">{i18n.t("signUpPage.female")}</MenuItem>
          </TextField>
          <TextField
            name="birthDate"
            label={i18n.t("signUpPage.birthDate")}
            type="date"
            InputLabelProps={{ shrink: true }}
            value={formData.birthDate}
            onChange={handleChange}
            required
          />
          <TextField
            name="password"
            // type="password"
            label={i18n.t("signUpPage.password")}
            variant="standard"
            value={formData.password}
            onChange={handleChange}
            required
          />
          <TextField
            name="confirmPassword"
            type="password"
            label={i18n.t("signUpPage.confirmPassword")}
            variant="standard"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
          />
          <Button
            onClick={handleGeneratePassword}
            sx={{
              color: "black",
              fontSize: "16px",
              bgcolor: "white",
              textTransform: "none",
              borderRadius: "4px",
              fontWeight: "500",
              width: "100%",
              border: "1px solid hsla(0, 0%, 0%, 0.4)",
              ":hover": {
                bgcolor: "hsla(0, 68%, 56%, 1)",
                fontWeight: "500",
                color: "white",
                border: "0",
              },
            }}
            variant="outlined"
            color="secondary"
          >
            Generate Password
          </Button>
          <Button
            type="submit"
            sx={{
              color: "white",
              fontSize: "16px",
              bgcolor: "hsla(0, 68%, 56%, .9)",
              textTransform: "none",
              padding: "16px 0",
              borderRadius: "4px",
              fontWeight: "500",
              width: "100%",
              marginTop: "1rem",
              ":hover": {
                bgcolor: "hsla(0, 68%, 56%, 1)",
                fontWeight: "500",
              },
            }}
            variant="contained"
            color="primary"
            className="my-2"
          >
            {i18n.t("signUpPage.createAccount")}
          </Button>
        </form>
        <div className="w-72 md:w-96">
          <Button
            onClick={handleGoogleSignUp}
            className="flex items-center justify-center gap-4"
            sx={{
              color: "black",
              fontSize: "16px",
              bgcolor: "white",
              textTransform: "none",
              padding: "16px 0",
              borderRadius: "4px",
              fontWeight: "500",
              width: "100%",
              border: "1px solid hsla(0, 0%, 0%, 0.4)",
              ":hover": {
                bgcolor: "hsla(0, 0%, 0%, 1)",
                color: "white",
                fontWeight: "500",
              },
            }}
          >
            {/* Google Icon SVG */}
            <svg
              width="24"
              height="25"
              viewBox="0 0 24 25"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <g clipPath="url(#clip0_1920_3336)">
                <path
                  d="M23.766 12.7764C23.766 11.9607 23.6999 11.1406 23.5588 10.3381H12.24V14.9591H18.7217C18.4528 16.4494 17.5885 17.7678 16.323 18.6056V21.6039H20.19C22.4608 19.5139 23.766 16.4274 23.766 12.7764Z"
                  fill="#4285F4"
                />
                <path
                  d="M12.2401 24.5008C15.4766 24.5008 18.2059 23.4382 20.1945 21.6039L16.3276 18.6055C15.2517 19.3375 13.8627 19.752 12.2445 19.752C9.11388 19.752 6.45946 17.6399 5.50705 14.8003H1.5166V17.8912C3.55371 21.9434 7.7029 24.5008 12.2401 24.5008Z"
                  fill="#34A853"
                />
                <path
                  d="M5.50253 14.8003C4.99987 13.3099 4.99987 11.6961 5.50253 10.2057V7.11481H1.51649C-0.18551 10.5056 -0.18551 14.5004 1.51649 17.8912L5.50253 14.8003Z"
                  fill="#FBBC04"
                />
                <path
                  d="M12.2401 5.24966C13.9509 5.2232 15.6044 5.86697 16.8434 7.04867L20.2695 3.62262C18.1001 1.5855 15.2208 0.465534 12.2401 0.500809C7.7029 0.500809 3.55371 3.05822 1.5166 7.11481L5.50264 10.2058C6.45064 7.36173 9.10947 5.24966 12.2401 5.24966Z"
                  fill="#EA4335"
                />
              </g>
              <defs>
                <clipPath id="clip0_1920_3336">
                  <rect
                    width="24"
                    height="24"
                    fill="white"
                    transform="translate(0 0.5)"
                  />
                </clipPath>
              </defs>
            </svg>
            <span> {i18n.t("signUpPage.withGoogle")}</span>
          </Button>
        </div>
        <p className="text-gray-600 mx-auto">
          {i18n.t("signUpPage.haveAccount")}{" "}
          <Link
            to="/login"
            className="ml-2 text-gray font-medium hover:underline"
          >
            {i18n.t("signUpPage.login")}
          </Link>
        </p>
      </div>
      <Snackbar
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        open={open}
        autoHideDuration={4000}
        onClose={() => setOpen(false)}
      >
        {success ? (
          <Alert
            onClose={() => setOpen(false)}
            severity="success"
            sx={{ width: "100%" }}
          >
            {success}
          </Alert>
        ) : (
          <Alert
            onClose={() => setOpen(false)}
            severity="error"
            sx={{ width: "100%" }}
          >
            {error}
          </Alert>
        )}
      </Snackbar>
    </div>
  );
};

export default SignUp;
