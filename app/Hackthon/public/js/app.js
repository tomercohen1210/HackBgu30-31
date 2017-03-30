/**
 * Created by circle on 30/03/17.
 */
var socket;
var uuid = new Date().getTime();


$(document).ready(function () {
    setSocketIo();

});


function setSocketIo() {
     socket = io.connect('http://132.72.237.27:8998');

    socket.emit("on_connect",{uuid:uuid});

    socket.on("on_connect", function(data){
        console.log(data.message);
    });

    socket.on("on_SlideMoveRight", function(data){
        navigateRight(false);
    });
    socket.on("on_SlideMoveLeft", function(data){
        navigateLeft(false);
    });

}
