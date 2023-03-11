
// Get the objects we need to modify
let updateFrameForm = document.getElementById('update-frame-form');
let addFrameForm = document.getElementById('add-frame-form');

// replaces the create form with the update form
function updateFrame(frame_id) {

    let currentlyUpdatingNode = document.getElementById("currently-updating");
    let priceNode = document.getElementById("update-price");
    let inventoryNode = document.getElementById("update-inventory");

    currentlyUpdatingNode.dataset.id = frame_id;

    reqData = {
        frame_id: frame_id
    }

    // Sends a request for current data to fill the update form
    var xhttp = new XMLHttpRequest();
    xhttp.open("PUT", "/retrive-frame-info-ajax", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {

            console.log(xhttp.response)

            //parse into JSON
            let tempResData = JSON.parse(xhttp.response);
            //remove relevent data from array
            let resData = tempResData[0];
            console.log(resData);

            // populate the form with data
            currentlyUpdatingNode.textContent = `${resData.frame_id}`
            priceNode.value = resData.price;
            inventoryNode.value = resData.inventory;

        }
        else if (xhttp.readyState == 4 && xhttp.status != 200) {
            console.log("information not retrived")
        }
    }

    // Send the request and wait for the response
    xhttp.send(JSON.stringify(reqData));

    //unhide update form
    updateFrameForm.removeAttribute("hidden");

    //hide add form
    addFrameForm.setAttribute("hidden", "hidden");

}

// Modify the objects we need
updateFrameForm.addEventListener("submit", function (e) {
   
    // Prevent the form from submitting
    e.preventDefault();

    // Get form fields we need to get data from
    let currentlyUpdatingNode = document.getElementById("currently-updating");
    let priceNode = document.getElementById("update-price");
    let inventoryNode = document.getElementById("update-inventory");

    // Get the values from the form fields
    let frameID = currentlyUpdatingNode.dataset.id;
    let price = priceNode.value;
    let inventory = inventoryNode.value;

    
    // currently the database table for bsg_people does not allow updating values to NULL
    // so we must abort if being bassed NULL for homeworld

    if (price == "" || inventory == "") 
    {
        alert("Please enter in all fields");
        return;
    }


    // Put our data we want to send in a javascript object
    let data = { 
        frame_id: frameID,
        price: price,
        inventory: inventory
    }
    
    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("PUT", "/update-frame-ajax", true);
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