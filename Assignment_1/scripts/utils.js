// Fetch JSON from server using HTTP Request
var createJsonRequest = function( httpMethod, url, callback ) {

    let xhr = new XMLHttpRequest();
    xhr.open( httpMethod, url, true);

    xhr.onload = function() {
        if (this.status == 200) {
            callback( null, JSON.parse(this.responseText));
        }  
    }; 

    xhr.onerror = function() {
        callback( this.response );
    };

    xhr.send();
}

export default createJsonRequest;