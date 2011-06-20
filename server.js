var http        = require('http'),
    fs          = require('fs'),
    zeromq      = require('zeromq'),
    querystring = require('querystring'),
    io          = require('socket.io');

// create an HTTP server for the HTML file and socket.io
var server = http.createServer(function (req, res) {
	fs.readFile("./index.html", "binary", function(err, file) {
		res.writeHead(200, {"Content-Type": "text/html"})
		res.write(file, "binary");
		res.end();
	});
});
server.listen(process.env.PORT || 8001);
var socket = io.listen(server); 

// create a zeromq SUB socket and subscribe to all messages
var subscriber = zeromq.createSocket('sub')
subscriber.subscribe('')

// register callback for when a zeromq message is received
subscriber.on('message', function(data) {
	// parse the message, reformat it a bit, and send it to connected clients
	var message = querystring.parse(data.toString());
	socket.broadcast({
		lat:       parseFloat(message.lat),
		lng:       parseFloat(message.lon),
		yield:     parseFloat(message.yield),
		combineId: message['combine-id'],
		timestamp: Date.parse(message.time),
		state:     message.state,
		county:    message.county
	});
})

// connect to the remote 0MQ PUB socket
subscriber.connect("tcp://66.206.206.12:61991")
