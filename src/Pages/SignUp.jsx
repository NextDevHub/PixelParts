import { useContext, useState } from "react";
import { Link } from "react-router-dom";
import { TextField, Button, Snackbar } from "@mui/material";
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
  });

  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [open, setOpen] = useState(false);
  const { signUp } = useContext(AuthContext);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    await signUp(formData, setSuccess, setError);
    setOpen(true);
  };

  return (
    <div className="relative flex max-lg:flex-col-reverse justify-center xl:justify-center md:justify-start items-center gap-12 lg:mt-32 xl:gap-24">
      <img src={SignImg} alt="Sign Image" />
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
            label="First Name"
            variant="standard"
            value={formData.firstName}
            onChange={handleChange}
            required
          />
          <TextField
            name="lastName"
            label="Last Name"
            variant="standard"
            value={formData.lastName}
            onChange={handleChange}
            required
          />
          <TextField
            name="email"
            label="Email"
            variant="standard"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <TextField
            name="phoneNumber"
            label="Phone Number"
            variant="standard"
            value={formData.phoneNumber}
            onChange={handleChange}
            required
          />
          <TextField
            name="gender"
            label="Gender"
            variant="standard"
            value={formData.gender}
            onChange={handleChange}
            required
          />
          <TextField
            name="birthDate"
            label="Birth Date"
            type="date"
            InputLabelProps={{ shrink: true }}
            value={formData.birthDate}
            onChange={handleChange}
            required
          />
          <TextField
            name="password"
            type="password"
            label="Password"
            variant="standard"
            value={formData.password}
            onChange={handleChange}
            required
          />
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
