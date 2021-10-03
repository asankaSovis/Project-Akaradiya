const myForm = document.getElementById('login');

function setFormMessage(formElement, type, message) {
    const messageElement = formElement.querySelector(".form__message");

    messageElement.textContent = message;
    messageElement.classList.remove("form__message--success", "form__message--error");
    messageElement.classList.add(`form__message--${type}`);
}

function setIputError(formElement, message) {
    const messageElement = formElement.querySelector(".form__message");

    messageElement.textContent = message;
    messageElement.classList.remove("form__message--success", "form__message--error");
    messageElement.classList.add("form__message--error");
}

function clearInputError(formElement) {
    const messageElement = formElement.querySelector(".form__message");

    messageElement.textContent = "";
    messageElement.classList.remove("form__message--success", "form__message--error");
    messageElement.classList.remove("form__input--error");
}

document.addEventListener("DOMContentLoaded", () => {
    const loginForm = document.querySelector("#login");
    const signupForm = document.querySelector("#signup");

    document.querySelector("#linkSignup").addEventListener("click", e => {
        e.preventDefault();
        loginForm.classList.add("form--hidden");
        signupForm.classList.remove("form--hidden");
    });

    document.querySelector("#linkLogin").addEventListener("click", e => {
        e.preventDefault();
        loginForm.classList.remove("form--hidden");
        signupForm.classList.add("form--hidden");
    });

    loginForm.addEventListener("submit", e => {
        e.preventDefault();

        const formData = new FormData(login);

        fetch('login.php', {
            method: 'post',
            body: formData
        }).then(function(response) {
            return response.text();
        }).then(function(text) {
            console.log(text);
        }).catch(function(error) {
            console.log(error);
        })

        //perform your AJAX/Fetch login

        setFormMessage(loginForm, "error", "Invalid credentials");
    });

    document.querySelectorAll(".form__input").forEach(inputElement => {
        inputElement.addEventListener("blur", e => {
            if (e.target.id === "signupUsername" && e.target.value.length > 0 && e.target.value.length < 10) {
                setIputError(signupForm, "Username must be at least 10 characters in length");
            }
        });

        inputElement.addEventListener("input", e => {
            clearInputError(signupForm);
        })
    })
});