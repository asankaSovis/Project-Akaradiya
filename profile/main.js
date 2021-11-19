// Constant strings for HTML Elements
const listHTML = '<li class="lslide"><div class="container__box">#innerHTML</div></li>';
const listTitleHTML = '<p class="box__title">#innerHTML</p>';
const listImageHTML = '<img src="#location" class="box__image">';
const listDescHTML = '<div class="box__details"><p>#innerHTML</p></div>';
const darkBadge = '../assets/images/badges/#badgeName.png';

const linkHTML = '<a href="javascript:#function()">#text</a>';

const achieverHTML = '<div class="achievers__div">#innerHTML</div>';
const achieverTextHTML = '<p id="" class="box__details">#innerHTML</p>';
const achieverProgressHTML = '<div class="progress"><div class="progress__fill" style="width: #value%;"></div></div>';

var slider;

// ID of the user

myID = 0;
// ID of the profile user is viewing
profileInfo = [];
badges = [];
nextBadge = -1;

/////////////////////////////////////////////////////////////////////////
// Separating the link and extracting its content
// Note: If the link comes with a separate ?word parameter, then we specifically
// try to get that word. On every other case, a random word is taken.
//
let userlink = window.location.href; //Link we got when user clicked on the link
let mylink = window.location.pathname; //Link where the website actually reside

////////////////////////////////////////////////////////////////////////////////
// Functions

function sendXML(task, sendData, returnFunc, phpLocation="./profile.php") {
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

function getProfileData() {
    
    var text = userlink.split(mylink)[1];
    // If the link contains a word token, then we must use that word
    // Else we get a random word
    if (text.replace("?user=", "") != "") {
        profileID = text.replace("?user=", "");
        sendXML('userExist', profileID, gotProfileData);
    } else {
        if (myID > 0) {
            sendXML('userExist', myID, gotProfileData);
        } else {
            window.location.href = '../home/';
        }
    }
}

function getBadges() {
    sendXML('getBadges', profileInfo[0], gotBadges);
}

function getNextBadge() {
    sendXML('getNextBadge', profileInfo[3], gotNextBadge);
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
    getProfileData();
}

function gotProfileData(reply) {
    if (reply != 0) {
        profileInfo = JSON.parse(reply);

        link = "";
        if (myID == profileInfo[0]) {
            link = "<br>" + linkHTML.replace('#function', 'editInfo').replace('#text', 'Edit Profile');
            link += "<br>" + linkHTML.replace('#function', 'changePWord').replace('#text', 'Change Password');
        }

        document.getElementById("username1").innerHTML = profileInfo[1];
        document.getElementById("username2").innerHTML = profileInfo[1];
        document.getElementById("userinfo").innerHTML = "Gender: " + profileInfo[2].replace('0', 'Male').replace('1', 'Female') + "<br>Date Joined: " + profileInfo[4].split(' ')[0] + "<br>Date Active: " + profileInfo[5].split(' ')[0] + link;

        sendXML('getUserRank', profileInfo[3], gotUserRank);
    } else {
        window.location.href = '../home/';
    }
}

function editInfo() {
    sendXML('getCredentials', '0', gotCredentials);
}

function changePWord() {
    sendXML('getCredentials', '0', gotReset);
}

function gotCredentials(reply) {
    if (reply != 'fail') {
        myCredentials = JSON.parse(reply);
        window.location.href = '../edit?pword=' + myCredentials[1] + '?email=' + myCredentials[0];
    }
}

function gotReset(reply) {
    if (reply != 'fail') {
        myCredentials = JSON.parse(reply);
        window.location.href = '../reset?pword=' + myCredentials[1] + '?email=' + myCredentials[0];
    }
}

function gotUserRank(reply) {
    badges = JSON.parse(reply);
    profileInfo.push(reply);

    document.getElementById("levelInfo").innerHTML = "Experience Points: " + profileInfo[3] + "<br>Rank: " + profileInfo[6];
    getBadges();
}

function gotBadges(reply) {
    badges = JSON.parse(reply);
    // console.log(badges[0]);
    levelNotSet = true;
    badges.forEach(element => {
        htmlString = listHTML.replace('#innerHTML', listTitleHTML.replace('#innerHTML', element[1]) + listImageHTML.replace('#location', darkBadge.replace('#badgeName', element[1])) + listDescHTML.replace('#innerHTML', element[2]));
        document.getElementById("autoWidth").innerHTML += (htmlString);
        if (element[1].includes('Level') && levelNotSet) {
            document.getElementById("badgeImage").src = darkBadge.replace('#badgeName',  element[1]);
            document.getElementById("badgeName").innerHTML = element[1];
            levelNotSet = false;
        } 
    });
    // if (badges.length > 0) {
    //     document.getElementById("badgeImage").src = darkBadge.replace('#badgeName',  element[badges.length - 1][1]);
    //     document.getElementById("badgeName").innerHTML = badges[badges.length - 1][1];
    // }
    getNextBadge();
}

function gotNextBadge(reply) {
    if (reply !== "0") {
        nextBadge = JSON.parse(reply);
        htmlString = listHTML.replace('#innerHTML', listTitleHTML.replace('#innerHTML', nextBadge[1]) + listImageHTML.replace('#location', darkBadge.replace('#badgeName', 'badge_dark')) + listDescHTML.replace('#innerHTML', nextBadge[2]));
        document.getElementById("autoWidth").innerHTML += (htmlString);
    }
    makeSlider();
    sendXML('getleadersRank', 3, gotleadersRank);
    // updateProgressBar("progressBar", 90);
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

    if (profileInfo[6] > 3) {
        htmlString = achieverHTML.replace('#innerHTML', '');
        document.getElementById("achievers").innerHTML += (htmlString);

        element = [profileInfo[1], profileInfo[3]];
        htmlString = achieverHTML.replace('#innerHTML', achieverTextHTML.replace('#innerHTML', profileInfo[6] + ". " + element[0] + " (" + element[1] + ")" ) + achieverProgressHTML.replace('#value', percentage));
        document.getElementById("achievers").innerHTML += (htmlString);
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

// Sends a POST to get the ID of the user

function makeSlider() {
    $(document).ready(function() {
        slider = $('#autoWidth').lightSlider({
            autoWidth:true,
            loop:true,
            onSliderLoad: function() {
                $('#autoWidth').removeClass('cS-hidden');
            } 
        });  
    });
}