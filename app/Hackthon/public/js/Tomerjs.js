/**
 * Created by circle on 30/03/17.
 */
var socket;
var uuid = new Date().getTime();

var questions = [];
var ans= [];

var uid = 1;
var selectedLi;
$(document).ready(function(){
    setSocketIo();

});
var bla = function(data){
    if(data == selectedLi)
        return;
    $(data).css({'background-color':'#ECEEF0'})
    $(selectedLi).css({'background-color':'white'})
    selectedLi = data;
}


/*function showCurrentQuestion() {
    var headerOfDropdow = document.getElementsByClassName('wrapper')[0];
    //parse into integer, because it interpretes it as a string
    var numQuestion = parseInt(currentIndex)+1;
    headerOfDropdow.getElementsByTagName('span')[0].innerHTML = numQuestion;
    var pTag = document.getElementsByTagName('p')[0];
    // console.log(liTags);
    var ulTag = document.getElementsByTagName('ul')[1];
    var liTags = ulTag.getElementsByTagName('li');
    pTag.innerHTML = currentQuestion.question;
    for (var i=0; i < liTags.length; i++) {
        //in case the number of variants is less than 4 (e.g. when it's
        // undefined) disable li tag
        if (currentQuestion.variants[i] == undefined) {
            console.log(currentQuestion.variants[i]);
            liTags[i].className = "doNotDisplay";
        } else {
            console.log(currentQuestion.variants[i]);
            liTags[i].innerHTML = currentQuestion.variants[i];//assign question
            liTags[i].className = "";
        }
    }
};*/


//showCurrentQuestion();

//when a variant is selected it becomes highlighted




function setSocketIo() {
    socket = io.connect('http://localhost:8998');

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
    socket.on("send_AllUsersAns", function (data) {
        //build the chart for each question
     //   $(".container-fluid").hide();
        createChart(data);
       // $("#graph").show();

    })

};


//function that send the user answers

var getAns = function(id,thisi,next){
    $(thisi).css({'visibility':'hidden'});
    if(next != null)
        $(next).css({'visibility':'visible'});
    ans.push($(selectedLi).attr('value'));
    questions.push($(document.getElementById(id)).html())
        emitAns(questions,ans);
}
var emitAns = function(questions,answers){
    var ans = [];
    ans[0] = {id:uid}
    for (var i = 0; i < questions.length; i++){
        ans.push({Q:questions[i],Ans:answers[i]});
    }
    socket.emit("send_Ans",ans);
}
//get the data needed for the chart this will be the then function


var createChart = function (data) {
    //open new window with this chart
    var i = 0;
    for (var ans1 in data) {
        if (data.hasOwnProperty(ans1)) {
            var chart = new CanvasJS.Chart("chartContainer0", {
                theme: "theme2",//theme1
                title: {
                    text: "What is the founding life cicle of mature companies?"
                },
                animationEnabled: true,   // change to true
                data:[
                    {
                        // Change type to "bar", "area", "spline", "pie",etc.
                        type: "column",
                        dataPoints: data[ans1]
                    }
                ]

            });
            i++;
        }
        chart.render();

    }

}

