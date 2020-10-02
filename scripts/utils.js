// Fetch JSON from server using HTTP Request
var createJsonRequest = (httpMethod, url, callback) => {

    let xhr = new XMLHttpRequest();
    xhr.open( httpMethod, url, true);

    xhr.onload = function() {
        if (this.status == 200) {
            callback( null, JSON.parse(this.responseText));
        }  
    }; 

    xhr.onerror = function() {
        callback(this.response, null);
    };

    xhr.send();
}

export default createJsonRequest;
/*.................................................................................................................*/

// Search - Highlight
const searchBar = document.getElementById("search");

searchBar.addEventListener(('click'), () => {
    if (searchBar.value != ""){
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

/*.................................................................................................................*/

// Table Header creation
var tableHeader = (httpMethod, tableHeaderUrl) => {
    createJsonRequest(httpMethod, tableHeaderUrl, function(err, response) {

        const table = document.querySelector("#pageTable thead");
        const tableHeadRow = document.createElement("tr");

        for(let column of response) {

            const heading = document.createElement("th");
            heading.innerText = column.name;
            heading.style.backgroundColor = "#6aa1b2";

            //sortable: true --> if true make a sort button, align text to center to match button
            if (column.sortable) {
                const button = document.createElement("button");
                button.innerText = "Sort";
                heading.style.textAlign = "center";
                heading.appendChild(button);
            }
            tableHeadRow.appendChild(heading);
        }
        table.appendChild(tableHeadRow)
        
    });
}
export {tableHeader};

/*.................................................................................................................*/

// Table Content creation
var tableContent = (httpMethod, tableHeaderUrl, tableContentUrl) => {

    createJsonRequest(httpMethod, tableHeaderUrl, function(err, tableColumns) {

        let keys = [], types = [],texts =[];
        for(let column of tableColumns) {
            keys.push(column.key);
            types.push(column.type);
            texts.push(column.text);
        }
        
        createJsonRequest(httpMethod, tableContentUrl, function(err, tableRows) {

            const table = document.querySelector("#pageTable tbody");
            console.log(tableRows)

            for(let column of tableRows) {
                const tableHeadRow = document.createElement("tr");

                for (let key in column) {
                    
                    const tableData = document.createElement("td");
                    const dataIndex = keys.indexOf(key);

                    const isValid = (value) => {
                        tableData.innerText = value != "-" ? value: "-";
                    }

                    const isLink = (link, value, text) => {
                        if (value != "-") {
                            link.style.textDecoration = "underline";
                            link.setAttribute("href", value);
                            link.innerText = text;
                        }
                        else {
                            link.innerText = "-";
                        }
                        link.style.color = "#ffffff";
                        tableData.appendChild(link);
                    }

                    const isAvailable = (button, availability) => {
                        if (availability){
                            tableData.appendChild(button);
                        }
                        else {
                            tableData.innerText = "-";
                            tableData.style.textAlign = "center";
                        }
                    }

                    // valid column check
                    if(keys.indexOf(key) != -1) {

                        if (types[dataIndex] == "string"){
                            tableData.style.textAlign = "left";
                            isValid(column[key]);
                        }
                        else if (types[dataIndex] == "link"){
                            tableData.style.textAlign = "left";
                            const link = document.createElement("a");
                            isLink(link, column[key], texts[dataIndex])
                        }
                        else if (types[dataIndex] == "number") {
                            tableData.style.textAlign = "right";
                            tableData.style.paddingRight = "10px";
                            isValid(column[key]);
                        }
                        else if (types[dataIndex] == "date"){
                            tableData.style.textAlign = "right";
                            tableData.style.paddingRight = "10px";
                            isValid(column[key]);
                        }
                        else if (types[dataIndex] == "button"){
                            const button = document.createElement("button");
                            button.innerText = texts[dataIndex];
                            isAvailable(button, column[key]);
                        }
                    }
                    tableHeadRow.appendChild(tableData);                   
                }
                table.appendChild(tableHeadRow)   
            }  
        });
    });
}
export {tableContent};