import createJsonRequest from "./utils.js";
import {tableHeader, tableContent } from "./table.js";

var method = 'GET',
url = "http://127.0.0.1:5500/apis/menu.json";

createJsonRequest( method, url, function( err, response ) {

    if(err) { 
        console.log("Error occured while processing JSON!"); 
    }
    else {
        /* Element to create ~
            <title>RMedia</title>
            <h2>
                RMedia
                <img src="images/main-image.jpg" alt="" class="img-wrap">
            </h2>
        */

        // Setting Page title
        let fileName = document.location.href.split("/").pop(); // Get file name
        response.forEach(element => {                                               // page found
            if(fileName.toLowerCase().search(element.title.toLowerCase()) == 0 && element.not_found == false){
                document.title = element.title;

                //Set Content Title
                const heading = document.querySelector("h2");
                heading.textContent = element.title;
            }
        });  
    }
});

const tableHeaderUrl = "http://127.0.0.1:5500/config/tableService_Header.json",
tableContentUrl = "http://127.0.0.1:5500/apis/tableServices.json";

tableHeader(method, tableHeaderUrl);
tableContent(method, tableHeaderUrl, tableContentUrl);