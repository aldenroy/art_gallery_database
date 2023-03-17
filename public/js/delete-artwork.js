function deleteFrame(artwork_id) {
    // Put our data we want to send in a javascript object
    let data = {
        artwork_id: artwork_id
    };

    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("DELETE", "/delete-artowrk-ajax", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 204) {

            // Add the new data to the table
            console.log("here");
            deleteRow(artwork_id);

        }
        else if (xhttp.readyState == 4 && xhttp.status != 204) {
            console.log("There was an error with the input.")
            alert("Can not delete artwork while asociated with transaction")
        }
    }
    // Send the request and wait for the response
    xhttp.send(JSON.stringify(data));
}


function deleteRow(artwork_id){

    //select the row items
    let tableRows = document.getElementsByClassName('row');

    //iterate through selected rows
    for (let i = 0; i < tableRows.length; i++){

        //if the id of the current item matches the id of the selected item delete it 
        if (tableRows[i].getAttribute("data-id") == artwork_id){
            tableRows[i].remove();
            break;
        }
    }
}