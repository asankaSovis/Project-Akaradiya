definitionXML = '<div class="row_section"><h1 class="def__main">#definition</h1>#buttons</div>';
buttonXML = '<button class="icon__button" id="word__btn#btnID"><img src="../assets/#btnType_b.svg" id="word__svg#btnID" height="20" width="20"></button>';
myWordID = 0;
myWord = "";
var definitionList = [];
myID = 0;

let userlink = window.location.href; //Link we got when user clicked on the link
let mylink = window.location.pathname; //Link where the website actually reside

incrementer = 0;

function sendXML(task, sendData, returnFunc, phpLocation="./voting.php") {
    var data = new FormData();
    data.append('task', task);
    data.append('data', sendData);

    xmlhttp = new XMLHttpRequest();
    // Sending the submitted data to the reset.php file as POST data
    //
    xmlhttp.open("POST",phpLocation, true);
    xmlhttp.onreadystatechange=function(){
        if (xmlhttp.readyState == 4){
            if(xmlhttp.status == 200){
                // When a reply is recieved, call the gotReply function
                // transfering the XML reply (xmlhttp.response) to it
                //console.log(xmlhttp.response);
                returnFunc(xmlhttp.response);
            }
        }
    };
    xmlhttp.send(data);
}

sendXML('getId', '0', gotMyID, "../home/home.php");

document.getElementById('next__word').addEventListener("click", getRandomWord);

document.getElementById('search').addEventListener("click", searchWord);

document.getElementById('add__word').addEventListener("click", addNewWord);

document.getElementById('new__block').addEventListener("click", addNewBlock);

function getRandomWord() {
    sendXML('getWord', '0', gotRandomWord);
}

function getDefinitions() {
    sendXML('getDefinitions', myWordID, gotDefinitions);
}

function getWordResponse() {
    jsonString = JSON.stringify([myWordID, myID]);
    sendXML('getWordResponse', jsonString, gotWordResponse);
}

function gotRandomWord(word) {
    if (word.includes("<empty>")) {
        text = "This word doesn\'t exist in our database. Click on Add Word to add it";
        innerHTML = '<h2 class="para__text">' + text + '</h2><div class="section__center"><button class="form__button" id="overlay__close">Ok</button></div>';
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
    var element = document.getElementById("definitionList");
    var defStrings = JSON.parse(definitions);
    defStrings.forEach(element => {
        definitionList.push(JSON.parse(element));
    });
    
    i = 0;

    definitionList.forEach(item => {
        innerHTML = definitionXML.replace("#definition", i + 1 + ". " + item[1]);
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
    getWordResponse();
}

function changedDefinitionVote(response) {
    // var element = document.getElementById("definitionList");
    incrementer = 0;
    resetDefButtons();
    gotDefinitionResponse(-1);
}

function gotMyID(id) {
    if (id == "None") {
        window.location.href = '../signup/';
    } else {
        myID = Number(id);
        try {
            var text = userlink.split(mylink)[1];
            // If the link contains a word token, then we must use that word
                // If the email token came with some parameters, we set the parameter to textbox and
                // perform a button click
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
    for (i = 0; i < 3; i++) {
        element = document.getElementById("word__svg+" + buttonID + "+" + i);
        element.src = element.src.replace("_c", "_b");
    }
}

function resetDefButtons() {
    for (x = 0; x < definitionList.length; x++) {
        resetButtons(x);
    }
}

function searchWord() {
    sendXML('getWord', document.getElementById('searchText').value, gotRandomWord);
}

function showOverlay(innerHTML, buttonFunction=hideOverlay) {
    document.getElementById("overlay__form").innerHTML = innerHTML;
    document.getElementById("overlay").style.display = "block";
    document.getElementById('overlay__close').addEventListener("click", buttonFunction);
}

function hideOverlay() {
    document.getElementById("overlay").style.display = "none";
}

function addNewWord() {
    sendXML('addWord', JSON.stringify([document.getElementById('searchText').value, myID]), newWordAdded);
}

function newWordAdded(response) {
    if (response.includes("<done>")) {
        text = "The word was added successfully.";
        searchWord();
    } else if (response.includes("<empty>")) {
        text = "The text is empty or only contain invalid characters.";
    } else {
        text = "This word exist in our database. Click on Search to get this word.";
    }
    
    innerHTML = '<h2 class="para__text">' + text + '</h2><div class="section__center"><button class="form__button" id="overlay__close">Ok</button></div>';

    showOverlay(innerHTML);
}

function addTheBlock(text) {
    try {
        inputText = document.getElementById('newBlock').value
        sendXML('addDefinition', JSON.stringify([myWordID, myID, inputText]), addedNewBlock);
    } catch (error) {}
    hideOverlay();
}

function addedNewBlock(response) {
    // console.log(response);
    if (response.includes("<done>")) {
        text = "The definition block was added successfully.";
        searchWord();
    } else if (response.includes("<empty>")) {
        text = "The text is empty or only contain invalid characters.";
    } else {
        text = "This block exist in our database.";
    }
    
    innerHTML = '<h2 class="para__text">' + text + '</h2><div class="section__center"><button class="form__button" id="overlay__close">Ok</button></div>';

    showOverlay(innerHTML);
    getWordResponse();
}

function addNewBlock() {
    
    innerHTML = '<input type="text" class="form__input" id="newBlock" autofocus placeholder="Add a new block to ' + myWord + '" name="newBlock"><hr><div class="section__center"><button class="form__button" id="overlay__close">Ok</button></div>';
    showOverlay(innerHTML,addTheBlock);
}