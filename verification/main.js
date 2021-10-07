/* This is the Verification webpage.
This webpage loads when the user clicks on a verification link emailed to them.
This will extract the content of the parameters passed from the link and verify the user profile. */

// Note: This JS calls the authenticate.php file and sit in /verification/ folder

const form = document.querySelector("#verification"); //The main form
const buttonElement = form.querySelector(".form__button"); //Submit button
const messageElement = form.querySelector(".form__message"); //Message text displayed to the user

buttonElement.classList.add("form__button--loading"); //Show the loading animation
var message = "Attempting to authenticate. Please wait..."; //Show the message so user know we are authenticating
setMessage(message, "success", true); //User green colour text and disable button

/////////////////////////////////////////////////////////////////////////
// Separating the link and extracting its content
// <location>?auth=<hash> { ex: localhost/Akaradiya/verification?auth=$2y$10$Z541pmXxSrADendWzphrsOl2Fsv98imnHHKo3hAdFtMOhKHBotI/i}
//
let userlink = window.location.href; //Link we got when user clicked on the link
let mylink = window.location.pathname; //Link where the website actually reside

try {
    // Attempting to extract the hash from the link
    var authPassword = userlink.split(mylink)[1].replace("?auth=", "");
    sendAuth(authPassword); //Sending it to the sendAuth function for further work
    
} catch (error) {
    // User must not come to this website without a hash in the link. So it must show an error if not.
    //
    // *****MAKE SURE TO REPLACE THE CONSOLE LOG WITH A PROPER ERROR OUTPUT****
    //
    console.log(error);
}

// IMPORTANT-----------
// Once everything is done, the user must get the chance to click on submit button to go
// to the homepage. This functionality must be added. Please note that.
// ****MAKE SURE TO ADD THE BUTTON SUBMIT CODE HERE****
// --------------------

// End of code. Start of function definitions.
/////////////////////////////////////////////////////////////////////////

function sendAuth(auth){
    // Once a valid authentication token is recieved, sends it to the php script for working.
    // Accepts the authentication token as (string)auth
    // Returns null
    //
    xmlhttp = new XMLHttpRequest();
    str = "auth=" + encodeURIComponent(auth); // Creates post string
    xmlhttp.open("POST","authenticate.php", true);
    xmlhttp.onreadystatechange=function() {
        // Creates a function to be called when reply is recieve from php
        // Accepts null
        // Returns null
        //
        if (xmlhttp.readyState == 4) {
            if(xmlhttp.status == 200) {
                // If request is recieved and connection is closed, call the response function
                // transfering the XML reply (xmlhttp.response) to it
                response(xmlhttp.response);
            }
        }
    };

    // Sends the data to php
    xmlhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xmlhttp.send(str);
}

function response(error) {
    // Function that handle the returned data from php
    // Accepts the error string php sent as (string)error
    // Returns null
    //
    buttonElement.classList.remove("form__button--loading"); // When the reply is removed, the loading animation is removed from button
    // console.log(error);

    // ERROR CODES-------------
    // <success> - Verified successfully
    // <nouser> - User doesn't exist (This is when query for an UNVERIFIED user with this auth details doesn't exist)
    // <error> - Any other error
    // -----------------------

    // Checks the error and adjust interface accordingly
    if(error.includes("<success>")) {
        var message = "hello " + error.split("<success>")[1].split('"')[0] + ", your email was successfully verified.";
        setMessage(message, "success", false);
    } else if (error.includes("<nousers>")) {
        var message = "Could not verify the email, maybe it's already verified?";
        setMessage(message, "error", false);
    } else {
        var message = "Something happened from our end. Please try again later.";
        setMessage(message, "error", false);
    }
}

function setMessage(message, type, button) {
    // Function to set the form information according to preference
    // Accepts the message to be displayed on the message text as (string)message, Type of error (string)type and button disabled? as (bool)button
    // Note: Type can be only 'success'(Displays green text) or 'error'(Displays red text)
    // Returns null
    //
    messageElement.textContent = message;
    messageElement.classList.remove("form__message--success", "form__message--error");
    messageElement.classList.add("form__message--" + type);
    buttonElement.disabled = button;
}
