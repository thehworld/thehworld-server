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
app.use(bodyParser.json({limit:"50mb"}));
app.use(cookieParser());

const corsOptions = {
    AccessControlAllowOrigin: '*',
    origin: ['https://thehworld.in/', 'http://localhost:3000', 'http://localhost:3001','https://thehworld-admin.netlify.app/'],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true
}


app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", req.header('Origin'));
    res.header("Access-Control-Allow-Credentials", true);
    res.header(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept"
    );
    res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, DELETE");
    next();
});

app.use(cors(corsOptions));    

app.options('*', cors());



//TODO: Mongoose Setup Node
// ******************************************************************* DB Connection
mongoose.set('strictQuery', true); 
mongoose
        // .connect(process.env.DATABASE_STAG, { 
    .connect(process.env.DATABASE_PROD, {
        useNewUrlParser: true,
        useUnifiedTopology: true, 
    })
    .then(() => {
        Pig.db();
    });
    mongoose.connection.on('connected',()=>{
           console.log("Mongodb connected successfully!!!")
    })
    mongoose.connection.on('disconnected',()=>{
        console.log("Mongodb Disconnected ")
 }) 




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
const ordersRouter = require("./routes/orders");
const blogsRouter = require("./routes/blogs");

// **********************************************************************





app.get("/", (req, res) => {
    console.log("GET Request")
    return res.send({
        msg: 'The H World - Server v1'
    });
});


// console.log("get orders for admin side!!!")

//********************* All Route Middlewares **********************************
// ? API Mode
const MOBILE = '/api/mobile';
const WEB = '/api/web';


app.use(WEB, categoryRouter);
app.use(WEB, productRouter);
app.use(WEB, ordersRouter);
app.use(WEB, blogsRouter);


// ?? Auth 
app.use(WEB, userRoute);

// ***************************************************************************** 

///

//

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