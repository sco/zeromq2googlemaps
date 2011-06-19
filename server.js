var http        = require('http'),
    fs          = require('fs'),
    zeromq      = require('zeromq'),
    querystring = require('querystring'),
    pusher      = require('./pusher');

// create a zeromq 'sub' socket and subscribe to all messages
var subscriber = zeromq.createSocket('sub')
subscriber.subscribe('')

// configuration from pusher.com
var pusherConfig = {
  appId:  '173',
  key:    '09b153199c3ffc4e1e41',
  secret: 'a5812e6ebc7de67b16af'
};

register callback for when a zeromq message is received
subscriber.on('message', function(data) {
	// parse the message
	var message = querystring.parse(data.toString());

	// clean it up a bit and send it to pusher
	pusher.trigger(pusherConfig, "test_channel", "my_event", {
		lat:       parseFloat(message.lat),
		lng:       parseFloat(message.lon),
		yield:     parseFloat(message.yield),
		combineId: message['combine-id'],
		timestamp: Date.parse(message.time),
		state:     message.state,
		county:    message.county
	});
})

// connect to the remote pub socket
subscriber.connect("tcp://66.206.206.12:61991")

// create an http server for the HTML file
http.createServer(function (req, res) {
	fs.readFile("./index.html", "binary", function(err, file) {
		res.writeHead(200, {"Content-Type": "text/html"})
		res.write(file, "binary");
		res.end();
	});
}).listen(process.env.PORT || 8001);
