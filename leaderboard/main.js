const achieverHTML = '<div class="achievers__div">#innerHTML</div>';
const achieverTextHTML = '<p id="" class="box__details">#innerHTML</p>';
const achieverProgressHTML = '<div class="progress"><div class="progress__fill" style="width: #value%;"></div></div>';

var slider;

// ID of the user

myID = 0;
myRank = 0;
// ID of the profile user is viewing
profileInfo = [];

////////////////////////////////////////////////////////////////////////////////
// Functions

function sendXML(task, sendData, returnFunc, phpLocation="../profile/profile.php") {
    // Function to send XML requests to php and accept data
    // Accepts (string)task that gives the task to complete, (string)sendData that contain the data to send
    // (function) returnFunc that give what function to use when reply is recieved, optional (string)phpLocation
    // that specify which php to send POST to (default='voting.php')
    // Returns null
    //
    var data = new FormData();
    data.append('task', task);
    data.append('data', sendData);

    xmlhttp = new XMLHttpRequest();
    // Sending the submitted data to the phpLocation file as POST data
    //
    xmlhttp.open("POST",phpLocation, true);
    xmlhttp.onreadystatechange=function(){
        if (xmlhttp.readyState == 4){
            if(xmlhttp.status == 200){
                // When a reply is recieved, call the returnFunc function
                // transfering the XML reply (xmlhttp.response) to it
                //console.log(xmlhttp.response);
                returnFunc(xmlhttp.response);
            }
        }
    };
    xmlhttp.send(data);
}

function gotMyID(id) {
    // When an ID is recieved from the POST
    // Accept (string)id
    // Return null
    //
    if (id != "None") {
        // If not we check if the link contain a word or no
        myID = Number(id);
    }
    sendXML('userExist', myID, gotProfileData);
    
}

function gotProfileData(reply) {
    if (reply != 0) {
        profileInfo = JSON.parse(reply);
        sendXML('getUserRank', profileInfo[3], gotUserRank);
    } else {
        sendXML('getleadersRank', 20, gotleadersRank);
    }
}

function gotUserRank(reply) {
    profileInfo.push(reply);
    sendXML('getleadersRank', 20, gotleadersRank);
}

function gotleadersRank(reply) {
    leaders = JSON.parse(reply);
    highestValue = leaders[0][1];
    htmlString = achieverHTML.replace('#innerHTML', achieverTextHTML.replace('#innerHTML', "1. " + leaders[0][0] + " (" + leaders[0][1] + ")") + achieverProgressHTML.replace('#value', '100'));
    document.getElementById("achievers").innerHTML += (htmlString);
    leaders.splice(0, 1);

    i = 2;
    leaders.forEach(element => {
        percentage = Math.round((element[1] / highestValue) * 100);
        htmlString = achieverHTML.replace('#innerHTML', achieverTextHTML.replace('#innerHTML', i + ". " + element[0] + " (" + element[1] + ")" ) + achieverProgressHTML.replace('#value', percentage));
        document.getElementById("achievers").innerHTML += (htmlString);
        i++;
    });
    if (profileInfo.length != 0) {
        if (profileInfo[6] > 20) {
            htmlString = achieverHTML.replace('#innerHTML', '');
            document.getElementById("achievers").innerHTML += (htmlString);

            element = [profileInfo[1], profileInfo[3]];
            htmlString = achieverHTML.replace('#innerHTML', achieverTextHTML.replace('#innerHTML', profileInfo[6] + ". " + element[0] + " (" + element[1] + ")" ) + achieverProgressHTML.replace('#value', percentage));
            document.getElementById("achievers").innerHTML += (htmlString);
        }
    }
    htmlString = achieverHTML.replace('#innerHTML', '');
    document.getElementById("achievers").innerHTML += (htmlString);
}

function updateProgressBar(progressBar, value) {
    value = Math.round(value);
    document.getElementById(progressBar).querySelector(".progress__fill").style.width = `${value}%`;
}

// End of functions. Start of code
/////////////////////////////////////////////////////////////////////////////////

sendXML('getId', '0', gotMyID, "../home/home.php");