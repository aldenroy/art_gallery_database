// Get the objects we need to modify
// Citation for the following code:
// Date: 2023/03/02
// Copied and adapted from OSU GitHub (osu-cs340-ecampus) project (Dynamically Deleting Data)
// Source URL: https://github.com/osu-cs340-ecampus/nodejs-starter-app/tree/main/Step%207%20-%20Dynamically%20Deleting%20Data
let updateArtworkForm = document.getElementById('update-artwork-form');
let addArtworkForm = document.getElementById('add-artwork-form');

// replaces the create form with the update form
function updateArtwork(artwork_id) {

    let currentlyUpdatingNode = document.getElementById("currently-updating");
    let titleNode = document.getElementById("update-title");
    let artistNode = document.getElementById("update-artist");
    let priceNode = document.getElementById("update-price");
    let mediumNode = document.getElementById("update-medium");
    let dimensionsNode = document.getElementById("update-dimensions");
    let descriptionNode = document.getElementById("update-description");

    currentlyUpdatingNode.dataset.id = artwork_id;

    reqData = {
        artwork_id: artwork_id
    }

    // Sends a request for current data to fill the update form
    var xhttp = new XMLHttpRequest();
    xhttp.open("PUT", "/retrive-artwork-info-ajax", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {

            //parse into JSON
            let tempResData = JSON.parse(xhttp.response);
            //remove relevent data from array
            let resData = tempResData[0];

            // populate the form with data
            currentlyUpdatingNode.textContent = `${resData.title}`
            titleNode.value = resData.title

            console.log(artistNode.options)

            // set the select to the currentyl selected artist
            for(let i = 0; i < artistNode.options.length; i++){
                console.log(`Index: ${i} Selected ID: ${resData.artist_id} =? ${artistNode.options[i].value}`);
                if(artistNode.options[i].value == resData.artist_id){
                    artistNode.selectedIndex = i;
                    break;
                }
            }
            
            priceNode.value = resData.price
            mediumNode.value = resData.medium
            dimensionsNode.value = resData.dimensions
            descriptionNode.value = resData.description

        }
        else if (xhttp.readyState == 4 && xhttp.status != 200) {
            console.log("information not retrived")
        }
    }

    // Send the request and wait for the response
    xhttp.send(JSON.stringify(reqData));

    //unhide update form
    updateArtworkForm.removeAttribute("hidden");

    //hide add form
    addArtworkForm.setAttribute("hidden", "hidden");

}

// Modify the objects we need
updateArtworkForm.addEventListener("submit", function (e) {
   
    // Prevent the form from submitting
    e.preventDefault();

    // Get form fields we need to get data from
    let currentlyUpdatingNode = document.getElementById("currently-updating");
    let titleNode = document.getElementById("update-title");
    let artistNode = document.getElementById("update-artist");
    let priceNode = document.getElementById("update-price");
    let mediumNode = document.getElementById("update-medium");
    let dimensionsNode = document.getElementById("update-dimensions");
    let descriptionNode = document.getElementById("update-description");

    // Get the values from the form fields
    let artwork_id = currentlyUpdatingNode.dataset.id;
    let title = titleNode.value;
    let artist_id = artistNode.value;
    let price = priceNode.value;
    let medium = mediumNode.value;
    let dimensions = dimensionsNode.value;
    let description = descriptionNode.value;

    console.log(artistNode.value);
    
    // currently the database table for bsg_people does not allow updating values to NULL
    // so we must abort if being bassed NULL for homeworld

    if (title == "" || artist_id == "" || price == "" || medium == "" || dimensions == "" || description == "" ) 
    {
        alert("Please enter in all fields");
        return;
    }


    // Put our data we want to send in a javascript object
    let data = { 
        artwork_id: artwork_id,
        title: title,
        artist_id: artist_id,
        price: price,
        medium: medium,
        dimensions: dimensions,
        description: description    
    }
    
    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("PUT", "/update-artwork-ajax", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {

            // Add the new data to the table
            // updateRow(xhttp.response, fullNameValue);
            window.location.replace('/artwork')

        }
        else if (xhttp.readyState == 4 && xhttp.status != 200) {
            console.log("There was an error with the input.")
        }
    }

    // Send the request and wait for the response
    xhttp.send(JSON.stringify(data));

})