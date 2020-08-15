const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');
// Load user model
const User = require('../models/User');
const GoogleStrategy = require('passport-google-oauth20').Strategy;

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

function googleStrategy(passport){
    passport.use(new GoogleStrategy({
        clientID: '633151802088-au8g5atiipjdddkc9q4aqt1o22teti3h.apps.googleusercontent.com',
        clientSecret: 'dbSR1EDMoHP5495QWaA2dFDK',
        callbackURL: "http://localhost:5000/user/google/redirect",
      },
      function(accessToken, refreshToken, profile, done) {
           User.findOne({
             where:{
               email:profile.emails[0].value,
             },
           }).then((currentUser) =>{
             if (currentUser){
               return done(null,currentUser);
             } else{
               console.log(
                 'User not created yet. This User is being created now'
               );
               User.create({
                 name:profile.displayName,
                 email:profile.emails[0].value,
                 password:profile.id,
                 UserType:'Customer',
                 ContactNo:'',
                 SecurityQn:'',
                 SecurityAnswer:''
               }).then((newuser)=> {
                 return done(null,newuser);
               })
             }
           })
      }
    ));
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
    
module.exports = {localStrategy,googleStrategy};