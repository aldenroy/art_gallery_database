
// Get the objects we need to modify
let updateArtistForm = document.getElementById('update-artist-form');
let addArtistForm = document.getElementById('add-artist-form');

// replaces the create form with the update form
function updateArtist(patron_id) {

    let currentlyUpdatingNode = document.getElementById("currently-updating");
    let firstNameNode = document.getElementById("update-first-name");
    let lastNameNode = document.getElementById("update-last-name");
    let emailNode = document.getElementById("update-email");
    let addressNode = document.getElementById("update-address");

    currentlyUpdatingNode.dataset.id = patron_id;

    reqData = {
        patron_id: patron_id
    }

    // Sends a request for current data to fill the update form
    var xhttp = new XMLHttpRequest();
    xhttp.open("PUT", "/retrive-patron-info-ajax", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {

            //parse into JSON
            let tempResData = JSON.parse(xhttp.response);
            //remove relevent data from array
            let resData = tempResData[0];
            console.log(resData);

            // populate the form with data
            currentlyUpdatingNode.textContent = `${resData.first_name} ${resData.last_name}`
            firstNameNode.value = resData.first_name;
            lastNameNode.value = resData.last_name;
            emailNode.value = resData.email;
            addressNode.value = resData.address;

        }
        else if (xhttp.readyState == 4 && xhttp.status != 200) {
            console.log("information not retrived")
        }
    }

    // Send the request and wait for the response
    xhttp.send(JSON.stringify(reqData));

    //unhide update form
    updateArtistForm.removeAttribute("hidden");

    //hide add form
    addArtistForm.setAttribute("hidden", "hidden");

}

// Modify the objects we need
updateArtistForm.addEventListener("submit", function (e) {
   
    // Prevent the form from submitting
    e.preventDefault();

    // Get form fields we need to get data from
    let currentlyUpdatingNode = document.getElementById('currently-updating');
    let firstNameNode = document.getElementById("update-first-name");
    let lastNameNode = document.getElementById("update-last-name");
    let emailNode = document.getElementById("update-email");
    let addressNode = document.getElementById("update-address");

    // Get the values from the form fields
    let patronId = currentlyUpdatingNode.dataset.id;
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