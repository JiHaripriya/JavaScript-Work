import createJsonRequest from "./utils.js";
import {tableHeader, tableContent } from "./table.js";
const urll = "http://127.0.0.1:5500/config/htmlJsonFileMapping.json";

let method = 'GET', url = "http://127.0.0.1:5500/apis/home.json";

// Dynamic Home Page Data
createJsonRequest( method, url, function( err, response ) {

    if(err) { 
        console.log("Error occured while processing JSON!"); 
    }
    else {

        const parentDivElement = document.querySelector(".text-wrap");
        /* 
            Element to create ~
            <h2> RMedia<img src="images/main-image.jpg" alt="" class="img-wrap"></h2>
        */
        const heading = document.createElement('h2');
        heading.innerText = response.contentHeading;
        parentDivElement.appendChild(heading);

        const image = document.createElement('img');
        image.setAttribute('src', response.contentImage);
        image.setAttribute('class', "img-wrap");
        heading.appendChild(image);

        /* ==================================================================================================== */

        /* Content in home */
        const mainContent = document.createElement('p');
        const contentText = response.contentParagraph;
        mainContent.innerText = contentText.slice(0, response.textVisibleLength);
        parentDivElement.appendChild(mainContent);

        /*
            Element to create ~
            <!--Add button: Read More-->
            <button id="read">Read More</button>
        */
        const buttonReadMore = document.createElement('button');
        buttonReadMore.setAttribute("id", "read");
        buttonReadMore.innerText = "Read More";

        // Flag action
        const readMoreContent = document.createElement('p');
        readMoreContent.style.display = "none";

        /* Toggle text: On click, the text is shown and the text is hidden on succeding click */
        buttonReadMore.addEventListener('click', () => {
            if (readMoreContent.style.display === "none") {
                readMoreContent.style.display = "block";
                mainContent.innerText = contentText; //full text
                buttonReadMore.innerText = "Collapse";

            } else {
                readMoreContent.style.display = "none";
                mainContent.innerText = contentText.slice(0, response.textVisibleLength);
                buttonReadMore.innerText = "Read More";
            }
        });

        // If the text is longer than limit, add read more button
        if (contentText.length > response.textVisibleLength){
            parentDivElement.appendChild(buttonReadMore);
        }

        // Table Area heading
        const tableHead = document.querySelector(".table__heading");
        tableHead.innerText = response.tableHeading;
        parentDivElement.appendChild(tableHead);
    }
});



const tableHeaderUrl = "http://127.0.0.1:5500/config/tableHome_Header.json",
tableContentUrl = "http://127.0.0.1:5500/apis/tableHome.json";

tableHeader(method, tableHeaderUrl);
tableContent(method, tableHeaderUrl, tableContentUrl);



