/* This is the Edit webpage.
This website loads when the user clicks on a link to edit user details.
This website is used to edit the information of the user.
This will extract the content of the parameters passed from the link to know which profile to edit. */

// Note: This JS calls the edit.php file and sit in /edit/ folder

const form = document.querySelector("#edit"); //The main form
const buttonElement = form.querySelector(".form__button"); //Submit button
const messageElement = form.querySelector(".form__message"); //Message text displayed to the user

var message = "Verifying, please wait..."; //Show the message so user know we are verifying identity
setMessage(message, "success", true); //User green colour text and disable button
buttonElement.classList.add("form__button--loading"); //Show the loading animation

/////////////////////////////////////////////////////////////////////////
// Separating the link and extracting its content
// Note: The link MUST comes with both ?email= and ?pword= parameter.
// This is to make sure we're editing the valid user and that that user
// genuinely requested to edit their information.
//
let userlink = window.location.href; //Link we got when user clicked on the link
let mylink = window.location.pathname; //Link where the website actually reside

try {
    // Attempting to extract the email and password from the link
    var password = userlink.split("?pword=")[1];
    var email = password.split("?email=")[1];
    var password = password.split("?email=")[0];
    verify(email, password); //Sending them to the verify function for further work
} catch (error) {
    // As mentioned this webpage MUST BE LOADED with email and password parameters
    // for security reasons. If these are not provided, an error must be given.
    // This is handled below.
    //
    // console.log(error);
    const errorForm = document.querySelector("#error");
    const resetForm = document.querySelector("#edit");

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

    // Call check username functions to verify them
    // **** IMPORTANT ****
    // Make sure to implement these in php as well to prevent attacks
    //
    check = checkUsername(document.getElementById("signupUsername").value);

    if (check) {
        // Continuing if the data are valid
        // Calling the editInfo function for further work
        // Gender is also extracted
        //
        var gender = 1;
        if (document.getElementById("male").checked) {
            gender = 0;
        }
        username = document.getElementById("signupUsername").value;
        editInfo(email, password, gender, username);
    } else {
        // In case the entered doesn't match criteria, show this error [Defined in documents]
        var message = "Please enter a valid username";
        setMessage(message, "error", false);
        buttonElement.classList.remove("form__button--loading");
    }
})

// End of event listeners. Start of function definitions.
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
    xmlhttp.open("POST","edit.php", true);
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

function gotReply(reply) {
    // Once data is recieved, tests to validate errors
    //
    // ERROR CODES-------------
    // int(1) - The user exist and the user can be allowed to enter a new password
    // <success> - The credentials are accepted by MySQL and Password is reset
    // <failed> - Any other error
    // -----------------------
    //
    // Note: Both verificaion and profile edit replies are handled here.
    // Button is set to normal
    // console.log(reply);
    if (reply.includes("int(1)")) {
        // If PHP checked if this user exist and they do exist, it replies with the int(1) message
        // This means that the credentials passed from the parameters are correct and that user can be allowed
        // edit their information. This is why here all are set to normal and asked the user
        // to enter the information
        //
        var message = "Please enter your new information and click Done.";
        setMessage(message, "success", false);
        buttonElement.classList.remove("form__button--loading");
    }
    else {
        // This section appear in two instances, either the verification failed and user doesn't exist,
        // or the edti function has successfully edited/ failed to edit the information.
        // In both cases the reset form has to be hidden and the error form (which handle the final messages
        // to the user) are shown.
        //
        const errorForm = document.querySelector("#error");
        const resetForm = document.querySelector("#edit");
    
        errorForm.classList.remove("form--hidden");
        resetForm.classList.add("form--hidden");

        if (reply.includes("<success>")) {
            // This is when the reset function executed successfully. In the error form, the success notice is shown
            document.getElementById("form__error").innerHTML = "Your information was edited successfully.";
            document.getElementById("form__error").classList.remove("form__message--error");
            document.getElementById("form__error").classList.add("form__message--success");
        }
        else {
            // This is on any form of error that occur, whether verifying or editing. Either way, an error
            // message is shown
            //
            document.getElementById("form__error").innerHTML = "Something went wrong. Please try again later.";
        }
    }
}

function editInfo(email, password, gender, username) {
    // Edits the information of the user after the user has been verified
    // Accepts the email as (string)email, password as (string)password, gender as (string)gender and username as (string)username
    // Returns null
    //
    // Preparing data
    var data = new FormData();
    data.append('edit', 'true');
    data.append('email', email);
    data.append('password', password);
    data.append('username', username);
    data.append('gender', gender);
    
    xmlhttp = new XMLHttpRequest();
    // Sending the submitted data to the edit.php file as POST data
    //
    xmlhttp.open("POST","edit.php", true);
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

function checkUsername(str) {
    // Checking the username
    return (str.length > 5 && !str.includes("<") && !str.includes(">"));
}