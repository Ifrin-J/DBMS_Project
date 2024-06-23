

// take user name from user 
let username
let password


// Add event listener to the sign in form
document.getElementById('signInForm').addEventListener('submit', signIn);
let errMessage = document.getElementById('message')

// Function to handle sign in
async function signIn (event) {
    event.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    console.log(username,password)
    const resp = await fetch("http://localhost:3000/login" , {
        method : "POST",
        headers : { 
            "Content-Type":"application/json",
        },
        body:JSON.stringify({
            username,
            password    
        })

    })

   if(resp.status == 401){
    console.log(errMessage.innerHTML = "Unauthorized login")
}

if(resp.status == 200){
    errMessage.style.display = "none"
    window.location.href = "/employee.html"

    // document.getElementById('signInPage').style.display = 'none';
    // document.getElementById('employeeDetails').style.display = 'block';
    // document.getElementById('employeeName').innerHTML = 'John Doe';
    // document.getElementById('employeeRole').innerHTML = 'Software Engineer';

}

    // TO DO: Add authentication logic here
    // For now, just simulate a successful sign in
    
}

// Add event listener to the sign out button
document.getElementById('signOutButton').addEventListener('click', signOut);

// Function to handle sign out
function signOut() {
    document.getElementById('signInPage').style.display = 'block';
    document.getElementById('employeeDetails').style.display = 'none';
}

async function pari (){
    const resp = await fetch("http://localhost:3000/employees")
    console.log(resp)
   
}

