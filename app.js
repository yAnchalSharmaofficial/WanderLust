if (process.env.NODE_ENV != "production") {
    require('dotenv').config();
}
console.log(process.env.API_KEY)
console.log(process.env.CLOUD_NAME)
console.log(process.env.API_SECRET_KEY)

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride=require("method-override");
const ejsMate=require("ejs-mate");
const ExpressError= require("./utils/ExpressError.js");
const session = require("express-session");
const MongoStore = require('connect-mongo');
const flash=require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");


const listingsRouter=require("./routes/listing.js");
const reviewsRouter=require("./routes/review.js");
const usersRouter=require("./routes/user.js");


const dburl = process.env.ATLASDB_URL;

main().then(()=> {
    console.log("connected to DB");
})
.catch((err) => {
    console.log(err);
});

async function main() {
    await mongoose.connect(dburl);
}

app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname,"public")));

const store = MongoStore.create({
    mongoUrl :dburl,
    crypto:{
        secret:process.env.SECRET,    
    },
    touchAfter:24 * 3600,
});

store.on("error",() => {
    console.log("ERROR IN MONGO SESSION STORE",err);
})

const sessionOptions = {
    store,
    secret:process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    cookie:{
        expires:Date.now()+7*24*60*60*1000,
        maxAge:7*24*60*60*1000,
        httpOnly:true,
    },
};


// app.get("/",(req,res) => {
//     res.send("Hii I am root");
// });

app.use(session(sessionOptions));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.use((req,res,next) => {
    res.locals.successMsg = req.flash("success");
    res.locals.errorMsg = req.flash("error");
    res.locals.currUser = req.user;
    next();
})

// app.get("/demouser", async(req,res) => {
//     let fakeUser = new User({
//         email:"student@gmail.com",
//         username:"delta-student",
//     });

//     let registeredUser = await User.register(fakeUser,"helloworld");
//     res.send(registeredUser);
// });

app.use("/listings",listingsRouter);
app.use("/listings/:id/reviews",reviewsRouter);
app.use("/",usersRouter);



app.all("*",(req,res,next) => {
    next(new ExpressError(404,"Page Not Found"));
});

app.use((err,req,res,next) =>{
    let { statusCode = 500, message="Something went Wrong" }=err;
    res.status(statusCode).render("error.ejs",{ message });
    // res.status(statusCode).send(message);
});


app.listen(8080,() => {
    console.log("Server is listening to port 8080");
});