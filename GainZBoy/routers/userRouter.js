//think routes as like sections of API, a better way of sorting out stuff
const express = require("express");
const router = require("express").Router();
const User = require("../models/userModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
var mongo = require('mongodb');

const userVerification = require("../models/userVerification");
const passwordReset = require("../models/passwordReset");

// email handler
const nodemailer = require("nodemailer");

// unique string gen
const { v4: uuidv4 } = require("uuid");

// env variable
require("dotenv").config();

const path = require("path");



// register
router.post("/register", async (req, res) => {
  try {
    const { email, password, passwordVerify, fullname } = req.body;

    // validation
    //If missing a field
    if (!email || !password || !passwordVerify)
      return res
        .status(400)
        .json({ errorMessage: "Please enter all required fields." });
    //If password isn't secure
    if (password.length < 6)
      return res.status(400).json({
        errorMessage: "Please enter a password of at least 6 characters.",
      });
    //If passwords don't match
    if (password !== passwordVerify)
      return res.status(400).json({
        errorMessage: "Please enter the same password twice.",
      });
    //If Users exist
    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({
        errorMessage: "An account with this email already exists.",
      });


    // hash the password
    const salt = await bcrypt.genSalt();
    const passwordHash = await bcrypt.hash(password, salt);

    //Save user to DB
    const newUser = new User({
      fullname,
      email,
      passwordHash,
      verified: false,
    });

    // devs -- .save.then.catch is the long version of await
    // learned that after typing everything up lol
    newUser
      .save()
      .then((result) => {
        sendVerifyEmail(result, res);
      })
      .catch((err) => {

      });

  } catch (err) {
    console.error(err);
    res.status(500).send();
  }
});


// send verification email

const sendVerifyEmail = ({ _id, email, fullname }, res) => {
  // const currentUrl = "http://localhost:5000";
  const currentUrl = "https://gainzboy.herokuapp.com";

  const uniqueString = uuidv4() + _id;


  var transporter = nodemailer.createTransport({
    // name: "smtp.mailtrap.io",
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: process.env.VERIFY_EMAIL,
      pass: process.env.VERIFY_PASSWORD, // app password
    },
    tls: {
      rejectUnauthorized: false
    }
  });

  // send mail with defined transport object
  const mailOptions = {
    from: 'nattyphattyy@gmail.com', // Sender address
    to: email, // List of recipients
    subject: 'Verify your Email', // Subject line
    text: 'sent via node mailer', // Plain text body
    html: `<p>hey ` + fullname + ` verify your account in <b>6 hours</b>.</p><p><a href=${currentUrl +
      "/auth/verify/" + _id + "/" + uniqueString}>click</a> or else 10000 year dirty bulk no cut </p>`, // ------------------------------------------------------------------------ fix
  };


  // hash uniqueString that user sends back

  const saltRounds = 10;
  bcrypt
    .hash(uniqueString, saltRounds)
    .then((stringHash) => {
      const newVerification = new userVerification({
        userId: _id,
        uniqueString: stringHash,
        createdAt: Date.now(),
        expiresAt: Date.now() + 21600000,
      })

      // save the new verification attempt to records then send verification email
      newVerification
        .save()
        .then(() => {
          transporter.sendMail(mailOptions);
          res.json({
            status: "PENDING",
            errorMessage: "Verification pending", // ------------------------------------------------------------------------ fix
          })
        })
        .catch((error) => {
          console.log(error);
          res.json({ status: "failed", errorMessage: "Error saving verification email data" }) // ------------------------------------------------------------------------ fix

        })
    })
    .catch((error) => {
      res.json({ status: "failed", errorMessage: "Error encrypting salt hash" }) // ------------------------------------------------------------------------ fix

      console.log("error encrypting salt hash");
    })
}



