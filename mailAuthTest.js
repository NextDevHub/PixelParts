import passport from "passport";
import session from "express-session";
import "./passportConfig.js"; // Import the passport configuration

import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());
app.use(cookieParser());

const PORT = process.env.PORT || 3000;

// app.use(session({
//   secret: 'your-session-secret',
//   resave: false,
//   saveUninitialized: true
// }));

app.use(passport.initialize());

app.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

app.get(
  "/auth/google/callback",
  passport.authenticate("google", { failureRedirect: "/" }),
  (req, res) => {
    // Successful authentication, redirect home.
    res.redirect("/");
  }
);

app.get("/logout", (req, res) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    res.redirect("/");
  });
});

const server = app.listen(PORT, () => {
  console.log(`Server starts listening on port ${PORT}....`);
});
