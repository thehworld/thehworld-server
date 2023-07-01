process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0'
require("dotenv").config();
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const https = require('https');
const fs = require('fs');
const session = require('express-session');

const cors = require('cors');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
// ** Middlewares
app.use(bodyParser.json());
app.use(cookieParser());
const corsConfig = {
    origin: ['http://localhost:3000','http://localhost:3001'],
    credentials: true,
    methods: ["POST", "PUT", "GET", "OPTIONS", "HEAD"]
};
app.use(cors(corsConfig));



const passport = require('passport');
var GoogleStrategy = require('passport-google-oauth20');



//TODO: Mongoose Setup Node
// ******************************************************************* DB Connection
mongoose.set('strictQuery', true);
mongoose
    .connect(process.env.DATABASE_PROD, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => {  
        Pig.db();
    });



// ?? Session Store Connection
// ** Mongo DB Store configuraton for session storage
const MongoDBStore = require('connect-mongodb-session')(session);
var store = new MongoDBStore({
    uri: 'mongodb+srv://thehworldtech:Y7H7AhDXZbNDnlVG@cluster0.od9xsw3.mongodb.net/?retryWrites=true&w=majority',
    // uri: 'mongodb://localhost:27017/thehworld-ecomm',
    collection: 'mySessions'
});


store.on('error', function(error) {
    console.log(error);
});

app.use(session({
    secret: 'This is a secret',
    cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 1 // 1 week
    },
    store: store,
    resave: true,
    saveUninitialized: true
}));

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());





function isLoggedIn(req, res, next) {
    req.user ? next() : res.sendStatus(401);
}

passport.use(new GoogleStrategy({
    clientID: "920983269808-i5tjk4h12oimi0o6irfcjoapfqrdptst.apps.googleusercontent.com",
    clientSecret: "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",
    callbackURL: 'https://localhost:8080/auth/google/callback',
    scope: [ 'profile', 'email' ],
    state: true,
    passReqToCallback: true,
  },
  function(request, accessToken, refreshToken, profile, done) {
    console.log('Profile - ', profile);
    done(null, profile);
  }
));


passport.serializeUser((user, done) => {
    done(null, user)    
});

passport.deserializeUser((user, done) => {
    done(null, user)
})



// ? Server Logs
const Pig = require('pigcolor');




// TODO: Server PORT
// ? Port TEST: 8080
const port = process.env.PORT || 8080;




// ************************ Import all routes here **********************

// ? Admin Routes
const categoryRouter = require("./routes/category");
const productRouter = require("./routes/product");

// **********************************************************************





//TODO: How to create https server?
// ? htts Server Setup

/**
 * We need to start out with a word about SSL certificates. Speaking generally, there are two kinds of certificates:
 * those signed by a 'Certificate Authority', or CA, and 'self-signed certificates'.
 * A Certificate Authority is a trusted source for an SSL certificate,
 * and using a certificate from a CA allows your users to trust the identity of your website. 
 * In most cases, you would want to use a CA-signed certificate in a production environment - for testing purposes, however, a self-signed certificate will do just fine.
 */
// ** LINK - https://nodejs.org/en/knowledge/HTTP/servers/how-to-create-a-HTTPS-server/#:~:text=To%20start%20your%20https%20server,the%20file)%20on%20the%20terminal.&text=or%20in%20your%20browser%2C%20by,to%20https%3A%2F%2Flocalhost%3A8000%20.


const options = {
    key: fs.readFileSync('./.cert/key.pem'),
    cert: fs.readFileSync('./.cert/cert.pem')
};
// ?



app.get("/", (req, res) => {
    console.log("GET Request")
    console.log("Session ID - ", req.sessionID);
    return res.send({
        msg: 'The H World - Server v1'
    });
});




//********************* All Route Middlewares **********************************
// ? API Mode
const MOBILE = '/api/mobile';
const WEB = '/api/web';


app.use(WEB, categoryRouter);
app.use(WEB, productRouter);

// ***************************************************************************** 


// TODO: Starting HTTPs Node Server
// ****************************************************************** Node Server
// app.listen(port, () => {
//     Pig.server(port);
// });

// exports.app = functions.https.onRequest(app);
app.get('/auth/google',
  passport.authenticate('google', { scope:
      [ 'email', 'profile' ] }
));


app.get('/auth/google/success', isLoggedIn,(req, res) => {
    console.log('req.user - ',req.user.displayName);
    console.log('req.user body - ', req.user);
    // res.send(`You are logged in!!! ${req.user.displayName}`);
    res.redirect('https://thehworld-ecom-staging.netlify.app/test');
}); 

app.get('/auth/google/logout',(req, res) => {
    req.session.destroy();
    res.send("See you again!!!");
});

app.get('/auth/google/failure',(req, res) => {
    req.send('Login Failure');
});

app.get('/auth/google/callback',
    passport.authenticate( 'google', {
        successRedirect: '/auth/google/success',
        failureRedirect: '/auth/google/failure'
}));



// User Auth Testing
app.get('/check/user', (req, res) => {
    console.log(req.session);
    console.log(req.user);
    
});

https.createServer(options, app)
    .listen(port, function() {
        Pig.server(port);
    });


// app.listen(port, () => {
//     Pig.server(port);
// });
