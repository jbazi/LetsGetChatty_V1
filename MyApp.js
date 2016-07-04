var express = require('express')
  , app = express()
  , http = require('http')
  , server = http.createServer(app)
  , io = require('socket.io').listen(server);
  
app.use(express.static(__dirname + '/public'));

//Map A request to the index.html file
app.get('/', function (req, res) {
	res.sendfile(__dirname + '/public/index.html');
});

//Redirects the user to the default.html page if the specied URL does not exisit
app.get('/', function (request, response) {
	response.redirect('default.html');
});

var usernames = {};

//Subscribe to the socket.io events
io.sockets.on('connection', function (socket) {
	socket.on('sendchat', function(data) {
		io.sockets.emit('updatechat', socket.username, data);
	});
	
	socket.on('adduser', function(username){
		socket.username = username;
		usernames[username] = username;
		socket.emit('updatechat','SERVER','you have connected');
		socket.broadcast.emit('updatechat','SERVER', username + ' has connected');
		io.sockets.emit('updateusers', usernames);
	});
	
	socket.on('disconnect', function (){
		delete usernames[socket.username];
		io.sockets.emit('updateusers', usernames);
		socket.broadcast.emit('updatechat', 'SERVER', username + ' has disconnected'); 
	});

});

var port = 8080;
server.listen(port);
console.log('Listenining on port: ' + port);
