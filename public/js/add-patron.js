// let addPersonForm = document.getElementById('add-patron-form');

// // Modify the objects we need
// addPersonForm.addEventListener("submit", function (e) {
    
//     // Prevent the form from submitting
//     e.preventDefault();

//     // Get form fields we need to get data from
//     let inputFirstName = document.getElementById("inputFname");
//     let inputLastName = document.getElementById("inputLname");
//     let inputEmail = document.getElementById("email");
//     let inputAddress = document.getElementById("address");

//     // Get the values from the form fields
//     let firstNameValue = inputFirstName.value;
//     let lastNameValue = inputLastName.value;
//     let emailValue = inputEmail.value;
//     let addressValue = inputAddress.value;

//     // Put our data we want to send in a javascript object
//     let data = {
//         fname: firstNameValue,
//         lname: lastNameValue,
//         email: emailValue,
//         address: addressValue
//     }
    
//     // Setup our AJAX request
//     var xhttp = new XMLHttpRequest();
//     xhttp.open("POST", "/add-patron-set-form", true);
//     xhttp.setRequestHeader("Content-type", "application/json");

//     // Tell our AJAX request how to resolve
//     xhttp.onreadystatechange = () => {
//         if (xhttp.readyState == 4 && xhttp.status == 200) {

//             // Add the new data to the table
//             addRowToTable(xhttp.response);

//             // Clear the input fields for another transaction
//             inputFirstName.value = '';
//             inputLastName.value = '';
//             inputEmail.value = '';
//             inputAddress.value = '';
//         }
//         else if (xhttp.readyState == 4 && xhttp.status != 200) {
//             console.log("There was an error with the input.")
//         }
//     }

//     // Send the request and wait for the response
//     xhttp.send(JSON.stringify(data));

// })
