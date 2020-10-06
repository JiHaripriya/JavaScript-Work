import createJsonRequest from "./utils.js";
import {configFileBaseUrl} from "./config.js";

const mappingUrl = `${configFileBaseUrl}htmlJsonFileMapping.json`;

// Function to store column attributes
var getTableColumnAttributes = (tableColumns) => {
    let keys = [], types = [],texts =[];
    for(let column of tableColumns) {
        keys.push(column.key);
        types.push(column.type);
        texts.push(column.text);
    }
    return [keys, types, texts];
}

var sortTableContents = (columnName, dataType, tableColumns, sortType) => {
    
    // Load json from mapping file
    const htmlName = window.location.href.split("/").pop();
    createJsonRequest("GET", mappingUrl , (err, response) => {
        if (err) alert("JSON loading pending");
        else {
            const table = document.querySelector("#pageTable tbody");
            
            //Remove table content from html
            while (table.firstChild) {
                table.removeChild(table.lastChild);
            }
            
            for (let page of response) {
                if (page.html == htmlName) {
                    
                    // Request to corresponding JSON for table content
                    createJsonRequest("GET", page.tableContent, (err, tableRows) => {
                        let tableContent = JSON.stringify(tableRows);
                        const replaceWith = new RegExp(`${columnName}`, "g") // replace original key with columnName
                        tableContent = JSON.parse(tableContent.replace(replaceWith, "columnName"));
                        tableColumns = JSON.parse(JSON.stringify(tableColumns).replace(replaceWith, "columnName"));
                        
                        if (sortType === "ascending") {
                            if (dataType == "string" || dataType == "link" || dataType == "date") {
                                tableContent.sort( (a, b) => {return a.columnName > b.columnName ? 1 : -1; });    
                            }
                            else if (dataType == "number") {
                                tableContent.sort( (a, b) => { return a.columnName - b.columnName; });    
                            }
                        }
                        else if (sortType === "descending") {
                            if (dataType == "string" || dataType == "link" || dataType == "date") {
                                tableContent.sort( (a, b) => {return b.columnName > a.columnName ? 1 : -1; });    
                            }
                            else if (dataType == "number") {
                                tableContent.sort( (a, b) => { return b.columnName - a.columnName; });    
                            }
                        }
                        else window.location.reload(); // revert sorted changes
                        
                        // Construct table body with sorted JSON
                        const result = getTableColumnAttributes(tableColumns), keys = result[0], 
                        types = result[1], texts = result[2];
                        constructTableContent(tableContent, keys, types, texts);
                    });
                }
            }
        }  
    });
}

const resetOtherSelectOptions = (id) => {
    const allSelectOptions = document.querySelectorAll("select");
    for (let each_select of allSelectOptions) {
        if (each_select.id != id) each_select.value = "";
    }
}

const createSortDropDown = (id, dataType, heading, tableColumns) => {
    const sortDropDown = document.createElement('select');
    sortDropDown.setAttribute("id", id);
    sortDropDown.innerHTML = `
        <option value="default" selected></option>
        <option value="ascending"> Ascending</option>
        <option value="descending"> Descending</option>
    `;

    sortDropDown.addEventListener('change', () => {
        resetOtherSelectOptions(id);
        if (sortDropDown.value == "ascending") sortTableContents(id, dataType, tableColumns, "ascending");
        else if (sortDropDown.value == "descending") sortTableContents(id, dataType, tableColumns, "descending");
        else sortTableContents(id, dataType, tableColumns, "");
    });
    heading.appendChild(sortDropDown);
}

// Table Header creation
var tableHeader = (httpMethod, tableHeaderUrl) => {
    createJsonRequest(httpMethod, tableHeaderUrl, (err, response) => {
        const table = document.querySelector("#pageTable thead");
        const tableHeadRow = document.createElement("tr");

        for(let column of response) {
            const heading = document.createElement("th");
            heading.innerText = column.name;
            heading.style.backgroundColor = "#6aa1b2";

            //sortable: true --> create sortable drop list
            if (column.sortable) createSortDropDown(column.key, column.type, heading, response);
            
            heading.style.textAlign = "center";
            tableHeadRow.appendChild(heading);
        }
        table.appendChild(tableHeadRow);
    });
}

export {tableHeader};

var displayAlert = (id) => {

    // Disables other button actions
    const buttons = document.getElementsByTagName("button");
    for (let button of buttons) { button.disabled = true; }

    const alertBody = document.getElementById("alert");
    alertBody.style.display = "block";
    
    const closeButton = document.createElement("span");
    closeButton.setAttribute("id", id);
    closeButton.innerText = "x";

    closeButton.addEventListener('click', () => {
        while (alertBody.firstChild) { alertBody.removeChild(alertBody.lastChild); }
        alertBody.style.display = "none";
    
        //enables button action
        for (let button of buttons) { button.disabled = false; }
    });
    alertBody.appendChild(closeButton);

    const alertText = document.createElement("p");
    alertText.innerText = "Alert for Button Click";
    alertBody.appendChild(alertText);
}

// Checks for received input value: '-' indicates null value

const isValid = (value, tableData) => {
    tableData.style.textAlign = "left";
    tableData.innerText = value != "-" ? value: "-";
}

const isLink = (link, value, text, tableData) => {
    if (value != "-") {
        link.style.textDecoration = "underline";
        link.setAttribute("href", value);
        link.innerText = text;
    }
    else link.innerText = "-"; 

    link.style.color = "#ffffff";
    tableData.appendChild(link);
}

const isNumberOrDate = (value, tableData) => {
    tableData.style.textAlign = "right";
    tableData.style.paddingRight = "10px";
    isValid(value, tableData);
}

const isPositionAvailable = (button, availability, id, tableData) => {
    if (availability) {
        button.addEventListener('click', () => displayAlert(id));
        tableData.appendChild(button);
    }
    else {
        tableData.innerText = "-";
        tableData.style.textAlign = "center";
    }
}

var constructTableContent = (tableRows, keys, types, texts) => {
    const table = document.querySelector("#pageTable tbody");
    // Loops through each row of table content
    for(let column of tableRows) 
    {
        const tableHeadRow = document.createElement("tr");

        // Looping through each column value of a row
        for (let key in column) 
        {
            const tableData = document.createElement("td"), dataIndex = keys.indexOf(key),
            dataType = types[dataIndex], value = column[key], innerText = innerText,
            column = keys[dataIndex];

            switch(dataType) 
            {
                case "string":  isValid(value, tableData);
                                break;

                case "link":    const link = document.createElement("a");
                                isLink(link, value, innerText, tableData);
                                break;

                case "number":  isNumberOrDate(value, tableData);
                                break;

                case "date":    isNumberOrDate(value, tableData);
                                break;

                case "button":  const button = document.createElement("button");
                                button.innerText = texts[dataIndex];
                                isPositionAvailable(button, value, column, tableData); 
                                break;
            }
            tableHeadRow.appendChild(tableData);                   
        }
        table.appendChild(tableHeadRow)   
    }  
}

// Table Content creation
var tableContent = (httpMethod, tableHeaderUrl, tableContentUrl) => {

    createJsonRequest(httpMethod, tableHeaderUrl, function(err, tableColumns) {
        if (err) {
            alert("JSON Loading Pending!");
        }
        else {
            const result = getTableColumnAttributes(tableColumns);   
            const keys = result[0], types = result[1], texts = result[2];
            createJsonRequest(httpMethod, tableContentUrl, (err, tableRows) => {
                constructTableContent(tableRows, keys, types, texts);
            });
        }
    });
}
export {tableContent};