import createJsonRequest from "./utils.js";

var method = 'GET',
url = "http://127.0.0.1:5500/apis/latestPosts.json";

createJsonRequest( method, url, function( err, response ) {

    if( err ) { 
        console.log("Error occured while processing JSON!"); 
    }
    else {
        /* Latest Posts 
            <h3>Latest Posts</h3>
            <ul>
                <li><a href=""><img src="images/post-image.jpg" alt=""></a></li>
                <li><a href=""><img src="images/post-image.jpg" alt=""></a></li>
                <li><a href=""><img src="images/post-image.jpg" alt=""></a></li>
            </ul>
        */
        const articleParent = document.querySelector(".latest-posts");

        const title = document.createElement('h3');
        title.innerText = response.articleHeading;
        articleParent.appendChild(title);

        const ulElement = document.createElement("ul");
        articleParent.appendChild(ulElement);

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