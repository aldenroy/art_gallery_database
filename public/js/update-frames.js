
// Get the objects we need to modify
let updateFramesForm = document.getElementById('update-frame-form');

// Modify the objects we need
updateFramesForm.addEventListener("submit", function (e) {
   
    // Prevent the form from submitting
    e.preventDefault();

    // Get form fields we need to get data from
    let mySelectNode = document.getElementById("mySelect");
    let sizeNode = document.getElementById("update-size");
    let priceNode = document.getElementById("update-price");
    let inventoryNode = document.getElementById("update-inventory");

    console.log(mySelect);

    // Get the values from the form fields
    let frameID = mySelectNode.value;
    let size = sizeNode.value;
    let price = priceNode.value;
    let inventory = inventoryNode.value;

    
    // currently the database table for bsg_people does not allow updating values to NULL
    // so we must abort if being bassed NULL for homeworld

    if (size == "" || price == "" || inventory == "") 
    {
        alert("Please enter in all fields");
        return;
    }


    // Put our data we want to send in a javascript object
    let data = { 
        frame_id: frameID,
        size: size,
        price: price,
        inventory: inventory,
    }
    
    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("PUT", "/put-frame-ajax", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {

            // Add the new data to the table
            // updateRow(xhttp.response, fullNameValue);
            window.location.replace('/frames')

        }
        else if (xhttp.readyState == 4 && xhttp.status != 200) {
            console.log("There was an error with the input.")
        }
    }

    // Send the request and wait for the response
    xhttp.send(JSON.stringify(data));

})