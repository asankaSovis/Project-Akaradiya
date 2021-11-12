<?php

    // <!-- This php will handle all the functions related to Voting
    // sent by the /voting/main.js file. -->

    // <!-- ERROR CODES-------------
    // <verified> - The user is verified and credentials are correct. Can log in
    // <notverified> - The user is not verified. Have to show the resend verification link
    // <error> - Any other error(Including wrong credentials. This is to protect user data)
    // ------------------------ -->

    // loading sensitive data
    require_once '../credential.php';
    
    session_start();

    // Global variables
    $servername = SERVERNAME;
    $username = USERNAME_SQL;
    $password = PASSWORD_SQL;
    $dbname = DBNAME;
    $error = "None";

    // Creating a connection to the database
    $conn=mysqli_connect($servername,$username,$password,"$dbname");
    if(!$conn) {
        $error = 'Could not Connect MySql Server:' .mysql_error();
        var_dump($error);
    }

    $params = $_POST['task']; // Accepts the task requested
    $data = $_POST['data']; // Accepts the data sent

    // Check if the user is logged in. Exits IMMEDIATELY if not
    if (isset($_SESSION['username'])) {
        if($params == 'getWord') {
            // Request to get a random word or a specific word
            if ($data == '0') {
                $error = json_encode(getRandomWord($conn));
            } else {
                $error = json_encode(getWord($conn, $data));
            }
        }
        if($params == 'getDefinitions') {
            // Request to get the definitions
            $error = json_encode(getDefinitions($conn, $data));
        }
        if($params == 'getWordResponse') {
            // Request to get the response of a word
            $data = json_decode($data);
            $error = getWordResponse($conn, $data[0], $data[1]);
        }
        if($params == 'getDefinitionResponse') {
            // Request to get response of a definition
            $data = json_decode($data);
            $error = getDefinitionResponse($conn, $data[0], $data[1]);
        }
        if($params == 'changeActivityWord') {
            // Request to change the activity of a word
            $data = json_decode($data);
            $error = changeActivityWord($conn, $data[0], $data[1], $data[2]);
        }
        if($params == 'changeActivityDefinition') {
            // Request to change the activity of a definition
            $data = json_decode($data);
            $error = changeActivityDefinition($conn, $data[0], $data[1], $data[2]);
        }
        if($params == 'addWord') {
            // Request to add a new word
            $data = json_decode($data);
            $error = addWord($conn, $data[0], $data[1]);
        }
        if($params == 'addDefinition') {
            // Request to add a definition
            $data = json_decode($data);
            $error = addDefinition($conn, $data[0], $data[2], $data[1]);
        }
    } else {
        $error = "Not logged in";
    }
    // Closing the connection and dumping the error to POST
    echo($error);

    function getRandomWord($conn) {
        // Function to get a random word
        // Accept (connection)conn
        // Return the word as array [id, word]
        //
        $returnWord = "";
        $sql = "SELECT WordID, Word FROM words";
        // User exist
        $result =  mysqli_query($conn, $sql);

        $count = mysqli_num_rows($result);

        $randGet = rand(0, $count - 1);

        for ($x = 0; $x <= $randGet; $x++) {
            $returnWord = mysqli_fetch_row($result);
        }
        return array($returnWord[0], $returnWord[1]);
    }

    function addWord($conn, $word, $userID) {
        // Function to add a word
        // Accept (connection)conn, (int)word, (int)userID
        // Return success or fail
        // <empty> - no word exist after removing unwanted characters
        // <done> - success
        // <exist> - word already exist
        //
        $returnValue = "";
        $word = clean(strtolower($word));
        if ($word == "") {
            $returnValue = "<empty>";
        } else if (getWord($conn, $word) == "<empty>") {
            $sql = "INSERT INTO words (UserID, Word)
            VALUES ('$userID','$word')";

            $returnValue =  mysqli_query($conn, $sql);
            $returnValue = "<done>";
        } else {
            $returnValue = "<exist>";
        }
        return $returnValue;
    }

    function addDefinition($conn, $wordID, $definition, $userID) {
        // Adds a definition to the database
        // Accept (connection)conn, (int)wordID, (string)definition, (int)userID
        // Return success or fail
        // <empty> - no word exist after removing unwanted characters
        // <done> - success
        // <exist> - word already exist
        //
        $returnValue = "";
        if ($definition == "") {
            $returnValue = "<empty>";
        } else if (getDefinition($conn, $wordID, $definition) == "<empty>") {
            $sql = "INSERT INTO definitions (WordID, UserID, Definition)
            VALUES ($wordID, $userID,'$definition')";

            $returnValue =  mysqli_query($conn, $sql);
            $returnValue = "<done>";
        } else {
            $returnValue = "<exist>";
        }
        return $returnValue;
    }

    function getWord($conn, $word) {
        // Gets a word requested
        // Accept (connection)conn, (string)word
        // Return the word as array [id, word]
        //
        $returnValue = "";
        $word = clean(strtolower($word));
        $sql = "SELECT WordID, Word FROM words WHERE Word='$word'";
        $result =  mysqli_query($conn, $sql);
        if (mysqli_num_rows($result) > 0) {
            $returnWord = mysqli_fetch_row($result);
            $returnValue = array($returnWord[0], $returnWord[1]);
        } else {
            $returnValue = "<empty>";
        }
        return $returnValue;
    }

    function getDefinition($conn, $wordID, $definition) {
        // Gets a definition requested according to a wordID
        // Accept (connection)conn, (int)wordID, (string) definition
        // Return the word as array [id, word]
        //
        $returnValue = "";
        $sql = "SELECT DefinitionID, Definition FROM definitions WHERE WordID='$wordID' AND Definition='$definition'";
        $result =  mysqli_query($conn, $sql);
        if (mysqli_num_rows($result) > 0) {
            $returnWord = mysqli_fetch_row($result);
            $returnValue = array($returnWord[0], $returnWord[1]);
        } else {
            $returnValue = "<empty>";
        }
        return $returnValue;
    }

    function getDefinitions($conn, $wordID) {
        // Gets the list of IDs of the definitions related to the wordID
        // Accept (connection)conn, (int)wordID
        // Return IDs of definitions as array
        //
        $returnDefs = array();
        $sql = "SELECT DefinitionID, Definition FROM definitions WHERE WordID=$wordID";
        // User exist
        $result =  mysqli_query($conn, $sql);

        $count = mysqli_num_rows($result);

        for ($x = 0; $x < $count; $x++) {
            $def = mysqli_fetch_row($result);
            array_push($returnDefs, json_encode(array($def[0], $def[1])));
        }

        return ($returnDefs);
    }

    function getWordResponse($conn, $wordID, $userID) {
        // Gets the activity of the word by user
        // Accept (connection)conn, (int)wordID, (int)userID
        // Returns the (int)parameter
        //
        $returnParam = "";
        $sql = "SELECT Parameter FROM word_activity WHERE WordID=$wordID AND UserID=$userID";
        // User exist
        $result =  mysqli_query($conn, $sql);

        $count = mysqli_num_rows($result);

        if ($count == 0) {
            $returnParam = -1;
        } else {
            $returnParam = mysqli_fetch_row($result)[0];
        }

        return ($returnParam);
    }

    function changeActivityWord($conn, $wordID, $userID, $vote) {
        // Change the activity of a word
        // Accept the (connection)conn, (int)wordID, (int)userID, (int)vote
        // Return the (Query data)
        //
        $sql = "DELETE FROM word_activity WHERE  WordID=$wordID AND UserID=$userID";
    
        $result =  mysqli_query($conn, $sql);

        if (($vote >= 0) && ($vote <= 2)) {
            $sql = "INSERT INTO word_activity (WordID, UserID, Parameter)
            VALUES ('$wordID','$userID','$vote')";

            $result =  mysqli_query($conn, $sql);
            updateXP($conn, $userID, 1);
        }

        return($result);
    }

    function getDefinitionResponse($conn, $defID, $userID) {
        // Get the activity of a definition
        // Accept the (connection)conn, (int)defID, (int)userID
        // Return the (Query data)
        //
        $returnParam = "";
        $sql = "SELECT Parameter FROM definition_activity WHERE DefinitionID=$defID AND UserID=$userID";
        // User exist
        $result =  mysqli_query($conn, $sql);

        $count = mysqli_num_rows($result);

        if ($count == 0) {
            $returnParam = -1;
        } else {
            $returnParam = mysqli_fetch_row($result)[0];
        }

        return ($returnParam);
    }

    function changeActivityDefinition($conn, $defID, $userID, $vote) {
        // Change the activity of a definition
        // Accept the (connection)conn, (int)defID, (int)userID, (int)vote
        // Return the (Query data)
        //
        $sql = "SELECT * FROM definition_activity WHERE  DefinitionID=$defID AND UserID=$userID";
        $result =  mysqli_query($conn, $sql);
        $amount = mysqli_num_rows($result);

        $sql = "DELETE FROM definition_activity WHERE  DefinitionID=$defID AND UserID=$userID";
        
        $result =  mysqli_query($conn, $sql);
        $amount = 1 * (!(boolean)$amount);

        if (($vote >= 0) && ($vote <= 2)) {
            $sql = "INSERT INTO definition_activity (DefinitionID, UserID, Parameter)
            VALUES ('$defID','$userID','$vote')";
            updateXP($conn, $userID, $amount);

            $result =  mysqli_query($conn, $sql);

        }

        return($result);
    }

    function clean($word) {
        // Cleans up the word sent by JS
        // Accept (string)word
        // Return (string)clean word
        //
        return preg_replace('/[^A-Za-z0-9]/', '', $word); // Removes special chars.
     }

    function updateXP($conn, $id, $amount) {
        // Update the XP level for each work done
        // Accept (connection)conn, (int)id, (int)amount
        // Return null
        //
        $sql = "UPDATE users SET ExperiencePoints = ExperiencePoints + $amount WHERE UserID=$id";
        mysqli_query($conn, $sql);
    }
?>