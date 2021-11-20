<?php
    // <!-- This php will handle all the functions related to updating the achievement data of
    // a user sent by any JS file. -->

    // loading sensitive data
    require_once './credential.php';
        
    session_start();

    // Global variables
    $servername = SERVERNAME;
    $username = USERNAME_SQL;
    $password = PASSWORD_SQL;
    $dbname = DBNAME;
    $error = "None";

    header('Content-Type: text/event-stream');
    header('Cache-Control: no-cache'); // recommended to prevent caching of event data.
    
    // Creating a connection to the database
    $conn=mysqli_connect($servername,$username,$password,"$dbname");
    if(!$conn) {
        $error = 'Could not Connect MySql Server:' .mysql_error();
        var_dump($error);
    }

    /**
     * Constructs the SSE data format and flushes that data to the client.
     *
     * @param string $id Timestamp/id of this connection.
     * @param string $msg Line of text that should be transmitted.
     */
    
     // Checks if a user is logged in first. Otherwise stop IMMEDIATELY
    if (isset($_SESSION['id'])) {
        $userID = $_SESSION['id'];
        $XP = getXP($conn, $userID);
        checkAchievement($conn, $userID, $XP);
        
    } else {
        exit();
    }

    // End of code. Start of function definitions.
    /////////////////////////////////////////////////////////////////////////

    function getXP($conn, $userID) {
        // Gets the XP value of a given user.
        // Accepts (connection)conn, (int)userID
        // Return the value of XP in string
        //
        $sql = "SELECT ExperiencePoints FROM users WHERE UserID=$userID";
        $result = mysqli_query($conn, $sql);
        return (int)mysqli_fetch_row($result)[0];
    }

    function sendMsg($id, $msg) {
        // Sends a message to the JS periodically with the data
        // Accept (string)id, (string)msg
        // Return null
        //
        echo "id: $id" . PHP_EOL;
        echo "data: $msg" . PHP_EOL;
        echo PHP_EOL;
        ob_flush();
        flush();
    }

    function checkAchievement($conn, $userID, $XP) {
        // Checks if the user has an achievement
        // Accepts (connection)conn, (int)XP
        // Returns the achievement ID if there is one, else return -1
        //
        $lower = lastAchievement($conn, $userID);
        $higher = nextAchievement($conn, $lower[0]);
        checkForAchievement($conn, $userID, $lower, $XP, $higher);
        sendMsg('message', json_encode(['stats', $lower[1], $XP, $higher[1]]));

        return 0;
    }

    function lastAchievement($conn, $userID) {
        // Checks the last achievement of a user
        // Accepts the (connection)conn, (int)maxXP, (int)maxAchievement
        // Returns the last achievement as int, -1 if no achievements
        //
        $returnData = [-1, 0];
        $sql = "SELECT AchievementID FROM achievement_activity WHERE UserID = $userID AND Type = 'Level' ORDER BY AchievementID Desc";
        $result = mysqli_query($conn, $sql);
        if (mysqli_num_rows($result) > 0) {
            $returnData = mysqli_fetch_row($result)[0];
            $sql = "SELECT XPCap FROM achievements WHERE AchievementID = $returnData";
            $result = mysqli_query($conn, $sql);
            $returnData = [(int)$returnData, (int)mysqli_fetch_row($result)[0]];
        }
        return $returnData;
    }

    function nextAchievement($conn, $lastAchievement) {
        $returnData = [-1, 0];
        $sql = "SELECT AchievementID, XPCap FROM achievements WHERE AchievementID > $lastAchievement AND Type = 'Level' ORDER BY XPCap Asc";
        $result = mysqli_query($conn, $sql);
        if (mysqli_num_rows($result) > 0) {
            $returnData = mysqli_fetch_row($result);
        } else {
            $sql = "SELECT AchievementID, XPCap FROM achievements WHERE Type = 'Level' ORDER BY XPCap Desc LIMIT 1";
            $result = mysqli_query($conn, $sql);
            $returnData = mysqli_fetch_row($result);
        }

        return [(int)$returnData[0], (int)$returnData[1]];
    }

    function checkForAchievement($conn, $user, $lower, $XP, $higher) {
        if (($XP > $higher[1]) && ($lower[1] < $higher[1])) {
            newAchievement($conn, $user, $higher[0]);
        }
        $sql = "SELECT AchievementID FROM achievement_activity WHERE UserID=$user AND AchievementID=1";
        $result = mysqli_query($conn, $sql);
        //sendMsg('message', json_encode(['debug', mysqli_num_rows($result)]));  
        if (mysqli_num_rows($result) == 0) {
            $sql = "SELECT Verified FROM users WHERE UserID = $user";
            $result = mysqli_query($conn, $sql);
            $returnData = mysqli_fetch_row($result);
            if ($returnData.include('1')) {
                newAchievement($conn, $user, '1', 'Milestone');
            }
            
        }
        
    }

    function newAchievement($conn, $user, $higher, $type='Level') {
        $sql = "INSERT INTO achievement_activity (UserID, AchievementID, Type)
        VALUES ('$user','$higher','$type')"; // SQL query
        mysqli_query($conn, $sql);

        $sql = "SELECT AchievementID, Achievement, Description FROM achievements WHERE AchievementID=$higher";
        $resultBadge =  mysqli_query($conn, $sql);
        sendMsg('message', json_encode(['achievement', mysqli_fetch_row($resultBadge)]));   
    }
?>