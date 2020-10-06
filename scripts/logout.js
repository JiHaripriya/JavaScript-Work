// Checks whether user is logged in or not
if (localStorage.getItem("currentuser")) {
    let button = document.createElement("button");
    button.setAttribute("id", "logoutButton");
    button.textContent = "Logout";
  
    // Set first name and last name in header
    var userName = `${JSON.parse(localStorage.getItem("currentuser")).firstName} ${JSON.parse(localStorage.getItem("currentuser")).lastName}`;
    var nameArea = document.getElementById("display-name");
    nameArea.textContent = "Hi, " + userName;
    nameArea.style.padding = "0 20px 0 0";
    document.getElementById("logout").appendChild(button);

    document.getElementById("logoutButton").addEventListener("click", function () {
        localStorage.removeItem("currentuser"); 
        window.location.href = "login.html";
    });
}
else {
    window.location.href = "login.html";  // Redirection
}
  