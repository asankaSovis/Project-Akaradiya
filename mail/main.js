/* This is the Mailing webpage.
This website loads when the user clicks on a verification/password reset requesting link.
This will send emails to users for different purposes such as resetting the password,
sending verification codes. */

// Note: This JS calls the sendmail.php file and sit in /mail/ folder

const authForm = document.querySelector("#authentication"); //The main form
const buttonElement = authForm.querySelector(".form__button"); //Submit button
const messageElement = authForm.querySelector(".form__message"); //Message text displayed to the user

var message = "Please enter your email above and click Send Email to recieve the link."; //Show the message so user know we are authenticating
setMessage(message, "success", false); //User green colour text and disable button

/////////////////////////////////////////////////////////////////////////
// Separating the link and extracting its content
// Note: It can come in two forms: Reset Email, Verify forms
// Both of them can either contain parameters or no
// Verification for email authentication without an email:
//      <location>?email= { ex: localhost/Akaradiya/mail?email=}
//
// Verification for email authentication with an email:
//      <location>?email= { ex: localhost/Akaradiya/mail?email=akashsovis@gmail.com}
//
// Verification for password reset without an email:
//      <location>?pword= { ex: localhost/Akaradiya/mail?pword=}
//
// Verification for password reset with an email:
//      <location>?pword= { ex: localhost/Akaradiya/mail?pword=akashsovis@gmail.com}
//
let userlink = window.location.href; //Link we got when user clicked on the link
let mylink = window.location.pathname; //Link where the website actually reside

try {
    var text = userlink.split(mylink)[1];

    // If the link contains the email token, then we must remain in the verification stage
    if (text.includes("email")) {
        // If the email token came with some parameters, we set the parameter to textbox and
        // perform a button click
        if (text.replace("?email=", "") != "") {
            document.getElementById("email").value = text.replace("?email=", "");
            buttonElement.click();
        }
    } else if (text.includes("pword")) {
        // If the link contains a password token, then we must switch to password reset stage
        if (text.replace("?pword=", "") != "") {
            // If a parameter came with pword token, we set the parameter to textbox and
            // perform a button click
            document.getElementById("title").innerHTML = "Reset Password";
            document.getElementById("email").value = text.replace("?pword=", "");
            buttonElement.click();
        }
        else {
            // If no parameter came, we simply switch stages
            document.getElementById("title").innerHTML = "Reset Password";
        }
    }
} catch (error) {
    // In theory, an error must not occur, but just in case ㄟ(▔,▔ )ㄏ
    console.log(error);
}

// End of code. Start of event listeners.
/////////////////////////////////////////////////////////////////////////

authForm.addEventListener("submit", e => {
    // On click of submit button
    e.preventDefault();

    // Switches to loading animation and disable the button
    var message = "Attempting to send the email...";
    setMessage(message, "success", false);
    buttonElement.classList.add("form__button--loading");

    // Checking if we're in reset password mode or verification mode
    // This is found using the text on the heading of the form
    // First the email is checked for validity from checkEmail function
    //
    if (checkEmail(document.getElementById("email").value)) {
        if (document.getElementById("title").innerHTML === "Reset Password") {
            // In case we need a password reset
            // sendMail is called with 'pword' parameter
            sendMail(document.getElementById("email").value, "pword");
        } else {
            // In case we need a verification email
            // sendMail is called with 'email' parameter
            sendMail(document.getElementById("email").value, "email");
        }
    } else {
        // In case the email entered is invalid, an error is shown
        var message = "You have entered an invalid email. Please check again.";
        buttonElement.classList.remove("form__button--loading");
        setMessage(message, "error", false);
    }
})

// End of event listeners. Start of functions.
/////////////////////////////////////////////////////////////////////////

function sendMail(mailStr, auth){
    // Once a valid email is recieved, sends it to the php script for working.
    // Accepts the email as (string)email and authentication method as (string)auth
    // Note: auth can only be 'email' for an email verification
    // and 'pword' for a password reset
    // Returns null
    //
    xmlhttp = new XMLHttpRequest(); // Creates post string
    str = auth + "=" + encodeURIComponent(mailStr);
    xmlhttp.open("POST","sendmail.php", true);
    xmlhttp.onreadystatechange=function(){
        // Creates a function to be called when reply is recieve from php
        // Accepts null
        // Returns null
        //
        if (xmlhttp.readyState == 4){
            if(xmlhttp.status == 200){
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
    //console.log(error);
    buttonElement.classList.remove("form__button--loading"); // When the reply is removed, the loading animation is removed from button
    
    // ERROR CODES-------------
    // <success> - Email was sent successfully (Both verify and reset)
    // <authed> - The email is already verified (Only for verify)
    // <notauthed> - The email is not verified yet and has to be verified before resetting the password (Only for reser)
    // <nousers> - The email does not exist in the database (Both verify and reset)
    // <error> - An error occured (Both verify and reset)
    // -----------------------

    // Checks the error and adjust interface accordingly
    if(error.includes("<success>")) {
        var message = "This email was sent successfully. Please check your inbox.";
        setMessage(message, "success", false);
    } else if (error.includes("<authed>")) {
        var message = "This email is already verified.";
        setMessage(message, "error", false);
    } else if (error.includes("<notauthed>")) {
        var message = "You need to verify your email before resetting the password. Please verify first.";
        document.getElementById("title").innerHTML = "Authenticate";
        setMessage(message, "error", false);
    } else if (error.includes("<nousers>")) {
        var message = "Could not verify your email. Check your email address again.";
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

function checkEmail(str) {
    // Checking the email
    return (str.length > 5 && !str.includes("<") && !str.includes(">") && str.includes("@"));
}