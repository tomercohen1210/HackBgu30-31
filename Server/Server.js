/**
 * Created by circle on 30/03/17.
 */
var path = require("path");
var http = require(path.join(__dirname,"HTTP/Http.js"))(8998, "Hackthon/public");


http.app.get('/CalculateScore', function (req, res) {
        var obj = req.query;

    });

http.app.get('/startSession', function (req, res) {
    var sessionName = obj.name;
    Mongos.createNewSession(sessionName);
    var junction = users.getJunction();
    Mongos.AddJunctionToSession(junction, 'Session_' + sessionName);
    res.send();
});

http.app.get('/stopSession', function (req, res) {
    Mongos.closeSession();
    res.send();
});

var io = require('socket.io').listen(http.server);

io.sockets.on('connection', function (socket) {
    socket.on('on_SlideMoveRight', function (data) {
            Object.keys(io.sockets.sockets).forEach(function (id) {
                if(socket.id!=id) {
                    var currentSocket = io.sockets.sockets[id];
                    currentSocket.emit("on_SlideMoveRight", data);
                }
                });

    });

    socket.on('on_SlideMoveLeft', function (data) {
        Object.keys(io.sockets.sockets).forEach(function (id) {
            if(socket.id!=id) {
                var currentSocket = io.sockets.sockets[id];
                currentSocket.emit("on_SlideMoveLeft", data);
            }
        });

    });
    socket.on("deluser", function (data) {
        try {
            users.deleteUser(data.uuid);
            io.sockets.emit("deluser", data);
        }
        catch (err) {
            logger.SayError("LogosIP", err.stack);


            //dsds
        }
    });
    socket.on("MoveSlide", function (data) {
        Object.keys(io.sockets.sockets).forEach(function (id) {
            var ee = io.sockets.sockets[id];
            ee.emit("instersctionupdate", data);
        });
    });
    socket.on("on_connect", function (data) {
            socket.emit('on_connect', {message:"HI.."});
    });
    socket.on('disconnect', function () {
        //var disconnected_uuid = socket[UUID_SOCKET_LABEL];
    });

});
