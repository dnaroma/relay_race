var express = require('express');
var app = express(),
    server = require('http').createServer(app),
    io = require('socket.io').listen(server);

app.use('/', express.static('public'));
app.use('/bower_components', express.static('bower_components'))

server.listen(8080);

io.sockets.on('connection', function(socket) {
    socket.on('taker', function(data) {
        socket.broadcast.emit('owner', data)
    })
    socket.on('owner', function(data) {
        socket.broadcast.emit('taker', data)
    })
})
