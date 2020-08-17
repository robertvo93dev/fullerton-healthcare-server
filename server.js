/**
 * Requirement resources
 */
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const dotenv = require('dotenv');
const routers = require('./server/routes/routes.js');
const DbConnection = require('./server/services/db.service');

//Read .env file
dotenv.config();
//set up cors option for a frontend could send request to backend
const corsOptions = {
    origin: process.env.FRONT_END_URL,
    optionsSuccessStatus: 200
}
const PORT = process.env.PORT || 5000;
const app = express();

//parse body for request
app.use(bodyParser.urlencoded({ limit: '50mb', extended: false }));
app.use(bodyParser.json({ limit: '50mb' }));
//specify the static folder (the place where resources will be stored) => folder public
app.use(express.static(__dirname + '/public'));
//add config for cors
app.use(cors(corsOptions));
// app.use(function(req, res, next) {
//     res.header("Access-Control-Allow-Origin", process.env.FRONT_END_URL); // update to match the domain you will make the request from
//     res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
//     next();
// });
//define router
app.use('/', new routers().router);
//start server with port
app.listen(PORT, () => console.log(`Listening on ${PORT}`));

//connect db
DbConnection.Get();