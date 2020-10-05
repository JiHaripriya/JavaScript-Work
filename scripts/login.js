
//ihavetogoA1
const displayTimedMessage = (htmlElement, message, color) => {
    htmlElement.innerText = message;
    htmlElement.style.color = color;
}

const hideTimedMessage = (htmlElement) => {
    setTimeout(() => { htmlElement.innerText = "";}, 3500); 
}

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

const firstName = document.getElementById("firstName"), lastName = document.getElementById("lastName"),
nameMessageArea = document.getElementById("nameMsg"), password = document.getElementById("password"), passwordAreaMsg = document.getElementById("passwordAreaMsg");

firstName.addEventListener("keyup", () => { emptyValueCheck(nameMessageArea, firstName.value); } );
firstName.addEventListener("mouseout", () => { emptyValueCheck(nameMessageArea, firstName.value); } );

lastName.addEventListener("keyup", () => { emptyValueCheck(nameMessageArea, lastName.value); } );
lastName.addEventListener("mouseout", () => { emptyValueCheck(nameMessageArea, lastName.value); } );

password.addEventListener("keyup", () => { emptyValueCheck(passwordAreaMsg, password.value); } );
password.addEventListener("mouseout", () => { emptyValueCheck(passwordAreaMsg, password.value); } );

// Allow Registered User access
const loginButton = document.getElementById("loginButton");
loginButton.addEventListener('click', (e) => {
    e.preventDefault();
    if ((emptyValueCheck(nameMessageArea, firstName.value)) && (emptyValueCheck(nameMessageArea, lastName.value)) && (emptyValueCheck(passwordAreaMsg, password.value))) 
    {
        const users = JSON.parse(localStorage.getItem('users'));
        for(let user of users) {
            if((user.firstName === firstName.value) && (user.lastName === lastName.value) && (user.password ===  password.value)){
                localStorage.setItem("currentuser", JSON.stringify(user));
                location.href = "index.html";
            }
            else { displayTimedMessage(passwordAreaMsg, "Username and password doesnot match", "red"); }
        }
    }
    else { displayTimedMessage(passwordAreaMsg, "One or more fields empty.", "red"); }
});

console.log(localStorage.getItem("currentuser"));