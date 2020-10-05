import createJsonRequest from "./utils.js";

var method = 'GET',
url = "http://127.0.0.1:5500/apis/menu.json";

createJsonRequest( method, url, function( err, response ) {

    if(err) { 
        console.log( "Error occured while processing JSON!" ); 
    }
    else {
        // Setting Page title
        let fileName = document.location.href.split("/").pop(); // Get file name
        response.forEach(element => {
            // If file is found, not_found will be false
            if(fileName.toLowerCase().search(element.title.toLowerCase() == 0 && element.not_found == false) ){
                document.title = element.title;

                //Set Content Title
                const heading = document.querySelector("h2");
                heading.textContent = element.title;
            }
        });
    }
});

// Key down event on description/comment section to indicate number of remaining characters
const comment = document.getElementById("description");
const maxLimit = comment.getAttribute('maxlength');
let remaining = document.getElementById("remaining");
comment.addEventListener('keydown', () => {
    
    if ( comment.value.length >= maxLimit ) {
        remaining.innerText = "Max Limit Reached";
    } else {
        remaining.innerText = `(${maxLimit - comment.value.length} characters remaining)`;
    }
});


const formButton = document.querySelector(".registerbtn");
formButton.addEventListener('click', () => {

    const userName = `${document.getElementById("name").value}`;
    let subject;
    // Checking if subject is filled
    if(document.getElementById("subject").value.length > 0 && document.getElementById("subject").value != " "){
        subject = `${document.getElementById("subject").value}`;
    } else {
        subject = `NIL`;
    }
    const phone = `+91-${document.getElementById("phone").value}`;
    const email = `${document.getElementById("email").value}`;
    const comment = `${document.getElementById("description").value}`;

    const payLoad = [
        {
            "name": userName,
            "subject": subject,
            "phone": phone,
            "email": email,
            "description": comment 
        }
    ]
    // Put the object into storage
    localStorage.setItem('payLoad', JSON.stringify(payLoad));
});

// Retrieve the object from storage
var retrievedObject = localStorage.getItem('payLoad');
console.log('Pay Load: ', JSON.parse(retrievedObject));
