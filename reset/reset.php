<!-- This php will handle all the functions related to resetting the password of
a user sent by the /reset/main.js file. -->

<!-- ERROR CODES-------------
// int(1) - The user exist and the user can be allowed to enter a new password
// <success> - The credentials are accepted by MySQL and Password is reset
// <failed> - Any other error
------------------------ -->

<?php
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

    // Reading the POST data JS sent with 'auth' token
    // Note: Two functions are handled in this PHP, verifying the authentication details
    // and resetting the password. Which function to perform is decided by the first
    // parameter passed. If it is 'verify' then verification is performed, else if it
    // is 'reset', password is reset
    //
    if (isset($_POST['verify'])) {
        $email = $_POST['email'];
        $pword = $_POST['password'];
        $error = checkEmail($email, $pword, $conn);
    } else if (isset($_POST['reset'])) {
        // IMPORTANT-----------
        // A security issue can occur if POST request is sent with 'reset'
        // parameters without verification, so add another parameter for old password here
        // as well and verify again before resetting
        // ****MAKE SURE TO RECHECK THE OLD PASSWORD HASH****
        // --------------------
        $email = $_POST['email'];
        $pword = $_POST['password'];
        $error = resetPword($email, encrypt($pword), $conn);
    }

    // Closing the connection and dumping the error to POST
    mysqli_close($conn);
    var_dump($error);

    // End of code. Start of function definitions.
    /////////////////////////////////////////////////////////////////////////

    function checkEmail($email, $pword, $conn) {
        // Checks if the user exist and password hash is matching
        // Accepts the email as (string)email, password as (string)pword and connection as (SQL Connection)conn
        // Returns the number of rows in the data returned by SQL query as int
        // Note: The number of rows can be compared to 0 and decide if the user exist and password hash matches
        // Note2: Returned rows contain whether the user is verified, so it can be used to check if user is
        // verified as well
        //
        $sql = "SELECT Verified FROM users WHERE Email='$email' AND PassWord='$pword'"; // SQL Query to decide if
        return mysqli_num_rows(mysqli_query($conn, $sql));
    }

    function resetPword($email, $pword, $conn) {
        // Resets the password of the user with new password
        // Accepts the email as (string)email, password as (string)pword and connection as (SQL Connection)conn
        // Returns the error as string
        //
        $sql = "UPDATE users SET PassWord='$pword' WHERE Email='$email'"; // SQL Query to reset

        if(mysqli_query($conn, $sql)) {
            $error = "<success>";
        } else {
            $error = "<failed>";
        }
        return $error;
    }

    function encrypt($password) {
        // The function that encrypts the password of the user.
        // Accepts the password as (string)password
        // Returns the hash as string
        // Note: This is to protect the users privacy. The BCrypt hash algorithm is used
        // for encryption so that anyone viewing the database has no idea about the password
        return password_hash($password, PASSWORD_BCRYPT);
    }
?>