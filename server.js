var http = require('http');
 
var server = http.createServer(function (req, res) {
  res.writeHead(200, { "Content-Type": "text/plain" })
  res.end("Hello world\n");
});
 
server.listen(process.env.PORT || 8001);

// 
// var zeromq      = require('zeromq'),
//     querystring = require('querystring'),
//     pusher      = require('./pusher');
// 
// // create a zeromq SUB socket, and subscribe to all messages
// var subscriber = zeromq.createSocket('sub')
// subscriber.subscribe('')
// 
// // pusher.com configuration
// var pusherConfig = {
//   appId:  '173',
//   key:    '09b153199c3ffc4e1e41',
//   secret: 'a5812e6ebc7de67b16af'
// };
// 
// // register callback for when a zeromq message is received
// subscriber.on('message', function(data) {
// 	// parse message data
// 	var message = querystring.parse(data.toString());
// 
// 	// reformat the message a bit
// 	var newMessage = {
// 		lat: parseFloat(message.lat),
// 		lng: parseFloat(message.lon),
// 		combineId: message['combine-id'],
// 		timestamp: Date.parse(message.time),
// 		yield: parseFloat(message.yield),
// 		state: message.state,
// 		county: message.county
// 	}
// 
// 	// log it for debugging
// 	console.log(newMessage)
// 	
// 	// send it to pusher
// 	pusher.trigger(pusherConfig, "test_channel", "my_event", newMessage);
// })
// 
// // connect to the pub socket
// subscriber.connect("tcp://66.206.206.12:61991")
