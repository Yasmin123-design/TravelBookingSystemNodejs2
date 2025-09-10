const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const FacebookStrategy = require("passport-facebook").Strategy;
const userModel = require("../Models/UserModel");

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "/users/google/callback",
}, async (accessToken, refreshToken, profile, done) => {
    let email = profile.emails[0].value;
    let user = await userModel.findByEmail(profile.emails[0].value);
    if (!user) {
        let role = (email === "admin@email.com") ? "admin" : "user";
        user = await userModel.createUser({
            name: profile.displayName,
            email: profile.emails[0].value,
            password: null,
            role:role
        });
    }
    done(null, user);
}));

passport.use(new FacebookStrategy({
    clientID: process.env.FACEBOOK_APP_ID,
    clientSecret: process.env.FACEBOOK_APP_SECRET,
    callbackURL: "/users/facebook/callback",
    profileFields: ["id", "displayName", "emails"]
}, async (accessToken, refreshToken, profile, done) => {
    let email = profile.emails ? profile.emails[0].value : `${profile.id}@facebook.com`;
    let user = await userModel.findByEmail(email);
    if (!user) {
        let role = (email === "admin@email.com") ? "admin" : "user";
        user = await userModel.createUser({
            name: profile.displayName,
            email: email,
            password: null,
            role:role
        });
    }
    done(null, user);
}));
