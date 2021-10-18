<?php

    // <!-- This php will handle all the functions related to authenticating
    // a user sent by the /verification/main.js file. -->

    // <!-- ERROR CODES-------------
    // <success> - Verified successfully
    // <nouser> - User doesn't exist (This is when query for an UNVERIFIED user with this auth details doesn't exist)
    // <error> - Any other error
    // ------------------------ -->

    // loading sensitive data
    require_once '../credential.php';
    
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
    }

    $auth = $_POST['auth']; // Reading the POST data JS sent with 'auth' token
    // Note: This is the authentication token it recieved from URL

    // Sanitization
    $auth = mysqli_real_escape_string($conn, $auth);

    $result = checkVerified($auth, $conn); // Calling check verified function to check validity of our operation
    $value = mysqli_fetch_row($result)[0]; // Extracts the username to send to JS back
    $sql = "UPDATE users SET Verified=1 WHERE PassWord='$auth'"; // Query to verify user
    
    // Error handling
    if (mysqli_num_rows($result) == 0) {
        // No unerified users with this token
        $error = "<nousers>";
    } else if(mysqli_query($conn, $sql)) {
        // Execute the query and verify success
        $error = "<success>$value";
    } else {
        // An error happened
        $error = "<failed>";
    }

    // Closing the connection and dumping the error to POST
    mysqli_close($conn);
    var_dump($error);

    // End of code. Start of function definitions.
    /////////////////////////////////////////////////////////////////////////

    function checkVerified($auth, $conn) {
        // Checks if the user exist and is not verified yet
        // Accepts the authentication token recieved as (string)auth and connection as (SQL Connection)conn
        // Returns the data returned by SQL query as SQL data
        // Note: The number of rows can be compared to 0 and decide if the user exist/not verified
        // Note2: Returned rows contain the username of the user, so it can be used to create the custom
        // message for the user if successful
        //
        $sql = "SELECT UserName FROM users WHERE Verified='0' AND PassWord='$auth'"; // SQL Query to decide if
        // user exist/verified
        return mysqli_query($conn, $sql);
    }
?>