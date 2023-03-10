// Citation for the following code:
// Date: 2023/03/02
// Copied and adapted from OSU GitHub (osu-cs340-ecampus) project (Dynamically Deleting Data)
// Source URL: https://github.com/osu-cs340-ecampus/nodejs-starter-app/tree/main/Step%207%20-%20Dynamically%20Deleting%20Data

function deleteFrame(frame_id) {
    // Put our data we want to send in a javascript object
    let data = {
        frame_id: frame_id
    };

    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("DELETE", "/delete-frame-ajax", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 204) {

            // Add the new data to the table
            console.log("here");
            deleteRow(frame_id);

        }
        else if (xhttp.readyState == 4 && xhttp.status != 204) {
            console.log("There was an error with the input.")
        }
    }
    // Send the request and wait for the response
    xhttp.send(JSON.stringify(data));
}


function deleteRow(frame_id){

    //select the row items
    let tableRows = document.getElementsByClassName('row');

    //iterate through selected rows
    for (let i = 0; i < tableRows.length; i++){

        //if the id of the current item matches the id of the selected item delete it 
        if (tableRows[i].getAttribute("data-id") == frame_id){
            tableRows[i].remove();
            break;
        }
    }
}