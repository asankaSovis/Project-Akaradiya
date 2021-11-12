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
        $lowerBound = checkAchievement($conn, $XP);
        sendMsg('xpValues', json_encode([$lowerBound, (int)$XP, (int)upperBound($conn, $XP)]));     
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
        return mysqli_fetch_row($result)[0];
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

    function checkAchievement($conn, $XP) {
        // Checks if the user has an achievement
        // Accepts (connection)conn, (int)XP
        // Returns the achievement ID if there is one, else return -1
        //
        $highestAchievement = -1;
        
        $sql = "SELECT AchievementID FROM achievement_activity WHERE UserID=$userID ORDER BY AchievementID DES";
        $result = mysqli_query($conn, $sql);
        if (!(mysqli_num_rows($result) <= 0)) {
            $highestAchievement = mysqli_fetch_row($result)[0];
        }

        $highestAvailable = lastAchievement($conn, $XP, $highestAchievement);
        if (!($highestAchievement != -1)) {
            sendMsg('achievementUnlock', $highestAvailable);
        }
        return lowerBound($conn, $highestAchievement);
    }

    function lastAchievement($conn, $maxXP, $maxAchievement) {
        // Checks the last achievement of a user
        // Accepts the (connection)conn, (int)maxXP, (int)maxAchievement
        // Returns the last achievement as int, -1 if no achievements
        //
        $returnData = -1;
        $sql = "SELECT AchievementID FROM achievements WHERE XPCap<=$maxXP AND AchievementID>$maxAchievement ORDER BY XPCap ASC";
        $result = mysqli_query($conn, $sql);
        if (!(mysqli_num_rows($result) <= 0)) {
            $returnData = mysqli_fetch_row($result)[0];
        }
        return $returnData;
    }

    function upperBound($conn, $XP) {
        // Gets the next achievement user can get
        // Accepts (connection)conn, (int)XP
        // Returns the XP value of next achievement or current XP value
        // user has all achievements unlocked
        //
        $returnData = $XP;
        $sql = "SELECT XPCap FROM achievements WHERE XPCap>=$XP ORDER BY XPCap ASC";
        $result = mysqli_query($conn, $sql);
        if (!(mysqli_num_rows($result) <= 0)) {
            $returnData = mysqli_fetch_row($result)[0];
        }
        return $returnData;
    }

    function lowerBound($conn, $achievementID) {
        // Gets the lower bound of the user
        // Accepts (connection)conn, (int)achievementID
        // Returns the XP of last achievement and 0 if user
        // has not achieved any
        $returnData = 0;
        $sql = "SELECT XPCap FROM achievements WHERE AchievementID=$achievementID";
        $result = mysqli_query($conn, $sql);
        if (!(mysqli_num_rows($result) <= 0)) {
            $returnData = mysqli_fetch_row($result)[0];
        }
        return $returnData;
    }

    function unlockAchievement() {

    }
?>