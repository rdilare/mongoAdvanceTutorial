const passport = require('passport');
const bcrypt = require("bcrypt");

function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/");
}


module.exports = function (app, db) {

    app.route("/").get((req, res) => {
      res.render(process.cwd() + "/views/pug/index", {
        title: "Hello",
        message: "login",
        showLogin: true,
        showRegistration: true
      });
    });

    app
      .route("/login")
      .post(
        passport.authenticate("local", { failureRedirect: "/" }),
        (req, res) => {
          console.log("user "+req.user.username+ " logged in");
          res.redirect("/profile");
        }
      );

    app.route("/profile").get(ensureAuthenticated, (req, res) => {
      res.render(process.cwd() + "/views/pug/profile", {
        username: req.user.username
      });
    });

    app.route("/logout").get((req, res) => {
      var user = req.user.username;
      req.logout();
      console.log("user "+user+" logged out");
      res.redirect("/");
    });

    app.route("/register").post(
      (req, res, next) => {
        db.collection("users").findOne(
          { username: req.body.username },
          function(err, user) {
            if (err) {
              next(err);
            } else if (user) {
              console.log("already registerd");
              res.redirect("/");
            } else {
              var hash = bcrypt.hashSync(req.body.password,12);
              db.collection("users").insertOne(
                {
                  username: req.body.username,
                  password: hash
                },
                (err, doc) => {
                  if (err) {
                    console.log("unable to register");
                    res.redirect("/");
                  } else {
                    next(null, user);
                  }
                }
              );
            }
          }
        );
      },
      passport.authenticate("local", { failureRedirect: "/" }),
      (req, res, next) => {
        res.redirect("/profile");
      }
    );

}