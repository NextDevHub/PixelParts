import { useContext, useState } from "react";
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
  const sanitizedFirstName = firstName.trim().charAt(0).toUpperCase() + firstName.trim().slice(1).toLowerCase();

  // Generate a secure random suffix
  const randomSuffix = Math.random().toString(36).substring(2, 6); // 4-character string

  // Combine elements and limit the password length to 16 characters
  const password = `${sanitizedFirstName.slice(0, 4)}${birthYear}${randomSuffix}`.substring(0, 12);

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
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDateObj.getDate())) {
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
          sx={{ textTransform: "none", marginTop: "8px" }}
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
