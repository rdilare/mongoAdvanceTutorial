const passport = require('passport');
const LocalStrategy = require("passport-local");
const bcrypt = require("bcrypt");
const ObjectID = require("mongodb").ObjectID;



module.exports = function (app, db) {

  app.use(passport.initialize());
  app.use(passport.session());

    passport.serializeUser((user, done) => {
      done(null, user._id);
    });

    passport.deserializeUser((id, done) => {
      db.collection("users").findOne({ _id: new ObjectID(id) }, (err, doc) => {
        done(null, doc);
      });
    });

    //     app.use((req, res, next) => {
    //   res.status(404)
    //     .type('text')
    //     .send('Not Found');
    // });

    passport.use(
      new LocalStrategy(function(username, password, done) {
        db.collection("users").findOne({ username: username }, function(
          err,
          user
        ) {
          console.log("User " + username + " attempted to log in.");
          if (err) {
            return done(err);
          }
          if (!user) {
            console.log("User " + username + " not registered.");
            return done(null, false);
          }
          if (!bcrypt.compareSync(password, user.password)){
            console.log("User " + username + " logged in.");
            return done(null, false);
          }
          return done(null, user);
        });
      })
    );

}