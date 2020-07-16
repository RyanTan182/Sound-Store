const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');
// Load user model
const User = require('../models/User');
const Staff = require('../models/Staff');

function localStrategy(passport){
passport.use(new LocalStrategy({usernameField: 'email'}, (email, password,
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

/* function localStrategy(passport){
    passport.use(new LocalStrategy({usernameField: 'email'}, (email, password,
    done) => {
    Staff.findOne({ where: {email: email} })
    .then(staff => {
    if(!staff) {
    return done(null, false, {message: 'No User Found'});
    }
    // Match password
    bcrypt.compare(password, staff.password, (err, isMatch) => {
    if(err) throw err;
    if(isMatch) {
    return done(null, staff);
    } else {
    return done(null, false, {message: 'Password incorrect'});
    }
    })
    })
    }));
    // Serializes (stores) user id into session upon successful
    // authentication
    passport.serializeUser((staff, done) => {
    done(null, staff.id); // user.id is used to identify authenticated user
    });
    // User object is retrieved by userId from session and
    // put into req.user
    passport.deserializeUser((id, done) => {
    Staff.findByPk(id)
    .then((staff) => {
    done(null, staff); // user object saved in req.session
    })
    .catch((done) => { // No user found, not stored in req.session
    console.log(done);
    });
    });
    } */
    
module.exports = {localStrategy};