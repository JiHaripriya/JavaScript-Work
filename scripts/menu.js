import createJsonRequest from "./utils.js";
import {apiFileBaseUrl} from "./config.js";

var method = 'GET', url = `${apiFileBaseUrl}menu.json`, pageNotFound = "../pageNotFound.html";

createJsonRequest( method, url, function( err, response ) {

    if( err ) { 
        alert("Error occured while processing JSON!"); 
    }
    else {
        /* Element to create ~
            <nav>
                <ul class="nav__main"> <li><a href="pageNotFound.html">Home</a></li> </ul>
            </nav>
        */
        const parentElement = document.querySelector(".menu");
        const nav_section = parentElement.appendChild(document.createElement('nav'));
        const ul_nav_main = nav_section.appendChild(document.createElement('ul'));
        ul_nav_main.setAttribute("class", "nav__main"); // Apply styling property defined in CSS
        
        for (let each_option of response) 
        {
            const liElement = document.createElement('li');
            const aElement = document.createElement('a');

            // Page not found
            if (each_option.not_found === true) {
                aElement.setAttribute('href', pageNotFound);
                aElement.innerHTML = each_option.title;
            } // Page available
            else {
                aElement.setAttribute('href', `../${each_option.href}`);
                aElement.innerHTML = each_option.title;
            }

            // Appending each link to list item to form unordered list
            ul_nav_main.appendChild(liElement).appendChild(aElement);
        }
    }
});