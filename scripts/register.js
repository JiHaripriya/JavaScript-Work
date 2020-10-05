const displayTimedMessage = (htmlElement, message, color) => {
    htmlElement.innerText = message;
    htmlElement.style.color = color;
}

const hideTimedMessage = (htmlElement) => {
    setTimeout(() => { htmlElement.innerText = ""; }, 3500); 
}

/*......................... First Name and Last Name Validation ......................... */
const nameCheck = (name) => {
    if (name.length >= 3) { return true;}
    return false;
}

const nameCheckEvents = (nameMessageArea, name) => {
    if (nameCheck(name)) {
        displayTimedMessage(nameMessageArea, "Valid Name", "green");
        hideTimedMessage(nameMessageArea);
    }
    else { displayTimedMessage(nameMessageArea, "Name too short.", "red"); }
}

const firstName = document.getElementById("firstName"), lastName = document.getElementById("lastName"),
nameMessageArea = document.getElementById("nameMsg");

firstName.addEventListener("keyup", () => nameCheckEvents(nameMessageArea, firstName.value));
firstName.addEventListener("mouseout", () => nameCheckEvents(nameMessageArea, firstName.value));

lastName.addEventListener("keyup", () => nameCheckEvents(nameMessageArea, lastName.value));
lastName.addEventListener("mouseout", () => nameCheckEvents(nameMessageArea, lastName.value));

/*......................... Date of Birth Validation ......................... */

// A year of 365.25 days (0.25 because of leap years) which has 3.15576e+10 milliseconds (365.25 * 24 * 60 * 60 * 1000).
const getAge = (birthDate) => { return Math.floor((new Date() - new Date(birthDate).getTime()) / 3.15576e+10); }
const calenderInput = document.getElementById("dob"), dobMessage = document.getElementById("dobMsg");

const formatDate = (date) => {
    var d = new Date(date),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

    if (month.length < 2) month = '0' + month;
    if (day.length < 2)  day = '0' + day;

    return [year, month, day].join('-');
}

calenderInput.setAttribute("max", formatDate(new Date()));

calenderInput.addEventListener("mouseout", () => {
    if (getAge(calenderInput.value) >= 18) {
        displayTimedMessage(dobMessage, "Eligible Age", "green");
        hideTimedMessage(dobMessage);
    }
    else { displayTimedMessage(dobMessage, "Invalid DOB. You must be 18 years or old.", "red"); }
});

/*............................. Email Validation  ................................ */

const email = document.getElementById("email"), emailAreaMsg = document.getElementById("emailMsg");
const emailPatternCheck = (email) => {
    
    const emailPattern = new RegExp("^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$", "g");
    if (email.match(emailPattern)) {
        displayTimedMessage(emailAreaMsg, "Valid Email", "green");
        hideTimedMessage(emailAreaMsg);
        return true;
    }
    else {
        displayTimedMessage(emailAreaMsg, "Invalid email", "red");
        return false;
    }
}

email.addEventListener('keyup', () => emailPatternCheck(email.value));

/*......................... Phone Number Validation  ............................. */

const countryCode = document.getElementById("countryCode"), phoneNumber = document.getElementById("phone"),
phoneMsg = document.getElementById("phoneMsg");

const numberPatternCheck = (countryCode, phoneNumber) => {
    const indianNumberPattern = new RegExp("[6789]{1}[0-9]{9}", "g"), 
    japanNumberPattern = new RegExp("[789]0[0-9]{4}[0-9]{4}", "g");

    if (countryCode === "india") { return phoneNumber.match(indianNumberPattern)? true:false; }
    else if (countryCode === "japan"){ return phoneNumber.match(japanNumberPattern)? true:false; }
}

phoneNumber.addEventListener( "keyup", () => {
    if(numberPatternCheck(countryCode.value, phoneNumber.value)){
        displayTimedMessage(phoneMsg, "Valid Number Pattern", "green");
        hideTimedMessage(phoneMsg);
    }
    else displayTimedMessage(phoneMsg, "Invalid Number", "red"); 
});

/*......................... Get Gender  ......................... */
const genderOption = document.getElementById("gender").value;

/* ...........................* PASSWORD SECTION *............................. */

const openEye1 = document.getElementById("openEye1"), 
openEye2 = document.getElementById("openEye2"),
password = document.getElementById("password"),
confirmPassword = document.getElementById("confirmPassword");

/*......................... Show and Hide passwords  ......................... */
const showHidePassword = (passwordBox) => { passwordBox.type = passwordBox.type === "password" ? "text" : "password";} 

openEye1.addEventListener('click', () => { showHidePassword(password); });
openEye2.addEventListener('click', () => { showHidePassword(confirmPassword);});

/*......................... Password related Messages ......................... */
const passwordAreaMsg = document.getElementById("passwordAreaMsg");

