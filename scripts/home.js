import createJsonRequest from "./utils.js";
import {tableHeader, tableContent } from "./table.js";
import {configFileBaseUrl, apiFileBaseUrl} from "./config.js";

let method = 'GET', url = `${apiFileBaseUrl}home.json`,
mappingUrl = `${configFileBaseUrl}htmlJsonFileMapping.json`;

// Dynamic Home Page Data
createJsonRequest( method, url, function( err, response ) {

    if(err) alert("Error occured while processing JSON!"); 
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

        /* Content in home */
        const mainContent = document.createElement('p');
        const contentText = response.contentParagraph;
        mainContent.innerText = contentText.slice(0, response.textVisibleLength);
        parentDivElement.appendChild(mainContent);

        // Read more button
        const buttonReadMore = document.createElement('button');
        buttonReadMore.setAttribute("id", "read");
        buttonReadMore.innerText = "Read More";

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

const htmlName = location.href.split("/").pop(); // Get file name
createJsonRequest(method, mappingUrl, (err, response) => {
    for (let page of response){
        if(page.html === htmlName) {
            tableHeader(method, page.tableHeader);
            tableContent(method, page.tableHeader, page.tableContent);
        }
    }
});