/**
 * Created by circle on 30/03/17.
 */
var path = require("path");
var http = require(path.join(__dirname,"HTTP/Http.js"))(8998, "Hackthon/public");



http.app.get('/getSessionName', function (req, res) {
        try {
            var sesName =  Mongos.getSessionName();
            res.send({name: sesName});
        }
        catch (err) {
            res.send({err: err});

        }
    }
);

http.app.get('/startSession', function (req, res) {
    var obj = req.query;
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

http.app.get('/getServerCurrentState', function (req, res) {
    var x = logic.getBuckets();
    res.send(x);
});

var io = require('socket.io').listen(http.server);


io.sockets.on('connection', function (socket) {
    socket.on('update', function (data) {
        var requestTime = new Date().getTime();
        var dataToEmit = logic.handleNewData(data);

        if (dataToEmit) {
            if (dataToEmit.carData === undefined || dataToEmit.usersRisk === undefined) {
                return;
            }
            var data = dataToEmit.carData; //what we need to send
            Object.keys(io.sockets.sockets).forEach(function (id) {
                var currentSocket = io.sockets.sockets[id];
                //Set the risk to the specific user/car/socket
                data.myRisk = dataToEmit.usersRisk[id];
                currentSocket.emit("update", data);
            });
            //Add the data to the DB
            try {
                Mongos.addRecurdToSession(data.uuid, data.lat, data.lon, requestTime);
            } catch (err) {
                console.log(err);
            }
        }
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
        console.log("on_connect");
            socket.emit('on_connect', {massage:"HI.."});
    });
    socket.on('disconnect', function () {
        //var disconnected_uuid = socket[UUID_SOCKET_LABEL];
    });

});
