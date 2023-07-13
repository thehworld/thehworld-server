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
    origin: ['http://localhost:3000', 'https://thehworld-ecom-staging.netlify.app', 'https://rococo-banoffee-61f602.netlify.app'],
    credentials: true,
    methods: ["POST", "PUT", "GET", "OPTIONS", "HEAD"]
};
app.use(cors(corsConfig));
app.options('https://rococo-banoffee-61f602.netlify.app', cors());



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




// ? Server Logs
const Pig = require('pigcolor');




// TODO: Server PORT
// ? Port TEST: 8080
const port = process.env.PORT || 8080;




// ************************ Import all routes here **********************

// ? User Routes
const userRoute = require("./routes/user");


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

// ?? Auth 
app.use(WEB, userRoute);

// ***************************************************************************** 

///

// Add headers before the routes are defined
app.use(function(req, res, next) {

    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', 'https://rococo-banoffee-61f602.netlify.app');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);

    // Pass to next layer of middleware
    next();
});

///


app.all('/*', function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "https://rococo-banoffee-61f602.netlify.app");
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header("Access-Control-Allow-Headers", "X-Requested-With,     Content-Type");
    next();
});


// TODO: Starting HTTPs Node Server
// ****************************************************************** Node Server

// exports.app = functions.https.onRequest(app);

// https.createServer(options, app)
//     .listen(port, function() {
//         Pig.server(port);
//     });


app.listen(port, () => {
    Pig.server(port);
});