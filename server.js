var http        = require('http'),
    fs          = require('fs'),
    zeromq      = require('zeromq'),
    querystring = require('querystring'),
    pusher      = require('./pusher'),
    io          = require('socket.io');

// configuration from pusher.com
var pusherConfig = {
  appId:  '173',
  key:    '09b153199c3ffc4e1e41',
  secret: 'a5812e6ebc7de67b16af'
};

// create an HTTP server for the HTML file and socket.io
var server = http.createServer(function (req, res) {
	fs.readFile("./index.html", "binary", function(err, file) {
		res.writeHead(200, {"Content-Type": "text/html"})
		res.write(file, "binary");
		res.end();
	});
});
server.listen(process.env.PORT || 8001);

// create a socket.io instance
var publisher = io.listen(server); 

// create a zeromq SUB socket and subscribe to all messages
var subscriber = zeromq.createSocket('sub')
subscriber.subscribe('{"format": "json"}')

// register callback for when a zeromq message is received
subscriber.on('message', function(data) {
	// parse the message, reformat it a bit, and send it to connected clients
	var str = data.toString().replace('{"format": "json"}','');
	var message = JSON.parse(str);
	
	// log the message for debugging
	console.log(message);
	
	// send it out via socket.io and pusher
	publisher.broadcast(message);
	pusher.trigger(pusherConfig, "test_channel", "my_event", message);
})

// connect to the remote zeromq PUB socket
subscriber.connect("tcp://66.206.206.12:61991")
