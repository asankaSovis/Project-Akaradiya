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

    session_start(); // Starts a session

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

    if($params == 'userExist') {
        // Request to get a random word or a specific word
        $error = getUser($conn, $data);
    }
    if($params == 'getUserRank') {
        // Request to get a random word or a specific word
        $error = getUserRank($conn, $data);
    }
    if($params == 'getBadges') {
        // Request to get a random word or a specific word
        $error = getBadges($conn, $data);
    }
    if($params == 'getNextBadge') {
        // Request to get a random word or a specific word
        $error = getNextBadge($conn, $data);
    }
    if($params == 'getleadersRank') {
        // Request to get a random word or a specific word
        $error = getleadersRank($conn, $data);
    }
    if($params == 'getCredentials') {
        // Request to get a random word or a specific word
        $error = getCredentials($conn);
    }
    // Closing the connection and dumping the error to POST
    echo($error);

    function getUser($conn, $userID) {
        // Function to get a random word
        // Accept (connection)conn
        // Return the word as array [id, word]
        //
        $returnUser = "";
        $sql = "SELECT UserID, UserName, Gender, ExperiencePoints, SignupDate, ActiveDate FROM users WHERE UserID='$userID'";
        // User exist
        $result =  mysqli_query($conn, $sql);

        $returnUser = mysqli_fetch_row($result);

        if (mysqli_num_rows($result) == 0) {
            $returnUser = "0";
        } else {
            $returnUser = json_encode($returnUser);
        }

        return $returnUser;
    }

    function getUserRank($conn, $exp) {
        // Function to get a random word
        // Accept (connection)conn
        // Return the word as array [id, word]
        //
        $sql = "SELECT UserID FROM users WHERE ExperiencePoints >= $exp";
        // User exist
        $result =  mysqli_query($conn, $sql);

        return mysqli_num_rows($result);
    }

    function getBadges($conn, $userID) {
        // Function to get a random word
        // Accept (connection)conn
        // Return the word as array [id, word]
        //
        $badgeList = [];
        $sql = "SELECT AchievementID FROM achievement_activity WHERE UserID = $userID";
        // User exist
        $result =  mysqli_query($conn, $sql);
        $count = mysqli_num_rows($result);

        for ($x = 0; $x < $count; $x++) {
            $badgeID = mysqli_fetch_row($result);
            $sql = "SELECT AchievementID, Achievement, Description FROM achievements WHERE AchievementID = $badgeID[0]";
            $resultBadge =  mysqli_query($conn, $sql);
            array_push($badgeList, mysqli_fetch_row($resultBadge));
        }
        return json_encode($badgeList);
    }

    function getNextBadge($conn, $exp) {
        // Function to get a random word
        // Accept (connection)conn
        // Return the word as array [id, word]
        //
        //
        $nextBadge = "";
        $sql = "SELECT AchievementID, Achievement, Description FROM achievements WHERE Type='Level' AND  XPCap > $exp Order By XPCap Asc LIMIT 1";
        // User exist
        $result =  mysqli_query($conn, $sql);

        if (mysqli_num_rows($result) == 0) {
            $nextBadge = "0";
        } else {
            $nextBadge = json_encode(mysqli_fetch_row($result));
        }

        return $nextBadge;
    }

    function getleadersRank($conn, $count) {
        $leaders = [];
        $sql = "SELECT UserName, ExperiencePoints FROM users Order By ExperiencePoints Desc LIMIT $count";
        
        $result =  mysqli_query($conn, $sql);
        $count = mysqli_num_rows($result);
        for ($x = 0; $x < $count; $x++) {
            array_push($leaders, mysqli_fetch_row($result));
        }
        return json_encode($leaders);
    }

    function getCredentials($conn) {
        $returnData = "fail";
        if (isset($_SESSION['id'])) {
            $myID = $_SESSION['id'];
            $sql = "SELECT Email, PassWord FROM users WHERE UserID = $myID";
            $result =  mysqli_query($conn, $sql);
            $returnData = json_encode(mysqli_fetch_row($result));
        }
        return $returnData;
    }

?>