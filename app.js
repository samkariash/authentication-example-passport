var express=require("express");
var mongoose=require("mongoose");
var passport=require("passport");

var bodyParser=require("body-parser");
var User=require("./models/user");
var LocalStrategy=require("passport-local");
var passportLocalMongoose=require("passport-local-mongoose");


var uri = "mongodb+srv://samkaria:xxxxxxx@vvbbsd-xohlt.mongodb.net/test?retryWrites=true";

mongoose.connect(uri,{useNewUrlParser: true});



var app=express();
app.set('view engine','ejs');

app.use(require("express-session")({
    secret:"this is my secret",
    resave:false,
    saveUninitialized:false
}));


app.use(passport.initialize());
app.use(passport.session());
app.use(bodyParser.urlencoded({extended:true}))

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


//routes
app.get("/", function(req, res){
    res.render("home");
})

app.get("/secret", isLoggedIn,function(req,res){
    res.render("secret");
})

app.get("/register",function(req,res){
    res.render("register")
})

app.post("/register",function(req,res){
    req.body.username
    req.body.password
    console.log( req.body.username)
    console.log( req.body.password)
   User.register(new User({username: req.body.username}),req.body.password, function(err, user){
       if(err){
           console.log(err);
           return res.render('register');
       }
       passport.authenticate("local")(req,res,function(){
        console.log("You are here now");
           res.redirect("/secret");
       })
   })
})

app.get("/login", function(req,res){
    res.render("login");
})

// use of middleware
app.post("/login", passport.authenticate("local",{
    successRedirect:"/secret",
    failureRedirect:"/login",
}),function(req, res){

});

app.get("/logout", function(req, res){
    req.logout();
    res.redirect("/");
})

function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    else{
        res.render("login");
    }
}

app.listen(3200,function(){
    console.log("auth app is listening")
})