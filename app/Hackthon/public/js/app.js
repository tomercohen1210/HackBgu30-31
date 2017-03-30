/**
 * Created by circle on 30/03/17.
 */
var socket;
var uuid = new Date().getTime();


var uid = 1;
var data = [
    { label: "apple",  y: 10  },
    { label: "orange", y: 15  },
    { label: "banana", y: 25  },
    { label: "mango",  y: 30  },
    { label: "grape",  y: 28  }
];
$(document).ready(function () {
    $("#graph").hide();
    setSocketIo();

});


function setSocketIo() {
     socket = io.connect('http://localhost:8998');

    socket.emit("on_connect",{uuid:uuid});

    socket.on("on_connect", function(data){
    console.log(data.message)
    });

    socket.on("on_SlideMoveRight", function(data){
        navigateRight(false);
    });
    socket.on("on_SlideMoveLeft", function(data){
        navigateLeft(false);
    });


});
}

//function that send the user answers

var getAns = function(){
    var ans = [];
    ans.push($('input[name="gender"]:checked').val());
    ans.push($('input[name="gender1"]:checked').val());
    ans.push($('input[name="gender2"]:checked').val());
    var questions = [];
    questions.push($("#1").html());
    questions.push($("#2").html());
    questions.push($("#3").html());
    emitAns(questions,ans);
}
var emitAns = function(questions,answers){
    var ans = {};
    ans["Q&A"] = {};
    ans["id"] = uid;
    for (var i = 0; i < questions.length; i++){
        ans["Q&A"][questions[i]] = answers[i];
    }
    socket.emit("send_ans",ans);
}
//get the data needed for the chart this will be the then function
socket.on("send_ans", function (data) {
    //build the chart for each question
    $(".container-fluid").hide();
    createChart(data);
    $("#graph").show();

})

var createChart = function (data) {
    //open new window with this chart
    var chart = new CanvasJS.Chart("chartContainer", {
        theme: "theme2",//theme1
        title:{
            text: "Basic Column Chart - CanvasJS"
        },
        animationEnabled: false,   // change to true
        data: [
            {
                // Change type to "bar", "area", "spline", "pie",etc.
                type: "column",
                dataPoints:data /*[
                    { label: "apple",  y: 10  },
                    { label: "orange", y: 15  },
                    { label: "banana", y: 25  },
                    { label: "mango",  y: 30  },
                    { label: "grape",  y: 28  }
                ]*/
            }
        ]
    });
    chart.render();
}
$("button").click(function(){
    $.post("demo_test_post.asp",
        {
            name: "Donald Duck",
            city: "Duckburg"
        },
        function(data, status){
            alert("Data: " + data + "\nStatus: " + status);
        });
});

var loadGeoJson2 = function (url, func, params, paramName) {
    $.post({
        url: url,
        dataType: 'json',
        async: true,
        success: function (data) {
            search = data;
            return data;
        }
    });
}
