/*eslint-env node*/

//------------------------------------------------------------------------------
// node.js starter application for Bluemix
//------------------------------------------------------------------------------

// This application uses express as its web server
// for more info, see: http://expressjs.com
var express = require('express');

// cfenv provides access to your Cloud Foundry environment
// for more info, see: https://www.npmjs.com/package/cfenv
var cfenv = require('cfenv');

// create a new express server
var app = express();

var https = require('https');

// serve the files out of ./public as our main files
app.use(express.static(__dirname + '/public'));

// get the app environment from Cloud Foundry
var appEnv = cfenv.getAppEnv();

// app.use(express.bodyParser());
app.get('/function', function(req, res) {
	console.log('inside function');
	var theReq = https.get({
		host: 'bsp.cloudant.com',
        path: '/bus_3/_design/sct.gpacsys.net_views/_view/dateKeeper?limit=100',
        // rejectUnauthorized: false,
        method: 'GET',
        headers: {
        	'Content-Type': 'application/json',
        	'Authorization': auth
        }
    }, function(response) {
        // Continuously update stream with data
        var body = '';
        response.on('data', function(d) {
            body += d;
        });
        response.on('end', function() {
            // Data reception is done, do whatever with it!
            var parsed = body;
            console.log(parsed);
        });
    });
	res.send(200);
});

var auth = 'Basic ' + new Buffer('bsp' + ':' + 'demoPass').toString('base64');



// start server on the specified port and binding host
app.listen(appEnv.port, '0.0.0.0', function() {

	// print a message when the server starts listening
  console.log("server starting on " + appEnv.url);
});