router.get("/verify/:userId/:uniqueString", (req, res) => {
  let { userId, uniqueString } = req.params;
  userVerification
    .find({ userId })
    .then((result) => {

      if (result.length > 0) {

        const { expiresAt } = result[0];
        const stringHash = result[0].uniqueString;

        if (expiresAt < Date.now()) {
          // record has expired
          userVerification
            .deleteOne({ userId })
            .then(result => {
              User
                .deleteOne({ _id: userId })
            })
            .catch((error) => {
              console.log(error);
              let errorMessage = "Token expired";
              res.json({ errorMessage: errorMessage });// ------------------------------------------------------------------------ fix
            })
        } else {
          // valid record exists
          // compare hashed string

          bcrypt
            .compare(uniqueString, stringHash)
            .then(result => {
              if (result) {
                // strings match
                console.log({ result });

                var myquery = { _id: userId };
                var newvalues = { $set: { verified: true } };

                User.updateOne(myquery, newvalues)
                  .then(() => {
                    // delete verification record
                    userVerification.findOne({ userId })
                      .then(result => {
                        console.log({ result });
                        (async () => await userVerification.deleteOne(result))()
                      })
                  })
                  .then(() => {
                    var options = {
                      root: __dirname + '../../../frontend/src/pages/',
                    };

                    res.sendFile('verified.js', options, function (err) {
                      if (err) {
                        console.log(err);
                        res.status(err.status).end(); // ------------------------------------------------------------------------ fix
                      }
                      else {
                        console.log('Splash sent');
                      }
                    });

                    // res.sendFile(path.join(__dirname, "../../../frontend/src/pages/verified"));
                  })
                  .catch(error => {
                    console.log(error);
                    let errorMessage = "Error occurred verifying user";
                    res.json({ errorMessage: errorMessage });// ------------------------------------------------------------------------ fix
                  })
              } else {
                // strings don't match
                console.log("here" + uniqueString);
                console.log(stringHash);
              }
            })
        }
      } else {

        let errorMessage = "Account doesn't exist or has already been verified, try logging in";
        console.log(errorMessage);
        res.json({ errorMessage: errorMessage });
      }
    })
    .catch((error) => {

      let errorMessage = "Error occurred checking existing verification";
      console.log(errorMessage);
      res.json({ errorMessage: errorMessage });
    })
});




// Password Reset email


// if verified then return splash page

router.get("/verified", (req, res) => {
  res.sendFile(path.join(__dirname, "../../frontend/src/pages/verified")); // ------------------------------------------------------------------------ possibly deprecated
})


// log in API
router.post("/login", async (req, res) => {
  try {

    const { email, password } = req.body;


    // validate
    if (!email || !password)
      return res
        .status(400)
        .json({ errorMessage: "Please enter all required fields." });

    const existingUser = await User.findOne({ email });

    if (!existingUser)
      return res.status(401).json({ errorMessage: "Wrong email or password." });

    const passwordCorrect = await bcrypt.compare(
      password,
      existingUser.passwordHash
    );
    if (!passwordCorrect) {
      return res.status(401).json({ errorMessage: "Wrong email or password." });
    } else {
      if (!(existingUser.verified)) {
        return res.status(401).json({ errorMessage: "Account not yet validated." });  // ------------------------------------------------------------------------ fix
      }
    }


    // sign the token

    const token = jwt.sign(
      {
        user: existingUser._id,
      },
      process.env.JWT_SECRET,
      { expiresIn: '30m' }
    );

    // send the token in a HTTP-only cookie

    console.log("is this aight 3");

    res
      .cookie("token", token, {
        httpOnly: true,
        secure: true,
        sameSite: "none",
      })
      .json({
        status: true,
        // could probably "better way" this for better security
        // by decrypting the cookie but eh
        fullname: existingUser.fullname,
        userID: existingUser._id,
        token: token,
        err: "",
      })
      .send();
  } catch (err) {
    console.error(err);
    res.status(500).send();
  }
});



// log out API
router.get("/logout", (req, res) => {
  res
    .cookie("token", "", {
      httpOnly: true,
      expires: new Date(0),
      secure: true,
      sameSite: "none",
    })
    .send();
});

// logged and security (Token)
router.get("/loggedIn", (req, res) => {
  try {
    const token = req.cookies.token;
    if (!token) return res.json(false);

    jwt.verify(token, process.env.JWT_SECRET);

    res.send(true);
  } catch (err) {
    res.json(false);
  }
});










// API for starting the password reset process
router.post("/sendPasswordReset", async (req, res) => {


  const { email } = req.body;
  try {

    const userDude = await User.find({ email });

    // setting parameters to send to resetEmail func
    const _id = userDude[0]._id;
    const sendEmail = userDude[0].email;
    const fullname = userDude[0].fullname;

    sendShit = {
      _id: _id,
      email: sendEmail,
      fullname: fullname
    };

    console.log({ sendShit });

    sendPasswordResetEmail(sendShit, res);

  }
  catch (e) {
    console.log(e);
  }
});


// helper function sends password reset email