/*......................... Password Validation ......................... */
const passwordPatternCheck = (password) => {
    const lowerCaseLetters = new RegExp("[a-z]", "g"), upperCaseLetters = new RegExp("[A-Z]{1,}", "g"), 
    numbers = new RegExp("[0-9]{1,}", "g");
    
    if(password.match(lowerCaseLetters) && password.match(upperCaseLetters) && password.match(numbers)) { return true; }
    return false;
} 

const passwordValueCheck = (password, confirmPassword) => {
    if (((password.value === "") || (confirmPassword.value === ""))) {
        displayTimedMessage(passwordAreaMsg, "Empty password(s)", "red");
        return false;
    }
    else if ((password.value != confirmPassword.value)) {
        displayTimedMessage(passwordAreaMsg, "Those passwords didn't match", "red");
        return false;
    }
    else if (((password.value.length >= 8) && (confirmPassword.value.length >= 8)) && (password.value === confirmPassword.value)) {
        if (passwordPatternCheck(password.value)) {
            displayTimedMessage(passwordAreaMsg, "Passwords match!", "green");
            hideTimedMessage(passwordAreaMsg);
            return true;
        }
        else {
            displayTimedMessage(passwordAreaMsg, "Must contain at least one number and one uppercase and lowercase letter, and at least 8 or more characters", "red");
            return false;
        }
    }
    else { 
        displayTimedMessage(passwordAreaMsg, "Password should have minimum 8 characters", "red"); 
        return false;
    }
}

passwordArea.addEventListener('keyup', () => { passwordValueCheck(password, confirmPassword); });

/* ................................... Terms and Condition ........................... */

const checkStatus = document.getElementById("agree"), agreeTextMsg = document.getElementById("termsMessage");

const statusMessage = (checkStatus, agreeTextMsg) => {
    if(!checkStatus) displayTimedMessage(agreeTextMsg, "Kindly accept our Terms and Conditions", "red"); 
    else agreeTextMsg.innerText = ""; 
}

checkStatus.addEventListener("click", () => statusMessage(checkStatus.checked, agreeTextMsg));

/*********************................. FORM SUBMISSION .................*********************/

const registerButton = document.getElementById("registerButton");
 
const storeObjects = function(key, value) {
    if (localStorage.getItem(key)) {
        let previousUsers = [];
        previousUsers.push(JSON.parse(localStorage.getItem(key)));
        previousUsers.push(value); //new value
        localStorage.setItem(key, JSON.stringify(previousUsers));
    }
    else localStorage.setItem(key, JSON.stringify(value)); // first value
}

const inputValidation = (user) => {
    if ((user.firstName === firstName.value) && (user.lastName === lastName.value) || (user.password ===  password.value) && (user.email === email.value)) return true; 
}

const writeToLocalNewUsers = () => {
    try {
        for(let user of users) {
            if(inputValidation(user)) displayTimedMessage(termsMessage, "Already Registered.", "red"); 
            else { 
                storeObjects("users", registeredUser);
                location.href = "login.html";
            }
        }
    } 
    catch (err) { // Only one user present
        if(inputValidation(user)) displayTimedMessage(termsMessage, "Already Registered.", "red");
        else { 
            storeObjects("users", registeredUser);
            location.href = "login.html";
        }
    } 
}

registerButton.addEventListener('click', (e) => {
    e.preventDefault();
    if ((nameCheck(firstName.value)) && (nameCheck(lastName.value)) && (getAge(calenderInput.value) >= 18) && (numberPatternCheck(countryCode.value, phoneNumber.value)) && (passwordValueCheck(password, confirmPassword)) && (checkStatus.checked) && (emailPatternCheck(email.value))) {
        const registeredUser = {
            "firstName": firstName.value,
            "lastName": lastName.value,
            "age": calenderInput.value,
            "email": email.value,
            "code": countryCode.value,
            "phone": phoneNumber.value,
            "password": password.value,
            "agree": checkStatus.checked
        };

        const users = JSON.parse(localStorage.getItem('users'));
        if (users === null) { 
            storeObjects("users", registeredUser); // First user
            location.href = "login.html";
        }
        else writeToLocalNewUsers();
    }
    else {
        if( !( (nameCheck(firstName.value)) && (nameCheck(lastName.value)) ) ) nameCheckEvents(nameMessageArea, firstName.value); 
        if( !( getAge(calenderInput.value) >= 18 ) ) displayTimedMessage(dobMessage, "Invalid DOB. You must be 18 years or old.", "red"); 
        if ( !(emailPatternCheck(email.value)) ) displayTimedMessage(emailAreaMsg, "Invalid Email", "red"); 
        if( !(numberPatternCheck(countryCode.value, phoneNumber.value)) ) displayTimedMessage(phoneMsg, "Invalid Number", "red"); 
        if( !(passwordValueCheck(password, confirmPassword)) ) displayTimedMessage(passwordAreaMsg, "Check password guidelines", "red"); 
        if( !(checkStatus.checked) ) statusMessage(checkStatus.checked, agreeTextMsg); 
    }
});