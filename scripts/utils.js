// Fetch JSON from server using HTTP Request
var createJsonRequest = (httpMethod, url, callback) => {

    let xhr = new XMLHttpRequest();
    xhr.open( httpMethod, url, true);

    xhr.onload = function() {
        if (this.status == 200) {
            callback( null, JSON.parse(this.responseText));
        }  
    }; 

    xhr.onerror = function() { callback(this.response, null); };
    xhr.send();
}

export default createJsonRequest;

// Search Functionality
const searchBar = document.getElementById("search");

searchBar.addEventListener(('click'), () => {
    if (searchBar.value != "") {
        window.location.reload();
    }
});

searchBar.addEventListener('keyup', (event) => {

    const mainContent = document.querySelector("main").innerHTML;
    const searchText = searchBar.value;

    const match = new RegExp(`\\b${searchText}\\b`, "gim"); 
    const removeMatch = new RegExp( `(<mark>|</mark>)`, "gim");

   // Search only if enter key is pressed after typing : key code = 13 code: Enter
    if ( event.code === "Enter" && searchText.length > 0) {  
        document.querySelector("main").innerHTML = mainContent.replace(match, `<mark>${searchBar.value}</mark>`);
    } 
    // If backspace is pressed, clear highlight
    else if(event.code === "Backspace" || event.code === "Delete") {
        document.querySelector("main").innerHTML = mainContent.replace(removeMatch, "");
    }
});