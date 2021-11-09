<?php

    // <!-- This php will handle all the functions related to login
    // a user sent by the /signup/main.js file. -->

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

    $params = $_POST['task'];
    $data = $_POST['data'];

    if (isset($_SESSION['username'])) {
        if($params == 'getWord') {
            if ($data == '0') {
                $error = json_encode(getRandomWord($conn));
            } else {
                $error = json_encode(getWord($conn, $data));
            }
            
        }
        if($params == 'getDefinitions') {
            $error = json_encode(getDefinitions($conn, $data));
        }
        if($params == 'getWordResponse') {
            $data = json_decode($data);
            $error = getWordResponse($conn, $data[0], $data[1]);
        }
        if($params == 'getDefinitionResponse') {
            $data = json_decode($data);
            $error = getDefinitionResponse($conn, $data[0], $data[1]);
        }
        if($params == 'changeActivityWord') {
            $data = json_decode($data);
            $error = changeActivityWord($conn, $data[0], $data[1], $data[2]);
        }
        if($params == 'changeActivityDefinition') {
            $data = json_decode($data);
            $error = changeActivityDefinition($conn, $data[0], $data[1], $data[2]);
        }
        if($params == 'addWord') {
            $data = json_decode($data);
            $error = addWord($conn, $data[0], $data[1]);
        }
        if($params == 'addDefinition') {
            $data = json_decode($data);
            $error = addDefinition($conn, $data[0], $data[2], $data[1]);
        }
    } else {
        $error = "Not logged in";
    }

    // Closing the connection and dumping the error to POST
    echo($error);

    function getRandomWord($conn) {
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
        $sql = "DELETE FROM word_activity WHERE  WordID=$wordID AND UserID=$userID";
    
        $result =  mysqli_query($conn, $sql);

        if (($vote >= 0) && ($vote <= 2)) {
            $sql = "INSERT INTO word_activity (WordID, UserID, Parameter)
            VALUES ('$wordID','$userID','$vote')";

            $result =  mysqli_query($conn, $sql);
        }

        return($result);
    }

    function getDefinitionResponse($conn, $defID, $userID) {
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
        $sql = "DELETE FROM definition_activity WHERE  DefinitionID=$defID AND UserID=$userID";
    
        $result =  mysqli_query($conn, $sql);

        if (($vote >= 0) && ($vote <= 2)) {
            $sql = "INSERT INTO definition_activity (DefinitionID, UserID, Parameter)
            VALUES ('$defID','$userID','$vote')";

            $result =  mysqli_query($conn, $sql);
        }

        return($result);
    }

    function clean($string) {
        return preg_replace('/[^A-Za-z0-9]/', '', $string); // Removes special chars.
     }
?>