const form = document.querySelector("#reset");
const buttonElement = form.querySelector(".form__button");
const messageElement = form.querySelector(".form__message");

var message = "Verifying, please wait...";
setMessage(message, "success", true);
buttonElement.classList.add("form__button--loading");

let userlink = window.location.href;
let mylink = window.location.pathname;

form.addEventListener("submit", e => {
    e.preventDefault();
    var message = "Applying your changes, please wait...";
    setMessage(message, "success", false);
    buttonElement.classList.add("form__button--loading");
    check = checkPassword(document.getElementById("signupPassword").value);
    check = check && (document.getElementById("signupPassword").value === document.getElementById("signupConfirmPassword").value);
    if (check) {
        resetPWord(email, document.getElementById("signupPassword").value);
    } else {
        var message = "Please enter a valid password";
        setMessage(message, "error", false);
        buttonElement.classList.remove("form__button--loading");
    }
})


try {
    var password = userlink.split("?pword=")[1];
    var email = password.split("?email=")[1];
    var password = password.split("?email=")[0];
    verify(email, password);
    
} catch (error) {
    console.log(error);
    const errorForm = document.querySelector("#error");
    const resetForm = document.querySelector("#reset");

    errorForm.classList.remove("form--hidden");
    resetForm.classList.add("form--hidden");
}

function verify(email, password) {
    var data = new FormData();
    data.append('verify', 'true');
    data.append('email', email);
    data.append('password', password);
    
    xmlhttp = new XMLHttpRequest();

    xmlhttp.open("POST","reset.php", true);
    xmlhttp.onreadystatechange=function(){
        if (xmlhttp.readyState == 4){
            if(xmlhttp.status == 200){
                gotReply(xmlhttp.response);
            }
        }
    };
    xmlhttp.send(data);
}

function setMessage(message, type, button) {
    messageElement.textContent = message;
    messageElement.classList.remove("form__message--success", "form__message--error");
    messageElement.classList.add("form__message--" + type);
    buttonElement.disabled = button;
}

function gotReply(reply) {
    console.log(reply);
    if (reply.includes("int(1)")) {
        var message = "Please enter your new password and click Apply Changes.";
        setMessage(message, "success", false);
        buttonElement.classList.remove("form__button--loading");
    }
    else {
        const errorForm = document.querySelector("#error");
        const resetForm = document.querySelector("#reset");
    
        errorForm.classList.remove("form--hidden");
        resetForm.classList.add("form--hidden");
        if (reply.includes("<success>")) {
            document.getElementById("form__error").innerHTML = "Password was reset successfully. Please use the new password to login.";
            document.getElementById("form__error").classList.remove("form__message--error");
            document.getElementById("form__error").classList.add("form__message--success");
        }
        else {
            document.getElementById("form__error").innerHTML = "Something went wrong. Please try again later.";
        }
    }
}

function resetPWord(email, password) {
    var data = new FormData();
    data.append('reset', 'true');
    data.append('email', email);
    data.append('password', password);
    
    xmlhttp = new XMLHttpRequest();

    xmlhttp.open("POST","reset.php", true);
    xmlhttp.onreadystatechange=function(){
        if (xmlhttp.readyState == 4){
            if(xmlhttp.status == 200){
                gotReply(xmlhttp.response);
            }
        }
    };
    xmlhttp.send(data);
}

function checkPassword(str) {
    return (isAllPresent(str) && !str.includes("<") && !str.includes(">"));
}

function isAllPresent(str) {
    var pattern = new RegExp(
      "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d).+$"
    );

    return (pattern.test(str) && !(!str || str.length < 8 || str.length > 20));
  }