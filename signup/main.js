function setFormMessage(formElement, type, message) {
    const messageElement = formElement.querySelector(".form__message");
    const buttonElement = formElement.querySelector(".form__button");

    messageElement.textContent = message;
    messageElement.classList.remove("form__message--success", "form__message--error");
    messageElement.classList.add(`form__message--${type}`);
    buttonElement.disabled = false;
}

function setIputError(formElement, message) {
    const messageElement = formElement.querySelector(".form__message");
    const buttonElement = formElement.querySelector(".form__button");

    messageElement.textContent = message;
    messageElement.classList.remove("form__message--success", "form__message--error");
    messageElement.classList.add("form__message--error");
    buttonElement.disabled = true;
}

function clearInputError(formElement) {
    const messageElement = formElement.querySelector(".form__message");
    const buttonElement = formElement.querySelector(".form__button");

    messageElement.textContent = "";
    messageElement.classList.remove("form__message--success", "form__message--error");
    messageElement.classList.remove("form__message--error");
    buttonElement.disabled = false;
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
        const buttonElement = loginForm.querySelector(".form__button");
        buttonElement.classList.add("form__button--loading");
        buttonElement.disabled = true;

        const formData = new FormData(login);

        check = checkEmail(document.getElementById("email").value);
        check = check && checkPassword(document.getElementById("password").value);

        if (check) {
            fetch('login.php', {
                method: 'post',
                body: formData
            }).then(function(response) {
                buttonElement.classList.remove("form__button--loading");
                buttonElement.disabled = false;
                setFormMessage(login, "error", response.text());
                window.location.href = '../';
            }).then(function(text) {
                console.log(text);
                buttonElement.classList.remove("form__button--loading");
                buttonElement.disabled = false;
                setFormMessage(login, "error", text);
            }).catch(function(error) {
                setFormMessage(loginForm, "error", "Oops! Something went wrong. Please reload the page.");
            })
        } else {
            buttonElement.classList.remove("form__button--loading");
            buttonElement.disabled = false;
            setFormMessage(loginForm, "error", "Invalid credentials");
        }

        //perform your AJAX/Fetch login
    });

    signupForm.addEventListener("submit", e => {
        e.preventDefault();
        const buttonElement = signupForm.querySelector(".form__button");
        buttonElement.classList.add("form__button--loading");
        buttonElement.disabled = true;

        const formData = new FormData(signup);

        check = checkUsername(document.getElementById("signupUsername").value);
        check = check && checkEmail(document.getElementById("signupEmail").value);
        check = check && checkPassword(document.getElementById("signupPassword").value);
        check = check && (document.getElementById("signupPassword").value === document.getElementById("signupConfirmPassword").value);

        if (check) {
            fetch('signup.php', {
                method: 'post',
                body: formData
            }).then(function(response) {
                buttonElement.classList.remove("form__button--loading");
                buttonElement.disabled = false;
                setFormMessage(signupForm, "error", response.text());
            }).then(function(text) {
                buttonElement.classList.remove("form__button--loading");
                buttonElement.disabled = false;
                setFormMessage(signupForm, "error", text);
            }).catch(function(error) {
                setFormMessage(signupForm, "error", error);
            })
        } else {
            buttonElement.classList.remove("form__button--loading");
            buttonElement.disabled = false;
            setFormMessage(signupForm, "error", "Invalid credentials");
        }

        //perform your AJAX/Fetch login
    });

    document.querySelectorAll(".form__input").forEach(inputElement => {
        inputElement.addEventListener("blur", e => {
            if (e.target.id === "signupUsername" && e.target.value.length < 5) {
                setIputError(signupForm, "Username must be at least 5 characters in length");
            }
            if (e.target.id === "signupUsername" && (e.target.value.includes("<") || e.target.value.includes(">"))) {
                setIputError(signupForm, "Username must not contain <>");
            }
            if ((e.target.id === "signupEmail") && (!e.target.value.includes("@") || (e.target.value.includes(">") || e.target.value.includes("<")) || e.target.value.length < 5)) {
                setIputError(signupForm, "You have entered an invalid email");
            }
            if ((e.target.id === "signupPassword") && !isAllPresent(e.target.value) || e.target.value.includes(">") || e.target.value.includes("<")) {
                setIputError(signupForm, "Password should contain at least one Uppercase letter and number (except <>) and should be between 8 to 20 characters long");
            }
        });

        inputElement.addEventListener("input", e => {
            clearInputError(signupForm);
            clearInputError(loginForm);
        })
    })

    function checkUsername(str) {
        return (str.length > 5 && !str.includes("<") && !str.includes(">"));
    }

    function checkEmail(str) {
        return (str.length > 5 && !str.includes("<") && !str.includes(">") && str.includes("@"));
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
});