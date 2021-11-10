function sendXML(task, sendData, returnFunc, phpLocation="./voting.php") {
    var data = new FormData();
    data.append('task', task);
    data.append('data', sendData);

    xmlhttp = new XMLHttpRequest();
    // Sending the submitted data to the reset.php file as POST data
    //
    xmlhttp.open("POST",phpLocation, true);
    xmlhttp.onreadystatechange=function(){
        if (xmlhttp.readyState == 4){
            if(xmlhttp.status == 200){
                // When a reply is recieved, call the gotReply function
                // transfering the XML reply (xmlhttp.response) to it
                //console.log(xmlhttp.response);
                returnFunc(xmlhttp.response);
            }
        }
    };
    xmlhttp.send(data);
}

sendXML('getId', '0', gotMyID, "../home/home.php");
heroButton = document.getElementById("hero__button");
heroTopic = document.getElementById("hero__topic");
heroPara = document.getElementById("hero__para");
heroButtonText = document.getElementById("hero__button__text");

function gotMyID(id) {
    console.log(id);
    if (id != "None") {
        heroTopic.innerHTML = "Let's Start Our Journey";
        heroPara.innerHTML = "01. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean eu erat mi. Sed volutpat dapibus pretium. Vestibulum gravida odio leo, nec elementum sem rhoncus id. Aenean pretium turpis vel urna molestie tempus. Etiam eleifend leo ac magna maximus hendrerit. Nullam bibendum turpis et urna feugiat laoreet. Suspendisse potenti. Integer at eros tellus.";
        heroButtonText.innerHTML = "Vote Now";
        heroButton.addEventListener("click", goToVote);
    } else {
        heroTopic.innerHTML = "Welcome to Akaradiya";
        heroPara.innerHTML = "02. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean eu erat mi. Sed volutpat dapibus pretium. Vestibulum gravida odio leo, nec elementum sem rhoncus id. Aenean pretium turpis vel urna molestie tempus. Etiam eleifend leo ac magna maximus hendrerit. Nullam bibendum turpis et urna feugiat laoreet. Suspendisse potenti. Integer at eros tellus.";
        heroButtonText.innerHTML = "Signup";
        heroButton.addEventListener("click", goToSignup);
    }
}

function goToVote() {
    window.location.href = '../voting/';
}

function goToSignup() {
    window.location.href = '../signup?signup/';
}