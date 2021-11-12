/* This is the Homepage.
This website loads when the user enters the root, root/home or click on a link to homepage in any other page.
This website is the landing page of Akaradiya.
Parameters are not passed. */

// Note: This JS calls the home.php and voting.php files and sit in /home/ folder

// Getting the elements required
heroButton = document.getElementById("hero__button");
heroTopic = document.getElementById("hero__topic");
heroPara = document.getElementById("hero__para");
heroButtonText = document.getElementById("hero__button__text");

////////////////////////////////////////////////////////////////////////////////
// Functions

function sendXML(task, sendData, returnFunc, phpLocation="./voting.php") {
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
    // Function to call when an ID is recieved from POST.
    // If the ID is 'None', we're not logged in. Therefore we must show relevant info
    // on the hero page. Otherwise we show where to start voting.
    // Accept (int)id
    // Return null
    //
    // console.log(id); // Logs the recieved ID for debug purposes
    
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
    // Takes the user to voting page if called
    // Accepts none
    // Returns null
    //
    window.location.href = '../voting/';
}

function goToSignup() {
    // Takes the user to signup page with signup form
    // Accepts none
    // Returns null
    //
    window.location.href = '../signup/?signup';
}

// End of function. Starts the code
////////////////////////////////////////////////////////////////////////////////////////////////

// Sends the POST to get the ID of the logged in user first
sendXML('getId', '0', gotMyID, "../home/home.php");