<!-- This php will handle all the functions related to Editing
a user sent by the /edit/main.js file. -->

<!-- ERROR CODES-------------
int(1) - The user exist and the user can be allowed to enter a new password
<success> - The credentials are accepted by MySQL and Password is reset
<failed> - Any other error
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

    // Reading the POST data JS sent
    // Note: Two functions are handled in this PHP, verifying the email and password
    // and editing the user details. Which function to perform is decided by the first
    // parameter passed. If it is 'verify' then the user is verified first, else if it
    // is 'edit', the user information is edited
    //
    if (isset($_POST['verify'])) {
        // If JS is asking to verify the user, then we're extracting the provided info
        // to pass on to the checkEmail function
        $email = $_POST['email'];
        $pword = $_POST['password'];
        $error = checkEmail($email, $pword, $conn);
    } else if (isset($_POST['edit'])) {
        // If JS wants to edit the users information, we're extracting the information to
        // edit the information using editInfo function
        // Note: For security purposes, we're also accepting the password to reverify
        //
        $email = $_POST['email'];
        $pword = $_POST['password'];
        $username = $_POST['username'];
        $gender = $_POST['gender'];
        $error = editInfo($email, $pword, $gender, $username, $conn);
    }

    // Dumping the error to POST and closing the connection
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

    function editInfo($email, $pword, $gender, $username, $conn) {
        // Edits the information of the user
        // Accepts the email as (string)email, password as (string)pword, gender as (string)gender,
        // username as (string)username and connection as (SQL Connection)conn
        // Returns the error as string
        //
        $sql = "UPDATE users SET UserName='$username', Gender='$gender' WHERE Email='$email' AND PassWord='$pword'";
        // ^^^^SQL Query to edit
        
        if(mysqli_query($conn, $sql)) {
            $error = "<success>";
        } else {
            $error = "<failed>";
        }
        return $error;
    }
?>