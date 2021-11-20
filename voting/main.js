/* This is the Voting page.
This website loads when the user clicks on a link to vote.
This website is used to vote for words.
This will extract a word if provided. */

// NOTE: This website MUST NOT LOAD if the user is not logged in
// Note: This JS calls the voting.php files and sit in /voting/ folder

// Some global variables
// definitionXML contain the HTML of a definition as string
definitionXML = '<div class="row_section"><h1 class="def__main">#definition</h1>#buttons</div>';
// buttonXML contain the HTML of a button as string
buttonXML = '<button class="icon__button" id="word__btn#btnID"><img src="../assets/#btnType_b.svg" id="word__svg#btnID" height="20" width="20"></button>';
// myWordID contain the id of the word that is currently loaded as int
myWordID = 0;
// myWord contain the word as string
myWord = "";
// List of definitions that is an array of [(int)id, (string)definition]
var definitionList = [];
// ID of the user
myID = 0;
// Incrementer which keep track of the definitions loaded
incrementer = 0;
// The stats of the user
myStats = [0, 0, 0];

// Message HTML
htmlHeading = '<h1 id="badgeName" class="para__text">#heading</h1>';
htmlImage = '<img id="badgeImage" class="box__image" src="#location" alt="Badge">';
htmlPara = '<p id="levelInfo" class="para__text">#text</p>';
htmlButton = '<div class="section__center"><button class="form__button" id="overlay__close">Ok</button></div>';
htmlInput = '<input type="text" class="form__input" id="#id" autofocus placeholder="#placeholder" name="newBlock">'
successImage = "../assets/images/success.png";
errorImage = "../assets/images/error.png";

// Getting the elements required
document.getElementById('next__word').addEventListener("click", getRandomWord);
document.getElementById('search').addEventListener("click", searchWord);
document.getElementById('add__word').addEventListener("click", addNewWord);
document.getElementById('new__block').addEventListener("click", addNewBlock);

/////////////////////////////////////////////////////////////////////////
// Separating the link and extracting its content
// Note: If the link comes with a separate ?word parameter, then we specifically
// try to get that word. On every other case, a random word is taken.
//
let userlink = window.location.href; //Link we got when user clicked on the link
let mylink = window.location.pathname; //Link where the website actually reside

////////////////////////////////////////////////////////////////////////////////
// Functions

function sendXML(task, sendData, returnFunc, phpLocation="./voting.php") {
    // Function to send XML requests to php and accept data
    // Accepts (string)task that gives the task to complete, (string)sendData that contain the data to send
    // (function) returnFunc that give what function to use when reply is recieved, optional (string)phpLocation
    // that specify which php to send POST to (default='voting.php')
    // Returns null
    //
    var data = new FormData();
    data.append('task', task);
    data.append('data', sendData);

    xmlhttp = new XMLHttpRequest();
    // Sending the submitted data to the phpLocation file as POST data
    //
    xmlhttp.open("POST",phpLocation, true);
    xmlhttp.onreadystatechange=function(){
        if (xmlhttp.readyState == 4){
            if(xmlhttp.status == 200){
                // When a reply is recieved, call the returnFunc function
                // transfering the XML reply (xmlhttp.response) to it
                //console.log(xmlhttp.response);
                returnFunc(xmlhttp.response);
            }
        }
    };
    xmlhttp.send(data);
}

function getRandomWord() {
    // Sends a POST to get a random word
    // Accept none
    // Return null
    //
    sendXML('getWord', '0', gotRandomWord);
}

function getDefinitions() {
    // Sends a POST to get the definitions for a word
    // Accepts none
    // Return null
    //
    sendXML('getDefinitions', myWordID, gotDefinitions);
}

function getWordResponse() {
    // Gets a specific word instead of a random word
    // Accepts null
    // Return null
    //
    jsonString = JSON.stringify([myWordID, myID]);
    sendXML('getWordResponse', jsonString, gotWordResponse);
}

function gotRandomWord(word) {
    // When POST returned a random word
    // Accepts (string)word
    // Return null
    //
    if (word.includes("<empty>")) {
        text = "This word doesn\'t exist in our database. Click on Add Word to add it";
        innerHTML = htmlHeading.replace('#heading', 'Warning') + htmlImage.replace('#location', errorImage) + htmlPara.replace('#text', text) + htmlButton;
        showOverlay(innerHTML);
    } else {
        // console.log(word);
        myWordID = Number(JSON.parse(word)[0]);
        myWord = JSON.parse(word)[1].toUpperCase();
        document.getElementById("myWord").innerHTML = myWord;
        getWordResponse();
    }
}

