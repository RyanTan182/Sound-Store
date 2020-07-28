const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');
// Load user model
const User = require('../models/User');
/* var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy; */

function localStrategy(passport){
passport.use('User',new LocalStrategy({usernameField: 'email'}, (email, password,
done) => {
User.findOne({ where: {email: email} })
.then(user => {
if(!user) {
return done(null, false, {message: 'No User Found'});
}
// Match password
bcrypt.compare(password, user.password, (err, isMatch) => {
if(err) throw err;
if(isMatch) {
return done(null, user);
} else {
return done(null, false, {message: 'Password incorrect'});
}
})
})
}));
// Serializes (stores) user id into session upon successful
// authentication
passport.serializeUser((user, done) => {
done(null, user.id); // user.id is used to identify authenticated user
});
// User object is retrieved by userId from session and
// put into req.user
passport.deserializeUser((userId, done) => {
User.findByPk(userId)
.then((user) => {
done(null, user); // user object saved in req.session
})
.catch((done) => { // No user found, not stored in req.session
console.log(done);
});
});
}

/* function GoogleStrategy(passport){
    passport.use(new GoogleStrategy({
        clientID: '633151802088-au8g5atiipjdddkc9q4aqt1o22teti3h.apps.googleusercontent.com',
        clientSecret: 'dbSR1EDMoHP5495QWaA2dFDK',
        callbackURL: "http://localhost:5000/"
      },
      function(accessToken, refreshToken, profile, done) {
           User.findOrCreate({ googleId: profile.id }, function (err, user) {
             return done(err, user);
           });
      }
    ));
} */

    
module.exports = {localStrategy};