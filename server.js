const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");

dotenv.config();

// set up server

const path = require("path");
const PORT = process.env.PORT || 5000;

const app = express();

app.set('port', (process.env.PORT || 5000));


app.listen(PORT, () => console.log(`Server started on port: ${PORT}`));

///////////////////////////////////////////////////
// For Heroku deployment
// Server static assets if in production
if (process.env.NODE_ENV === 'production') {
  // Set static folder
  app.use(express.static('frontend/build'));
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'frontend', 'build', 'index.html'));
  });
}

////////////////////////////////////////////////////

app.use(express.json());
app.use(cookieParser());

// connect to Database
mongoose.connect(
  process.env.DB,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  },
  (err) => {
    if (err) return console.error(err);
    console.log("Connected to Database");
  }
);

// set up the routes
app.use("/auth", require("./routers/userRouter"));
app.use("/customer", require("./routers/customerRouter"));
// app.use("/signup", require("./routers/registerRouter"));

