require('dotenv').config();
console.log(process.env.CLOUD_NAME);
console.log(process.env.CLOUD_API_KEY);
console.log(process.env.CLOUD_API_SECRET);

// console.log(process.env);

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate=require("ejs-mate");
const expressError=require("./utils/expressError.js");

const session=require("express-session");
const MongoStore = require('connect-mongo');

const flash=require("connect-flash");
const passport=require("passport");
const localStrategy=require("passport-local");
const User =require("./models/user.js");
const reviewsRouter= require("./routes/reviews.js");
const listingsRouter = require("./routes/listing.js");
const userRouter = require("./routes/user.js");

// const MONGO_URL = "mongodb://127.0.0.1:27017/Travellis";
const dbUrl=process.env.ATLASDB_URL


main()
  .then(() => {
    console.log("connected to DB");
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
  await mongoose.connect(dbUrl);
}

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));


app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine("ejs",ejsMate);
app.use(express.static(path.join(__dirname,"/public")));


const store=MongoStore.create({
  mongoUrl:dbUrl,
  crypto:{
    secret:process.env.SECRET,
  },
  touchAfter:24*3600,
});

store.on("error",(e)=>{
  console.log("Mongo session store error ",e);
});

const sessionOptions={
  store,
  secret:process.env.SECRET,
  resave: false,
  saveUninitialized: true,
  cookie:{
    expires:Date.now()+ 7 * 24 * 60 * 60 * 1000,
    maxAge: 7 * 24 * 60 * 60 * 1000, // 24 hours in milliseconds
    httpOnly: true,
  },
};

// app.get("/", (req, res) => {
//   res.send("Hi, I am root");
// });



app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());

app.use((req,res,next)=>{
  res.locals.currUser=req.user;
  res.locals.error=req.flash("error");
  res.locals.success = req.flash("success");
  next(); 
});



// use static authenticate method of model in LocalStrategy
passport.use(new localStrategy(User.authenticate()));

// use static serialize and deserialize of model for passport session support
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// For Listings Routes
app.use("/listings",listingsRouter);
//For Reviews Routes
app.use("/listings/:id/reviews",reviewsRouter);
app.use("/",userRouter);





app.all("*",(req,res,next)=>{
  next(new expressError(404,"Page not Found!"));

});

app.use((err,req,res,next)=>{
  let {statusCode=500,message="Something went wrong!"}=err;
  // res.status(statusCode).send(message);
  res.render("listings/error.ejs",{message});
});

app.listen(8090, () => {
  console.log("server is listening to port 8090");
});