const sendPasswordResetEmail = ({ _id, email, fullname }, res) => {
  // const currentUrl = "http://localhost:5000";
  const currentUrl = "https://gainzboy.herokuapp.com";


  const uniqueString = uuidv4() + _id;
  var transporter = nodemailer.createTransport({
    // name: "smtp.mailtrap.io",
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: process.env.VERIFY_EMAIL,
      pass: process.env.VERIFY_PASSWORD, // app password
    },
    tls: {
      rejectUnauthorized: false
    }
  });

  // send mail with defined transport object
  const mailOptions = {
    from: 'nattyphattyy@gmail.com', // Sender address
    to: email, // List of recipients
    subject: 'Reset your Gainzboy Password', // Subject line
    text: 'sent via node mailer', // Plain text body
    html: `<p>hey ` + fullname + ` reset your password in <b>6 hours</b>.</p><p><a href=${currentUrl +
      "/auth/reset/" + _id + "/" + uniqueString}>click</a> or else the roids be rancid </p>`, // ------------------------------------------------------------------------ fix
  };


  // hash uniqueString that user sends back

  const saltRounds = 10;
  bcrypt
    .hash(uniqueString, saltRounds)
    .then((stringHash) => {
      const newPassReset = new passwordReset({
        userId: _id,
        uniqueString: stringHash,
        verified: false,
        createdAt: Date.now(),
        expiresAt: Date.now() + 21600000,
      })

      // save the new verification attempt to records then send verification email
      newPassReset
        .save()
        .then(() => {
          transporter.sendMail(mailOptions);
          res.json({
            status: "PENDING",
            errorMessage: "Reset Email sent", // ------------------------------------------------------------------------ fix
          })
        })
        .catch((error) => {
          console.log(error);
          res.json({ status: "failed", errorMessage: "Error saving verification email data" }) // ------------------------------------------------------------------------ fix

        })
    })
    .catch((error) => {
      res.json({ status: "failed", errorMessage: "Error encrypting salt hash" }) // ------------------------------------------------------------------------ fix

      console.log("error encrypting salt hash");
    })
}


// from user clicking in email

// checking credentials 
// if true, send password reset site
// update password reset object verified to True
router.get("/reset/:userId/:uniqueString", (req, res) => {
  let { userId, uniqueString } = req.params;
  passwordReset
    .find({ userId })
    .then((result) => {

      if (result.length > 0) {


        const stringHash = result[0].uniqueString;

        bcrypt
          .compare(uniqueString, stringHash)
          .then(result => {
            if (result) {
              // strings match
              console.log("strings match");
              passwordReset.findOne({ userId: userId })
                .then(result => {
                  var myquery = { userId: userId };
                  var newvalues = { $set: { verified: true } };

                  (async () => await passwordReset.updateOne(myquery, newvalues))()
                })
                .catch(e => {
                  console.log(e);
                })


              // send password reset site                              ------------------------------------------- send site

              var options = {
                root: __dirname + '../../frontend/src/pages/',
                headers: {
                  'userId': userId,
                }
              };

              res.sendFile('resetPage.js', options, function (err) {
                if (err) {
                  console.log(err);
                  res.status(err.status).end(); // ------------------------------------------------------------------------ fix
                }
                else {
                  console.log('Splash sent');
                }
              });

            } else {
              // strings don't match
              let errorMessage = "strings don't match";
              console.log(errorMessage);
              res.json({ errorMessage: errorMessage });
            }
          })


      } else {

        let errorMessage = "Password already reset or account doesn't exist";
        console.log(errorMessage);
        res.json({ errorMessage: errorMessage });
      }
    })
    .catch((error) => {

      let errorMessage = "something wrong in sending password reset site";
      console.log(errorMessage);
      res.json({ errorMessage: errorMessage });
    })
});



// update password page
router.post("/setPassword/", async (req, res) => {

  const { userId: userId, password: password } = req.body;

  // hash the password first

  const salt = await bcrypt.genSalt();
  const passwordHash = await bcrypt.hash(password, salt);

  var myquery = { _id: userId };
  var newvalues = { $set: { passwordHash: passwordHash } };
  User.updateOne(myquery, newvalues)
    .then(() => {
      // delete verification record
      passwordReset.find({ userId })
        .then(result => {
          if (result[0].verified) {
            (async () => await passwordReset.deleteOne({ result }))()
            console.log("deletedResult");
          }
          else {
            console.log("did not delete result");
          }
        })
    })
    .then(() => {
      var options = {
        root: __dirname + '../../../frontend/src/pages/',
      };

      res.sendFile('successPage.js', options, function (err) {
        if (err) {
          console.log(err);
          res.status(err.status).end(); // ------------------------------------------------------------------------ fix
        }
        else {
          console.log('Splash sent');
        }
      });

      // res.sendFile(path.join(__dirname, "../../../frontend/src/pages/verified"));
    })
    .catch(error => {
      console.log(error);
      let errorMessage = "Error occurred verifying user";
      res.json({ errorMessage: errorMessage });// ------------------------------------------------------------------------ fix
    })
})



module.exports = router;