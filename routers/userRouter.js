//think routes as like sections of API, a better way of sorting out stuff
const express = require("express");
const router = require("express").Router();
const User = require("../models/userModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const userVerification = require("../models/userVerification");

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
    const { email, password, passwordVerify } = req.body;

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

const sendVerifyEmail = ({ _id, email }, res) => {
  const currentUrl = "http://localhost:5000/";

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
    html: `<p>hey buddy verify yo shit in <b>6 hours</b>.</p><p><a href=${currentUrl +
      "auth/verify/" + _id + "/" + uniqueString}>click</a> or else 10000 year dirty bulk no cut </p>`, // ------------------------------------------------------------------------ fix
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

// get works, this is a **vital** test case, probably
// the most important piece of code here
router.get("/test", (req, res) => {
  res.json({
    poop: "pooooop",
  })
});

// verify email

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
                User.updateOne({ _id: userId }, { verified: true })
                  .then(() => {
                    // delete verification record // ------------------------------------------------------------------------ fix
                    console.log(userId);
                    console.log("userVeri deleted");
                    userVerification
                      .deleteOne({ userId })
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



// if verified then return splash page

router.get("/verified", (req, res) => {
  res.sendFile(path.join(__dirname, "../../frontend/src/pages/verified")); // ------------------------------------------------------------------------ possibly deprecated
})

router.post("/test", async (req, res) => {
  try {
    const { test } = req.body;
    return res.json({ youput: test });
  }
  catch
  {
    return res.json(error);
  }
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
      process.env.JWT_SECRET
    );

    // send the token in a HTTP-only cookie

    res
      .cookie("token", token, {
        httpOnly: true,
        secure: true,
        sameSite: "none",
      })
      .json({
        status: true,
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

module.exports = router;