/* This is the Header of the website.
This handles everything that happen on the header. These include checking if
user is logged in and such. */

// Note: This JS calls the home.php files and sit in /home/ folder

// Some boilerplate code. Not used but left just in case :)
// Enable hidden nav bar
//  const nav = document.querySelector(".nav");
//  let lastScrollY = window.scrollY;

// window.addEventListener("scroll", () => {
//     if (lastScrollY < window.scrollY) {
//      nav.classList.add("nav--hidden");
//     } else {
//     nav.classList.remove("nav--hidden");
//     }

//     lastScrollY = window.scrollY;
// });

// Sends a POST to get the login data
sendXML('task', 'getId');
myID = -1;

// End of event listeners. Start of functions.
/////////////////////////////////////////////////////////////////////////

function sendXML(id, info) {
    // Function to send XML requests to php and accept data
    // Accepts (string)id, (string)info
    // Returns null
    //
    var data = new FormData();
    data.append(id, info);

    xmlhttp = new XMLHttpRequest();
    // Sending the submitted data to the home.php file as POST data
    //
    xmlhttp.open("POST","../home/header.php", true);
    xmlhttp.onreadystatechange=function(){
        if (xmlhttp.readyState == 4){
            if(xmlhttp.status == 200){
                // When a reply is recieved, call the gotReply function
                // transfering the XML reply (xmlhttp.response) to it
                gotReply(xmlhttp.response);
            }
        }
    };
    xmlhttp.send(data);
}

function gotReply(session) {
    // Function that accepts the reply recieved by POST
    // Accepts (string)session as the reply from POST request
    // Returns null
    //
    // If the reply is 'None', then we're not logged in. Therefore we change the
    // header profile to let user login. Else we let user logout.
    if (!session.includes("None")) {
        const userElement = document.querySelector("#username");;
        userElement.textContent = "Sign Out";
    } else {
        const userElement = document.querySelector("#username");;
        userElement.textContent = "Log In";
        myID = session;
    }
    // console.log(session);
}