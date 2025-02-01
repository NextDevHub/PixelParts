import { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../Auth/authContext";

const SignupWithGoogle = () => {
  const { currentUser } = useContext(AuthContext);
  const { signUpWithGoogle } = useContext(AuthContext);
  const navigate = useNavigate();
  useEffect(() => {
    signUpWithGoogle();
  }, []);

  return (
    <div className="mt-60 mx-20 ">
      {currentUser ? (
        <>
          <h2>Google Sign-Up Successful</h2>
          <p>
            Name: {currentUser.firstname} {currentUser.lastname}
          </p>
          <p>Email: {currentUser.email}</p>
        </>
      ) : (
        <>
          <h2>Loading...</h2>
        </>
      )}
    </div>
  );
};

export default SignupWithGoogle;
