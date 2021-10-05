const form = document.querySelector("#verification");
const buttonElement = form.querySelector(".form__button");
const messageElement = form.querySelector(".form__message");

buttonElement.classList.add("form__button--loading");
var message = "Attempting to authenticate. Please wait...";
setMessage(message, "success", true);

let userlink = window.location.href;
let mylink = window.location.pathname;

try {
    var authPassword = userlink.split(mylink)[1].replace("?auth=", "");
    
    sendAuth(authPassword);
} catch (error) {
    console.log(error);
}

function sendAuth(auth){
    xmlhttp = new XMLHttpRequest();
    
    str = "q=" + encodeURIComponent(auth);

    xmlhttp.open("POST","authenticate.php", true);
    xmlhttp.onreadystatechange=function(){
        if (xmlhttp.readyState == 4){
            if(xmlhttp.status == 200){
                response(xmlhttp.response);
            }
        }
    };
    xmlhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xmlhttp.send(str);
}

function response(error) {
    buttonElement.classList.remove("form__button--loading");
    
    if(error.includes("<success>")) {
        var message = "hello " + error.replace("<success>", "").split(" ")[1] + ", your email was successfully verified.";
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
    messageElement.textContent = message;
    messageElement.classList.remove("form__message--success", "form__message--error");
    messageElement.classList.add("form__message--" + type);
    buttonElement.disabled = button;
}