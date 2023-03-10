
// Get the objects we need to modify
let updateArtistForm = document.getElementById('update-artist-form');

// Modify the objects we need
updateArtistForm.addEventListener("submit", function (e) {
   
    // Prevent the form from submitting
    e.preventDefault();

    // Get form fields we need to get data from
    let mySelectNode = document.getElementById("mySelect");
    let firstNameNode = document.getElementById("update-first-name");
    let lastNameNode = document.getElementById("update-last-name");
    let emailNode = document.getElementById("update-email");
    let addressNode = document.getElementById("update-address");

    console.log(mySelect);

    // Get the values from the form fields
    let patronId = mySelectNode.value;
    let firstName = firstNameNode.value;
    let lastName = lastNameNode.value;
    let email = emailNode.value;
    let address = addressNode.value;
    
    // currently the database table for bsg_people does not allow updating values to NULL
    // so we must abort if being bassed NULL for homeworld

    if (firstName == "" || lastName == "" || email == "" || address == "") 
    {
        alert("Please enter in all fields");
        return;
    }


    // Put our data we want to send in a javascript object
    let data = { 
        patron_id: patronId,
        first_name: firstName,
        last_name: lastName,
        email: email,
        address: address
    }
    
    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("PUT", "/put-artist-ajax", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {

            // Add the new data to the table
            // updateRow(xhttp.response, fullNameValue);
            window.location.replace('/artists')

        }
        else if (xhttp.readyState == 4 && xhttp.status != 200) {
            console.log("There was an error with the input.")
        }
    }

    // Send the request and wait for the response
    xhttp.send(JSON.stringify(data));

})