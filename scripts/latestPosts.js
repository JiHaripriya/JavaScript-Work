import createJsonRequest from "./utils.js";
import {apiFileBaseUrl} from "./config.js";

var method = 'GET',
url =  `${apiFileBaseUrl}latestPosts.json`;

createJsonRequest( method, url, function( err, response ) {

    if( err ) { 
        alert("Error occured while processing JSON!"); 
    }
    else {
        /* <h3>Latest Posts</h3> */
        const articleParent = document.querySelector(".latest-posts");

        const title = document.createElement('h3');
        title.innerText = response.articleHeading;
        articleParent.appendChild(title);

        const ulElement = document.createElement("ul");
        articleParent.appendChild(ulElement);

        // Generating list items for latest posts
        response.latestPosts.forEach(element => {
            const liElement = document.createElement("li");

            const aElement = document.createElement("a");
            aElement.setAttribute("href", "#");

            const image = document.createElement("img");
            image.setAttribute("src", element.imageSource);
            image.setAttribute("alt", element.altText);
            image.style.cursor = "pointer";

            ulElement.appendChild(liElement.appendChild(aElement.appendChild(image)));
        });
    }
});