/* This is the Password Reset webpage.
This webpage loads when the user clicks on a password reset link emailed to them.
The user can enter a new password and click apply to change the password. */

// Note: This JS calls the reset.php file and sit in /reset/ folder

const form = document.querySelector("#reset"); //The main form
const buttonElement = form.querySelector(".form__button"); //Submit button
const messageElement = form.querySelector(".form__message"); //Message text displayed to the user

var message = "Verifying, please wait..."; //Show the message so user know we are verifying
setMessage(message, "success", true); //User green colour text and disable button
buttonElement.classList.add("form__button--loading"); //Show the loading animation

/////////////////////////////////////////////////////////////////////////
// Separating the link and extracting its content
// <location>reset?pword=<hash>?email=<email>
//  { ex: localhost/Akaradiya/reset?pword=$2y$10$pjCmfgkk6.pBOOiDNQ4MC.2n0J3RFM.CH0ZTC4sGlKsKGAzTIVmtm?email=akashsovis@gmail.com}
//
let userlink = window.location.href; //Link we got when user clicked on the link
let mylink = window.location.pathname; //Link where the website actually reside

try {
    // Attempting to extract the hash and email from the link
    var password = userlink.split("?pword=")[1];
    var email = password.split("?email=")[1];
    var password = password.split("?email=")[0];
    verify(email, password); //Sending it to the verify function for verification, it will then
    // continue what needs to be done.
    
} catch (error) {
    // User must not come to this website without a hash in the link. So it must show an error if not.
    // Here an error is shown to the user in case it failed
    //
    //console.log(error);
    const errorForm = document.querySelector("#error");
    const resetForm = document.querySelector("#reset");

    errorForm.classList.remove("form--hidden");
    resetForm.classList.add("form--hidden");
}

// End of code. Start of event listeners.
/////////////////////////////////////////////////////////////////////////

form.addEventListener("submit", e => {
    // On click of submit button
    e.preventDefault();
    // Switches to loading animation and disable the button
    var message = "Applying your changes, please wait...";
    setMessage(message, "success", false);
    buttonElement.classList.add("form__button--loading"); //Button element

    // Call check password functions to verify them
    // **** IMPORTANT ****
    // Make sure to implement these in php as well to prevent attacks
    //
    check = checkPassword(document.getElementById("signupPassword").value);
    // Note: If the two password fields have the same text is also checked here(below)
    check = check && (document.getElementById("signupPassword").value === document.getElementById("signupConfirmPassword").value);
    if (check) {
        // Continuing if the data are valid
        // Calling the resetPWord function for further work
        resetPWord(email, document.getElementById("signupPassword").value);
    } else {
        // In case the entered doesn't match criteria, show this error [Defined in documents]
        var message = "Please enter a valid password";
        setMessage(message, "error", false);
        buttonElement.classList.remove("form__button--loading");
    }
})

// End of event listeners. Start of functions.
/////////////////////////////////////////////////////////////////////////

function verify(email, password) {
    // Verifies the email and hash password match.
    // Accepts the email as (string)email and password as (string)password
    // Returns null
    //
    // Preparing data
    var data = new FormData();
    data.append('verify', 'true');
    data.append('email', email);
    data.append('password', password);
    
    xmlhttp = new XMLHttpRequest();
    // Sending the submitted data to the reset.php file as POST data
    //
    xmlhttp.open("POST","reset.php", true);
    xmlhttp.onreadystatechange=function(){
        if (xmlhttp.readyState == 4){
            if(xmlhttp.status == 200){
                // When a reply is recieved, call the gotReply function
                // transfering the XML reply (xmlhttp.response) to it
                gotReply(xmlhttp.response);
            }
        }
    };

    // Sends the data to php
    xmlhttp.send(data);
}

function gotReply(reply) {
    // Once data is recieved, tests to validate errors
    //
    // ERROR CODES-------------
    // int(1) - The user exist and the user can be allowed to enter a new password
    // <success> - The credentials are accepted by MySQL and Password is reset
    // <failed> - Any other error
    // -----------------------
    //
    // Note: Both verificaion and password reset replies are handled here.
    // Button is set to normal
    // console.log(reply);
    if (reply.includes("int(1)")) {
        // If PHP checked if this user exist and they do exist, it replies with the int(1) message
        // This means that the credentials passed from the parameters are correct and that user can be allowed
        // enter their new password. This is why here all are set to normal and asked the user
        // to enter the new passwords
        //
        var message = "Please enter your new password and click Apply Changes.";
        setMessage(message, "success", false);
        buttonElement.classList.remove("form__button--loading");
    }
    else {
        // This section appear in two instances, either the verification failed and user doesn't exist,
        // or the reset function has successfully reset/ failed to reset the password.
        // In both cases the reset form has to be hidden and the error form (which handle the final messages
        // to the user) are shown.
        //
        const errorForm = document.querySelector("#error");
        const resetForm = document.querySelector("#reset");
    
        errorForm.classList.remove("form--hidden");
        resetForm.classList.add("form--hidden");

        if (reply.includes("<success>")) {
            // This is when the reset function executed successfully. In the error form, the success notice is shown
            document.getElementById("form__error").innerHTML = "Password was reset successfully. Please use the new password to login.";
            document.getElementById("form__error").classList.remove("form__message--error");
            document.getElementById("form__error").classList.add("form__message--success");
        }
        else {
            // This is on any form of error that occur, whether verifying or resetting. Either way, an error
            // message is shown
            //
            document.getElementById("form__error").innerHTML = "Something went wrong. Please try again later.";
        }
    }
}

function setMessage(message, type, button) {
    // Sets the message of the form. This is the overll message
    // Accepts the message as (string)message, type of error as (string)type and if button is enabled as (bool)button
    // Note: Type can be only 'success'(Displays green text) or 'error'(Displays red text)
    // Returns null
    //
    messageElement.textContent = message;
    messageElement.classList.remove("form__message--success", "form__message--error");
    messageElement.classList.add("form__message--" + type);
    buttonElement.disabled = button;
}

function resetPWord(email, password) {
    // Once data is is validated, if user exist, this function is called to reset
    // the password. This will send the new password entered to PHP
    // Accepts the email as (string)email and password as (string)password
    // Returns null
    //
    // Preparing data
    var data = new FormData();
    data.append('reset', 'true');
    data.append('email', email);
    data.append('password', password);
    
    xmlhttp = new XMLHttpRequest();
    // Sending the submitted data to the reset.php file as POST data
    //
    xmlhttp.open("POST","reset.php", true);
    xmlhttp.onreadystatechange=function(){
        if (xmlhttp.readyState == 4){
            if(xmlhttp.status == 200){
                // When a reply is recieved, call the gotReply function
                // transfering the XML reply (xmlhttp.response) to it
                gotReply(xmlhttp.response);
            }
        }
    };

    // Sends the data to php
    xmlhttp.send(data);
}

function checkPassword(str) {
    // Checking the password
    return (isAllPresent(str) && !str.includes("<") && !str.includes(">"));
}

function isAllPresent(str) {
    // Check if password fit the password parameters defined:
    //      1 At least 8 characters
    //      2 A mixture of both uppercase and lowercase letters
    //      3 A mixture of letters and numbers
    //      4 At least one special character
    // Note: Check documents for details
    //
    var pattern = new RegExp(
      "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d).+$"
    );

    return (pattern.test(str) && !(!str || str.length < 8 || str.length > 20));
}