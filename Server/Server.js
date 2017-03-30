/**
 * Created by circle on 30/03/17.
 */
var path = require("path");
var http = require(path.join(__dirname,"HTTP/Http.js"))(8998, "Hackthon/public");



http.app.get('/CalculateScore', function (req, res) {
        var obj = req.query;

    }
    );

var ansNum = 0;
var QA = {
    Q1:
    {
        'possibles': ["Male","Female","Other"],
        "ans": "Male"
    },
    Q2:
    {
        'possibles': ["Male","Female","Other"],
        "ans": "Female"
    },
    Q3:
    {
        'possibles': ["Male","Female","Other"],
        "ans": "Other"
    }
};
var users = ['U1','U2','U3'];
var StudentAns = {};

var io = require('socket.io').listen(http.server);
function buildJsonChart(){
    var ans = {};
    for(var i = 0; i < QA.length; i++){
        ans[QA[i]] = [];
        for(var j = 0; j < QA[i]['possibles']; j++){
            if(StudentAns[QA[i]][QA[i]['possibles'][j]] != null)
            ans[QA[i]].push({'label':QA[i]['possibles'][j],'y':StudentAns[QA[i]][QA[i]['possibles'][j]]});
            else
                ans[QA[i]].push({'label':QA[i]['possibles'][j],'y':0})
        }
    }
    return ans;
};
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
    socket.on('send_Ans',function(data){
        if(StudentAns['Q1'][data['Q&A']['Q1']] == null)
            StudentAns['Q1'][data['Q&A']['Q1']] = 1;
        else
            StudentAns['Q1'][data['Q&A']['Q1']]++;
        ansNum++;
        if(io.sockets.sockets == ansNum){
            var ans =  buildJsonChart();
            Object.keys(io.sockets.sockets).forEach(function (id) {
                var currentSocket = io.sockets.sockets[id];
                //Set the risk to the specific user/car/socket
                currentSocket.emit("send_AllUsersAns", ans);//send the user all the answers for the questions
            });
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
            socket.emit('on_connect', {message:"HI..Man"});
    });
    socket.on('disconnect', function () {
        //var disconnected_uuid = socket[UUID_SOCKET_LABEL];
    });

});
