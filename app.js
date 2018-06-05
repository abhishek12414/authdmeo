const express = require('express'),
      mongoose = require('mongoose')
      passport = require('passport'),
      bodyParser = require('body-parser'),
      User      = require('./models/user'),
      LocalStrategy = require('passport-local'),
      passportLocalMongoose = require('passport-local-mongoose')

mongoose.connect('mongodb://localhost:27017/auth_demo_app');
const app = express();

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}))
app.use(require('express-session')({
    secret: "Rusty is the best and cutest dog in the world",
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()))
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//==============
//Auth ROUTES
//==============

//show signup forms
app.get('/register', (req, res)=>{
    res.render('register'); 
});

//handling user signup
app.post('/register', (req, res)=>{
    req.body.username
    req.body.password
    User.register(new User({username: req.body.username}), req.body.password, (err, user)=>{
        if(err) {
            console.log(err);
            return res.render('register');
        }
        passport.authenticate('local')(req, res, ()=>{
            res.redirect('/secret');
        } )

    })
})

app.get('/', (req, res)=>{
    res.render('home')
})

app.get('/secret', isLoggedIn, (req, res)=>{
    res.render('secret');
})

//Login routes
app.get('/login', (req, res)=>{
    res.render('login');
});

app.post('/login', passport.authenticate('local', {
    successRedirect: '/secret',
    failureRedirect: '/login'
}), (req, res)=>{
});

app.get('/logout', (req, res)=>{
    req.logout();
    res.redirect('/');
})

function isLoggedIn(req, res, next) {
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect('/login');
}

app.listen(3002, ()=>{
    console.log('Server started at http://localhost:3002/');
})