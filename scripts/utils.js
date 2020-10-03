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

/*.................................................................................................................*/

var getDataArrays = (tableColumns) => {
    let keys = [], types = [],texts =[];
    for(let column of tableColumns) {
        keys.push(column.key);
        types.push(column.type);
        texts.push(column.text);
    }
    return [keys, types, texts];
}

/*.................................................................................................................*/

var sort = (buttonId, dataType, tableColumns) => {

    // Which html is calling?
    const htmlName = window.location.href.split("/").pop(); // Get file name
    if (!htmlName) {
        window.location.href = "http://127.0.0.1:5500/index.html"; // manual redirection due to lack of indexing
    }

    // Load json from mapping file
    createJsonRequest("GET", "http://127.0.0.1:5500/config/htmlJsonFileMapping.json", (err, response) => {
        if (err) {
            alert("JSON loading pending");
        }
        else {
            const table = document.querySelector("#pageTable tbody");

            //Remove table content from html
            while (table.firstChild) {
                table.removeChild(table.lastChild);
            }

            for (let page of response) 
            {
                if (page.html == htmlName)
                {
                    // Request to corresponding JSON for table content
                    createJsonRequest("GET", page.tableContent, (err, tableRows) => 
                    {
                        let tableContent = JSON.stringify(tableRows);
                        const replaceWith = new RegExp(`${buttonId}`, "g") // replace original key with buttonId
                        tableContent = JSON.parse(tableContent.replace(replaceWith, "buttonId"));
                        tableColumns = JSON.parse(JSON.stringify(tableColumns).replace(replaceWith, "buttonId"));
    
                        if (dataType == "string" || dataType == "link" || dataType == "date") {
                            tableContent.sort( (a, b) => {
                                return a.buttonId > b.buttonId ? 1 : -1;
                            });    
                        }
                        else if (dataType == "number") {
                            tableContent.sort( (a, b) => {
                                return a.buttonId - b.buttonId;
                            });    
                        }
    
                        // Construct table body again
                        const result = getDataArrays(tableColumns);     
                        const keys = result[0], types = result[1], texts = result[2];
                        constructTableContent(tableContent, keys, types, texts);
                    });
                }
            }
        }  
    });
}

/*.................................................................................................................*/

// Table Header creation
var tableHeader = (httpMethod, tableHeaderUrl) => {
    createJsonRequest(httpMethod, tableHeaderUrl, (err, response) => {
        if (err) {
            alert("JSON loading pending"); 
        }
        else {
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

                    // to identify which button is clicked
                    button.setAttribute("id", column.key);
                    button.addEventListener('click', () => {
                        sort(button.id, column.type, response);
                    });

                    heading.style.textAlign = "center";
                    heading.appendChild(button);
                }
                tableHeadRow.appendChild(heading);
            }
            table.appendChild(tableHeadRow);
        }
    });
}

export {tableHeader};

/*.................................................................................................................*/

var displayAlert = (id, button) => {

    // disable other actions
    const buttons = document.getElementsByTagName("button");
    for (let button of buttons) {
        button.disabled = true;
    }

    const alertBody = document.getElementById("alert");
    alertBody.style.display = "block";
    
    const closeButton = document.createElement("span");
    closeButton.setAttribute("id", id);
    closeButton.innerText = "x";

    closeButton.addEventListener('click', () => {
        while (alertBody.firstChild) {
            alertBody.removeChild(alertBody.lastChild);
        }
        alertBody.style.display = "none";

        for (let button of buttons) {
            button.disabled = false;
        }
        
    });
    alertBody.appendChild(closeButton);

    const alertText = document.createElement("p");
    alertText.innerText = "Alert for Button Click";
    alertBody.appendChild(alertText);
}

/*.................................................................................................................*/
var constructTableContent = (tableRows, keys, types, texts) => {
    const table = document.querySelector("#pageTable tbody");
    for(let column of tableRows) 
    {
        const tableHeadRow = document.createElement("tr");

        for (let key in column) 
        {
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

            const isAvailable = (button, availability, id) => {
                if (availability) {
                    button.addEventListener('click', ()=> {
                        displayAlert(id);
                    });
                    tableData.appendChild(button);
                }
                else {
                    tableData.innerText = "-";
                    tableData.style.textAlign = "center";
                }
            }

            // valid column check
            if(keys.indexOf(key) != -1) {

                if (types[dataIndex] == "string") {
                    tableData.style.textAlign = "left";
                    isValid(column[key]);
                }
                else if (types[dataIndex] == "link") {
                    tableData.style.textAlign = "left";
                    const link = document.createElement("a");
                    isLink(link, column[key], texts[dataIndex])
                }
                else if (types[dataIndex] == "number") {
                    tableData.style.textAlign = "right";
                    tableData.style.paddingRight = "10px";
                    isValid(column[key]);
                }
                else if (types[dataIndex] == "date") {
                    tableData.style.textAlign = "right";
                    tableData.style.paddingRight = "10px";
                    isValid(column[key]);
                }
                else if (types[dataIndex] == "button") {
                    const button = document.createElement("button");
                    button.innerText = texts[dataIndex];
                    isAvailable(button, column[key], keys[dataIndex]);
                }
            }
            tableHeadRow.appendChild(tableData);                   
        }
        table.appendChild(tableHeadRow)   
    }  
}

/*.................................................................................................................*/

// Table Content creation
var tableContent = (httpMethod, tableHeaderUrl, tableContentUrl) => {

    createJsonRequest(httpMethod, tableHeaderUrl, function(err, tableColumns) {
        if (err) {
            alert("JSON Loading Pending!");
        }
        else {
            const result = getDataArrays(tableColumns);   
            const keys = result[0], types = result[1], texts = result[2];
            createJsonRequest(httpMethod, tableContentUrl, (err, tableRows) => {
                constructTableContent(tableRows, keys, types, texts);
            });
        }
    });
}
export {tableContent};