function gotDefinitions(definitions) {
    // When a definition list is recieved from POST
    // Accepts (string)definition
    // Return null
    //
    var element = document.getElementById("definitionList");
    var defStrings = JSON.parse(definitions);
    defStrings.forEach(element => {
        definitionList.push(JSON.parse(element));
    });
    
    i = 0;

    definitionList.forEach(item => {
        gotDefinition = item[1];
        try {
            stringParse = JSON.parse(item[1]);
            gotDefinition = "(" + stringParse[0] + ") " + stringParse[1];
        } catch {}

        innerHTML = definitionXML.replace("#definition", i + 1 + ". " + gotDefinition);
        btnHTML = buttonXML.replace("#btnID", "+" + i + "+0").replace("#btnID", "+" + i + "+0").replace("#btnType", "like");
        btnHTML += buttonXML.replace("#btnID", "+" + i + "+1").replace("#btnID", "+" + i + "+1").replace("#btnType", "dislike");
        btnHTML += buttonXML.replace("#btnID", "+" + i + "+2").replace("#btnID", "+" + i + "+2").replace("#btnType", "flag");
        innerHTML = innerHTML.replace("#buttons", btnHTML);
        element.innerHTML += innerHTML;
        i++;

    });

    btns = document.getElementsByClassName("icon__button");
    for (var i = 0; i < btns.length; i++) {
        btns[i].addEventListener("click", onClick);
    }

    gotDefinitionResponse(-1);
}

function gotWordResponse(response) {
    // When a word is recieved from POST
    // Accepts (string)response
    // Return null
    //
    resetButtons("-1");
    if ((response >= 0) && (response <= 2)) {
        element = document.getElementById("word__svg+-1+" + response);
        element.src = element.src.replace("_b", "_c");
    }
    definitionList = [];
    incrementer = 0;
    var element = document.getElementById("definitionList");
    element.innerHTML = "";
    getDefinitions();
}

function gotDefinitionResponse(response) {
    // When a definition details are recieved from POST
    // Accepts (string)response
    // Return null
    //
    if ((response >= 0) && (response <= 2)) {
        element = document.getElementById("word__svg+" + incrementer + "+" + response);
        element.src = element.src.replace("_b", "_c");
        incrementer ++;
    }
    
    if (incrementer < definitionList.length) {
        jsonString = JSON.stringify([definitionList[incrementer][0], myID]);
        sendXML('getDefinitionResponse', jsonString, gotDefinitionResponse);
        
    }
}

function changedWordVote(response) {
    // When a word vote is changed, we reset the content of the page.
    // Note: Reason why this intermediate function exist is because POST function
    //       return a response and getWordResponse doesn't accept any. If it is directly
    //       provided, an error can occur. So we accept response and discard it and call
    //       getWordResponse instead.
    // Accept (string)response
    // Return null
    //
    getWordResponse();
}

function changedDefinitionVote(response) {
    // Vote of a definition is changed, we reset the definition view
    // Accept (string)response
    // Return null
    // Note: POST function returns a response so we must accept it and discard it
    // var element = document.getElementById("definitionList");
    incrementer = 0;
    resetDefButtons();
    gotDefinitionResponse(-1);
}

function gotMyID(id) {
    // When an ID is recieved from the POST
    // Accept (string)id
    // Return null
    //
    if (id == "None") {
        // If not logged in we redirect to signup page
        window.location.href = '../signup/';
    } else {
        // If not we check if the link contain a word or no
        myID = Number(id);
        try {
            var text = userlink.split(mylink)[1];
            // If the link contains a word token, then we must use that word
            // Else we get a random word
            if (text.replace("?word=", "") != "") {
                wordParam = text.replace("?word=", "");
                sendXML('getWord', wordParam, gotRandomWord);
            } else {
                getRandomWord();
            }
        } catch {}
        
    }
}

const onClick = (event) => {
    // Checks for a click in like, unlike or flag buttons of the websites
    if (event.target.id.includes("-1")) {
        jsonString = JSON.stringify([myWordID, myID, event.target.id.replace("word__btn+-1+", "")]);
        sendXML('changeActivityWord', jsonString, changedWordVote);
    } else {
        pieces = event.target.id.split("+");
        jsonString = JSON.stringify([definitionList[Number(pieces[1])][0], myID, Number(pieces[2])]);
        sendXML('changeActivityDefinition', jsonString, changedDefinitionVote);
    }
}

function resetButtons(buttonID) {
    // Resets the buttons so that they're not clicked
    // Accept (string)buttonID
    // Return null
    //
    for (i = 0; i < 3; i++) {
        element = document.getElementById("word__svg+" + buttonID + "+" + i);
        element.src = element.src.replace("_c", "_b");
    }
}

function resetDefButtons() {
    // Resets all the def buttons
    // Accepts none
    // Returns null
    //
    for (x = 0; x < definitionList.length; x++) {
        resetButtons(x);
    }
}

function searchWord() {
    // Searchs a word entered in the search text box
    // Accept none
    // Return null
    //
    sendXML('getWord', document.getElementById('searchText').value, gotRandomWord);
}

