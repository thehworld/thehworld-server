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

app.use(cors());
app.options('*', cors());



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





app.get("/", (req, res) => {
    console.log("GET Request")
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