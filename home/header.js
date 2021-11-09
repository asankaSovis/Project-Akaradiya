// Enable hidden nav bar
 const nav = document.querySelector(".nav");
 let lastScrollY = window.scrollY;

// window.addEventListener("scroll", () => {
//     if (lastScrollY < window.scrollY) {
//      nav.classList.add("nav--hidden");
//     } else {
//     nav.classList.remove("nav--hidden");
//     }

//     lastScrollY = window.scrollY;
// });

function sendXML(id, info) {
    var data = new FormData();
    data.append(id, info);

    xmlhttp = new XMLHttpRequest();
    // Sending the submitted data to the reset.php file as POST data
    //
    xmlhttp.open("POST","../home/home.php", true);
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
    if (!session.includes("None")) {
        const userElement = document.querySelector("#username");;
        userElement.textContent = "Sign Out";
    } else {
        const userElement = document.querySelector("#username");;
        userElement.textContent = "Log In";
    }
    console.log(session);
}

sendXML('task', 'getSession');