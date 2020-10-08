import createJsonRequest from "./utils.js";
import {tableHeader, tableContent } from "./table.js";
import {configFileBaseUrl, apiFileBaseUrl} from "./config.js";

let method = 'GET', url = `${apiFileBaseUrl}menu.json`,
mappingUrl = `${configFileBaseUrl}htmlJsonFileMapping.json`;

createJsonRequest( method, url, function( err, response ) {

    if(err) { 
        alert("Error occured while processing JSON!"); 
    }
    else {
        /* Element to create ~
            <title>RMedia</title>
            <h2> RMedia <img src="images/main-image.jpg" alt="" class="img-wrap"> </h2>
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

const htmlName = location.href.split("/").pop(); // Get file name
createJsonRequest(method, mappingUrl, (err, response) => {
    for (let page of response) {
        if(page.html === htmlName) {
            tableHeader(method, page.tableHeader);
            tableContent(method, page.tableHeader, page.tableContent);
        }
    }
});