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

var users = [];
var StudentAns =
    [{Q:'Q1',Ans:[{Male:0,Female:0,Other:0}],rightAns:"Male"},
    {Q:'Q2',Ans:[{Male:0,Female:0,Other:0}],rightAns:"Female"},
    {Q:'Q3',Ans:[{Male:0,Female:0,Other:0}],rightAns:"Other"}];

var io = require('socket.io').listen(http.server);
var buildJsonChart = function(data){
    var ans = {};
    for(var i = 1; i < data.length; i++) {
        for (var j = 0; j < StudentAns.length; j++) {
            if(StudentAns[j].Q == data[i].Q) {
                ans[StudentAns[j].Q] = [];
                for (var ans1 in StudentAns[j].Ans[0]) {
                    if (StudentAns[j].Ans[0].hasOwnProperty(ans1)) {
                        ans[StudentAns[j].Q].push({label: ans1, y: StudentAns[j].Ans[0][ans1]})
                    }
                }
            }
        }
    }
    return ans;
};
var upInOne = function(uId){
    if(users[uId] == null)
        users[uId] = 1;
    else
        users[uId] ++;
}
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

    socket.on('on_Pouse', function (data) {
        Object.keys(io.sockets.sockets).forEach(function (id) {
            if(socket.id!=id) {
                var currentSocket = io.sockets.sockets[id];
                currentSocket.emit("on_Pouse", data);
            }
        });

    });

    socket.on('send_Ans',function(data){//go over all data and give plus one to every answer
        for(var i = 1; i < data.length; i++){
            for(var j = 0; j < StudentAns.length; j++){
                if(StudentAns[j].Q == data[i].Q){
                    StudentAns[j].Ans[0][(data[i].Ans)]++;
                    if(StudentAns[j].rightAns == data[i].Ans)//student was right
                        upInOne(data[0]);
                }
            }
        }
        ansNum++;
//io.sockets.sockets.length == ansNum
        if(true){//num of connected sockets equals num of answers
            var ans =  buildJsonChart(data);
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
