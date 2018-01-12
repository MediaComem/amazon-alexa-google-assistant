const express = require('express')
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const request = require('request');
const moment = require('moment');
require('dotenv').config()
var alexa = require("alexa-app");

const app = express()
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

const { DialogflowApp } = require('actions-on-google');

app.post('/google', function (req, res) {
	const dialogflowApp = new DialogflowApp({request: req, response: res});
	function getTemperature (dialogflowApp) {
		// Get Room (entity) param from dialogflow
		var room = dialogflowApp.getArgument('Rooms')
		// Url for room's thermometer
		var url = 'https://apis.sen.se/v2/feeds/xGkV6BYWpTOKZmuUUyYUViAHtMZYOeCO/events/?limit=1&room='+room
		request(url,{'auth': {'user': process.env.MOTHER_USER,'pass': process.env.MOTHER_PWD}}, function (error, response, body) {
			// Parse and format JSON response
			var obj = JSON.parse(body);
	    var temperature = obj.objects[0].data.centidegreeCelsius;
	    temperature = temperature/100
	    
	    var dateTook = new Date(obj.objects[0].dateEvent)
	    var time = moment(obj.objects[0].dateEvent).add(2, 'h').locale("fr-ch").format('LLLL');
	    var hourAgo = moment(obj.objects[0].dateEvent).startOf('hour').fromNow();
	    // Use dialogflowApp helper to format the response
			dialogflowApp.tell('Alright, the temperature for the '+room+' is '+temperature+' degree Celsius measured '+hourAgo);
		})
  }
  getTemperature(dialogflowApp)
})

app.post('/alexa', function (req, res) {
	if (req.body.request.type === "LaunchRequest"){
		console.log("### LaunchRequest ###")
		res.json({	
			version: "1.0",
			response: {
				"outputSpeech": {
	      	"type": "PlainText",
	      	"text": "Welcome to office temperature.",
	      	"ssml": "<speak>Welcome to office.</speak>"
	    	}
			}
		})
	}
	if (req.body.request.type === "IntentRequest" && req.body.request.dialogState === "STARTED"){
		console.log("### IntentRequest STARTED ###")
		console.log(req.body.request.intent.slots.room)
		var url = 'https://apis.sen.se/v2/feeds/xGkV6BYWpTOKZmuUUyYUViAHtMZYOeCO/events/?limit=1'
		var room = req.body.request.intent.slots.room[0]
		request(url,{'auth': {'user': process.env.MOTHER_USER,'pass': process.env.MOTHER_PWD}}, function (error, response, body) {
			var obj = JSON.parse(body);
	    var temperature = obj.objects[0].data.centidegreeCelsius;
	    temperature = temperature/100
	    
	    var dateTook = new Date(obj.objects[0].dateEvent)
	    var time = moment(obj.objects[0].dateEvent).add(2, 'h').locale("fr-ch").format('LLLL');
	    var hourAgo = moment(obj.objects[0].dateEvent).add(1, 'h').startOf('hour').fromNow(); 
	    res.json({ 
	    	version: "1.0",
				response: {
					"outputSpeech": {
		      	"type": "PlainText",
		      	"text": temperature+" degree Celsius measured "+hourAgo,
		      	"ssml": "<speak>"+temperature+" degree Celsius measured "+hourAgo+"</speak>"
		    	}
				}
	    });
		})
	}
})

app.listen(process.env.PORT || 3000, function () {
  console.log('App listening on port 3000!')
})