const displayTimedMessage = (htmlElement, message, color) => {
    htmlElement.innerText = message;
    htmlElement.style.color = color;
}

const hideTimedMessage = (htmlElement) => setTimeout(() => { htmlElement.innerText = "";}, 3500); 

const emptyValueCheck = (htmlElement, value) => {
    if (value.length === 0 || value == "") {
        displayTimedMessage(htmlElement, "This field can't be empty.", "red");
        return false;
    }
    else {
        hideTimedMessage(htmlElement);
        return true;
    }
}

const newUserLoginData = (users) => {
    try {
        for(let user of users) {
            if((user.email === email.value) && (user.password ===  password.value)) {
                localStorage.setItem("currentuser", JSON.stringify(user));
                location.href = "index.html";
            }
            else displayTimedMessage(passwordAreaMsg, "Email id and password doesnot match", "red"); 
        }
    } // Only one user present
    catch (err) {
        if((users.email === email.value) && (users.password ===  password.value)) {
            localStorage.setItem("currentuser", JSON.stringify(users));
            location.href = "index.html";
        }
        else displayTimedMessage(passwordAreaMsg, "Email id and password doesnot match", "red"); 
    } 
}

const email = document.getElementById("email"), 
emailMessageArea = document.getElementById("emailMsg"), password = document.getElementById("password"), 
passwordAreaMsg = document.getElementById("passwordAreaMsg");

email.addEventListener("keyup", () =>  emptyValueCheck(emailMessageArea, email.value));
email.addEventListener("mouseout", () =>  emptyValueCheck(emailMessageArea, email.value));

password.addEventListener("keyup", () =>  emptyValueCheck(passwordAreaMsg, password.value));
password.addEventListener("mouseout", () =>  emptyValueCheck(passwordAreaMsg, password.value));

// Allow Registered User access
const loginButton = document.getElementById("loginButton");
loginButton.addEventListener('click', (e) => {
    e.preventDefault();
    if ((emptyValueCheck(emailMessageArea, email.value)) && (emptyValueCheck(passwordAreaMsg, password.value))) 
    {
        const users = JSON.parse(localStorage.getItem('users'));
        newUserLoginData(users);
    }
    else displayTimedMessage(passwordAreaMsg, "One or more fields empty.", "red"); 
});