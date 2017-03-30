/**
 * Created by circle on 30/03/17.
 */
var socket;

$(document).ready(function () {

    setSocketIo();
});


function setSocketIo() {
    socket = io.connect();

    socket.emit("on_connect",{uuid:uuid});

    socket.on("on_connect", function(data){
});
}
