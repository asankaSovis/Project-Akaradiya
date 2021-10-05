const form = document.querySelector("#authentication");
const buttonElement = form.querySelector(".form__button");
const messageElement = form.querySelector(".form__message");

let userlink = window.location.href;
let mylink = window.location.pathname;

var message = "Please enter your email above and click Send Email to recieve the link.";
setMessage(message, "success", false);

const authForm = document.querySelector("#authentication");

authForm.addEventListener("submit", e => {
    e.preventDefault();
    var message = "Attempting to send the email...";
    setMessage(message, "success", false);
    buttonElement.classList.add("form__button--loading");
    if (checkEmail(document.getElementById("email").value)) {
        if (document.getElementById("title").innerHTML === "Reset Password") {
            sendMail(document.getElementById("email").value, "pword");
        } else {
            sendMail(document.getElementById("email").value, "email");
        }
    } else {
        var message = "You have entered an invalid email. Please check again.";
        buttonElement.classList.remove("form__button--loading");
        setMessage(message, "error", false);
    }
})

try {
    var text = userlink.split(mylink)[1];
    if (text.includes("email")) {
        if (text.replace("?email=", "") != "") {
            document.getElementById("email").value = text.replace("?email=", "");
            buttonElement.click();
        }
    } else if (text.includes("pword")) {
        if (text.replace("?pword=", "") != "") {
            document.getElementById("title").innerHTML = "Reset Password";
            document.getElementById("email").value = text.replace("?pword=", "");
            buttonElement.click();
        }
        else {
            document.getElementById("title").innerHTML = "Reset Password";
        }
    }
} catch (error) {
    console.log(error);
}

function sendMail(mailStr, auth){
    xmlhttp = new XMLHttpRequest();

    str = auth + "=" + encodeURIComponent(mailStr);

    xmlhttp.open("POST","sendmail.php", true);
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
    console.log(error);
    buttonElement.classList.remove("form__button--loading");
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
    messageElement.textContent = message;
    messageElement.classList.remove("form__message--success", "form__message--error");
    messageElement.classList.add("form__message--" + type);
    buttonElement.disabled = button;
}

function checkEmail(str) {
    return (str.length > 5 && !str.includes("<") && !str.includes(">") && str.includes("@"));
}