function showOverlay(innerHTML, buttonFunction=hideOverlay) {
    // Shows the overlay
    // Accepts the (string)innterHTML to show on the overlay, (function)buttonFunction to call if
    // a button is clicked (default=hideOverlay)
    // Return null
    //
    document.getElementById("overlay__form").innerHTML = innerHTML;
    document.getElementById("overlay").style.display = "block";
    document.getElementById('overlay__close').addEventListener("click", buttonFunction);
}

function hideOverlay() {
    // Hides the overlay
    // Accepts none
    // Return null
    //
    document.getElementById("overlay").style.display = "none";
}

function addNewWord() {
    // Adds a new word to the database from word in the textbox
    // Accepts none
    // Return null
    //
    sendXML('addWord', JSON.stringify([document.getElementById('searchText').value, myID]), newWordAdded);
}

function newWordAdded(response) {
    // When a new word is added. Show the overlay with information
    // Accepts (string)response
    // Returns null
    //
    headingText = 'Warning';
    imageLocation = errorImage;
    if (response.includes("<done>")) {
        text = "The word was added successfully.";
        searchWord();
        headingText = 'Complete';
        imageLocation = successImage;
    } else if (response.includes("<empty>")) {
        text = "The text is empty or only contain invalid characters.";
    } else {
        text = "This word exist in our database. Click on Search to get this word.";
    }
    
    innerHTML = htmlHeading.replace('#heading', headingText) + htmlImage.replace('#location', imageLocation) + htmlPara.replace('#text', text) + htmlButton;
    showOverlay(innerHTML);
}

function addTheBlock(text) {
    // Adds a new block to the database
    // Accepts (string)definition
    // Return null
    //
    try {
        inputText = JSON.stringify([document.getElementById('newBlock1').value, document.getElementById('newBlock2').value]);
        sendXML('addDefinition', JSON.stringify([myWordID, myID, inputText]), addedNewBlock);
    } catch (error) {}
    hideOverlay();
}

function addedNewBlock(response) {
    // When a new block is added and show the message
    // Accepts the (string)response
    // Return null
    //
    // console.log(response);
    headingText = 'Warning';
    imageLocation = errorImage;
    if (response.includes("<done>")) {
        text = "The definition block was added successfully.";
        searchWord();
        headingText = 'Complete';
        imageLocation = successImage;
    } else if (response.includes("<empty>")) {
        text = "The text is empty or only contain invalid characters.";
    } else {
        text = "This block exist in our database.";
    }
    
    innerHTML = htmlHeading.replace('#heading', headingText) + htmlImage.replace('#location', imageLocation) + htmlPara.replace('#text', text) + htmlButton;
    showOverlay(innerHTML);
    getWordResponse();
}

function addNewBlock() {
    // Add a new block to the HTML
    // Accepts null
    // Return null
    //
    innerHTML = htmlHeading.replace('#heading', 'New Block') + htmlPara.replace('#text', 'Please enter a new translation below') + htmlInput.replace("#id", "newBlock1").replace("#placeholder", 'Category of the definition (n, v, adj, adv) for ' + myWord) + '<br>' + htmlInput.replace("#id", "newBlock2").replace("#placeholder", 'New definition for ' + myWord) + '<br>' + htmlButton;
    showOverlay(innerHTML,addTheBlock);
}

function updateProgressBar(value) {
    value = Math.round(value);
    document.getElementById('myProgress').querySelector(".progress__fill").style.width = `${value}%`;
}

// End of functions. Start of code
/////////////////////////////////////////////////////////////////////////////////

// Sends a POST to get the ID of the user
sendXML('getId', '0', gotMyID, "../home/home.php");

// Adds a listener to update achievements
if (!!window.EventSource) {
    var source = new EventSource('../achievement.php');
} else {
    console.log("Error");
}

source.addEventListener('message', function(e) {
    returnData = JSON.parse(e.data);
    if (returnData[0] == 'stats') {
        myStats = [returnData[1], returnData[2], returnData[3]];
        progress = myStats[1] - myStats[0];
        max = myStats[2] - myStats[0];
        if (max == 0) {
            updateProgressBar(100);
        } else {
            updateProgressBar(progress / max * 100);
        }
        document.getElementById('progressText').innerHTML = myStats[1] + "XP";
    }
    if (returnData[0] == 'achievement') {
        achievementUnlock(returnData[1]);
        
    }
    if (returnData[0] == 'debug') {
        console.log(returnData[1]);
        
    }
    
}, false);

function achievementUnlock(achievement) {
    showOverlay(htmlHeading.replace('#heading', 'New Achievement') + htmlImage.replace('#location', '../assets/images/badges/#badge.png').replace('#badge', achievement[1]) + htmlPara.replace('#text', achievement[2]) + htmlButton);
}