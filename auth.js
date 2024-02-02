const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;

let profileData;

passport.use(
    new GoogleStrategy(
        {
            clientID:
                "909967521844-aeudc5tp7rjm58gr4sfjikmt8sf12etk.apps.googleusercontent.com",
            clientSecret: "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",
            callbackURL:
                "https://wecode-mjrg.onrender.com/auth/google/callback",
            //"http://localhost:3000/auth/google/callback",
            profileURL: "https://www.googleapis.com/oauth2/v3/userinfo",
        },
        (accessToken, refreshToken, profile, done) => {
            console.log("Passport Callback Function Started");
            console.log(profile);
            profileData = profile;
            return done(null, "/home");
        }
    )
);

passport.serializeUser(function (profile, done) {
    done(null, profile);
});

passport.deserializeUser(function (obj, done) {
    done(null, obj);
});
module.exports.passport = passport;
module.exports.getProfile = function () {
    return profileData;
};
