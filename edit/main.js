const form = document.querySelector("#edit");
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
    check = checkUsername(document.getElementById("signupUsername").value);
    if (check) {
        var gender = 1;
        if (document.getElementById("male").checked) {
            gender = 0;
        }
        username = document.getElementById("signupUsername").value;
        editInfo(email, password, gender, username);
    } else {
        var message = "Please enter a valid username";
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
    const resetForm = document.querySelector("#edit");

    errorForm.classList.remove("form--hidden");
    resetForm.classList.add("form--hidden");
}

function verify(email, password) {
    var data = new FormData();
    data.append('verify', 'true');
    data.append('email', email);
    data.append('password', password);
    
    xmlhttp = new XMLHttpRequest();

    xmlhttp.open("POST","edit.php", true);
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
        var message = "Please enter your new information and click Done.";
        setMessage(message, "success", false);
        buttonElement.classList.remove("form__button--loading");
    }
    else {
        const errorForm = document.querySelector("#error");
        const resetForm = document.querySelector("#edit");
    
        errorForm.classList.remove("form--hidden");
        resetForm.classList.add("form--hidden");
        if (reply.includes("<success>")) {
            document.getElementById("form__error").innerHTML = "Your information was edited successfully.";
            document.getElementById("form__error").classList.remove("form__message--error");
            document.getElementById("form__error").classList.add("form__message--success");
        }
        else {
            document.getElementById("form__error").innerHTML = "Something went wrong. Please try again later.";
        }
    }
}

function editInfo(email, password, gender, username) {
    var data = new FormData();
    data.append('edit', 'true');
    data.append('email', email);
    data.append('password', password);
    data.append('username', username);
    data.append('gender', gender);
    
    xmlhttp = new XMLHttpRequest();

    xmlhttp.open("POST","edit.php", true);
    xmlhttp.onreadystatechange=function(){
        if (xmlhttp.readyState == 4){
            if(xmlhttp.status == 200){
                gotReply(xmlhttp.response);
            }
        }
    };
    xmlhttp.send(data);
}

function checkUsername(str) {
    return (str.length > 5 && !str.includes("<") && !str.includes(">"));
}