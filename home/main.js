/* This is the Homepage.
This website loads when the user enters the root, root/home or click on a link to homepage in any other page.
This website is the landing page of Akaradiya.
Parameters are not passed. */

// Note: This JS calls the home.php and voting.php files and sit in /home/ folder

// Message HTML
htmlHeading = '<h1 id="badgeName" class="para__text">#heading</h1>';
htmlImage = '<img id="badgeImage" class="box__image" src="#location" alt="Badge">';
htmlPara = '<p id="levelInfo" class="para__text">#text</p>';
htmlButton = '<div class="section__center"><button class="form__button" id="overlay__close">Ok</button></div>';
htmlInput = '<input type="text" class="form__input" id="#id" autofocus placeholder="#placeholder" name="newBlock">'

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
        heroPara.innerHTML = "Your journey is just one click away. Start voting, adding words, interacting with other users.";
        heroButtonText.innerHTML = "Vote Now";
        heroButton.addEventListener("click", goToVote);
    } else {
        heroTopic.innerHTML = "Welcome to Akaradiya";
        heroPara.innerHTML = "Akaradiya is an opensource dictionary aimed at bridging the gap between Sinhala and the internet. We are determined to use the power of crowdsourcing to compile a Sinhala dictionary that is accessible to everyone all across Sri Lanka.";
        heroButtonText.innerHTML = "Signup";
        heroButton.addEventListener("click", goToSignup);
    }

    innerHTML = htmlHeading.replace('#heading', 'Welcome to Akaradiya') + htmlImage.replace('#location', "../assets/images/success.png") + htmlPara.replace('#text', 'A warm welcome to the Akaradiya Homepage. Just a quick notice.<br>Akaradiya is still in its Alpha testing phase. Therefore there might be some issues and inconveniences. Please be kind enough to notify us in case you notice any issues. Also please refrain from sharing personal information. And especially DO NOT use your existing personal passwords on this platform.<br> Thank You!') + htmlButton;
    showOverlay(innerHTML);
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

function showOverlay(innerHTML, buttonFunction=hideOverlay) {
    // Shows the overlay
    // Accepts the (string)innterHTML to show on the overlay, (function)buttonFunction to call if
    // a button is clicked (default=hideOverlay)
    // Return null
    //
    document.getElementById("overlay__form").innerHTML = innerHTML;
    document.getElementById("overlay").style.display = "block";
    document.getElementById("overlay__form").style.margin = "50px 10% 0 10%";
    document.getElementById('overlay__close').addEventListener("click", buttonFunction);
}

function hideOverlay() {
    // Hides the overlay
    // Accepts none
    // Return null
    //
    document.getElementById("overlay").style.display = "none";
}

// End of function. Starts the code
////////////////////////////////////////////////////////////////////////////////////////////////

// Sends the POST to get the ID of the logged in user first
sendXML('getId', '0', gotMyID, "../home/home.php");