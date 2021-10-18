<?php

    // <!-- This php will handle all the functions related to emailing
    // a user sent by the /mail/main.js file. -->

    // <!-- ERROR CODES-------------
    // <success> - Email was sent successfully (Both verify and reset)
    // <authed> - The email is already verified (Only for verify)
    // <notauthed> - The email is not verified yet and has to be verified before resetting the password (Only for reser)
    // <nousers> - The email does not exist in the database (Both verify and reset)
    // <error> - An error occured (Both verify and reset)
    // ------------------------

    // Note: Note that this file requires the mail.html file to be present in this folder.
    // This file contains the structure of email that has to be sent to the user.
    // Make sure to edit that file if you need to modify the email that the user recieves.

    // Note2: This file also require the Swiftmailer library to be installed in this folder.
    // If it doesn't exist, refer to this video:
    //         https://www.youtube.com/watch?v=7WANMTdxBws
    // For this to work, you also need the Composer package manager to be installed in the computer
    // Refer to this if needed:
    //         https://www.youtube.com/watch?v=-6fv7F1s1ro
            
    // -->

    // Calling the swiftmailer libraries and loading sensitive data
    require_once './vendor/autoload.php';
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
    // Note: Two functions are handled in this PHP, sending verification email
    // and sending reset password email. Which function to perform is decided by the first
    // parameter passed. If it is 'email' then verification email is sent, else if it
    // is 'pword', password reset link is sent, otherwise an error is returned
    //
    if(isset($_POST['email']) || isset($_POST['pword'])) {
        // Checking if valid parameters are recieved

        //Extracting the email
        $email = "";
        if (isset($_POST['email'])) {
            $email = $_POST['email'];
        } else {
            $email = $_POST['pword'];
        }

        // Sanitization
        $email = mysqli_real_escape_string($conn, $email);

        // Verifying the email first by passing the email to checkVerified function
        $result = checkVerified($email, $conn); //Stores the data retrieved from the query
        // Note: This contains the verify state of email if the email exist, and NULL if
        // this email doesn't exist
        $value = mysqli_fetch_row($result); // When this is called, the number of
        // rows returned is stored in the value variable. It will be a number (Verified or not)
        // if the email exist and NULL if no email exist
        
        if ($value == null) {
            // If value returned null, that means no user with this email exist in the database
            // else if a value exist, then the email is valid and a user exist
            $error = "<nousers>";
        } else if ($value[0] == '1') {
            // 1 means the user is already verified
            if (isset($_POST['email'])) {
                // Here we check if the request was for a verification. If so, there is no need to
                // continue because as stated above, 1 means already verified. So the authed error is returned.
                $error = "<authed>";
            } else {
                // Else if the request was for a password reset, already verified means we can continue with the
                // sending of reset email process. So email is sent to reset the password
                $heading = "Reset Your Akaradiya Account Password";
                $mydirect = HOMEDIRECTORY;
                $authLink = "$mydirect/reset?pword=$value[1]?email=$email";
                $text = readTemplate($value[2], $authLink);
                $error = sendEmail($email, $heading, $text);
            } 
        } else if ($value[0] == '0') {
            // 0 means the user is not yet verified
            if (isset($_POST['pword']))
            {
                // Here we check if the request was for a password reset. If so, we cannot procees as the
                // password can't be reset before verifying the email. So a notauthed error is sent
                $error = "<notauthed>";
            } else {
                // Else if the request was for a verification, then we must continue as the purpose IS to
                // request a verification email. So email is sent to verify the email
                $heading = "Verify Your Akaradiya Account";
                $mydirect = HOMEDIRECTORY;
                $authLink = "$mydirect/verification?auth=$value[1]";
                $text = readTemplate($value[2], $authLink);
                $error = $text;
                $error = sendEmail($email, $heading, $text);
            }
        } else {
            // On error
            $error = "<error>";
        }
    } else {
        // On error
        $error = "<error>";
    }

    // Dumping the error to POST and closing the connection
    mysqli_close($conn);
    var_dump($error);

    // End of code. Start of function definitions.
    /////////////////////////////////////////////////////////////////////////

    function sendEmail($email, $heading, $text) {
        // Sending the email to the user
        // Accepts the email as (string)email, subject of the email as (string)heading and body as (string)text
        // Returns the error as string
        // Note: This is done using the Swiftmailer and using the email account we created
        //
        // Create the Swift mailer Transport
        $transport = (new Swift_SmtpTransport('smtp.gmail.com', 587, 'tls'))
        ->setUsername(EMAIL)
        ->setPassword(PASSWORD)
        ;

        //Create the Mailer using the created Transport
        $mailer = new Swift_Mailer($transport);

        // Creating the message
        $message = (new Swift_Message($heading))
            ->setFrom([EMAIL => 'Akaradiya Open Dictionary'])
            ->setTo([$email])
            ->setBody($text)
            ->setContentType("text/html");
        ;

        // Sending the mail
        if($result = $mailer -> send($message)) {
            $error = "<success>";
        } else {
            $error = "<error>";
        }
        // Returning the error
        return $error;
    }

    function checkVerified($email, $conn) {
        // Checks if the email is already verified
        // Accepts the email as (string)email, and connection as (SQL Connection)conn
        // Returns the data returned by SQL query as int
        // Note: The number of rows can be compared to 0 and decide if the user exist
        // Note2: Returned rows contain whether the user is verified, so it can be used to check if user is
        // verified as well
        //
        $sql = "SELECT Verified, PassWord, UserName FROM users WHERE Email='$email'"; // SQL Query to decide if
        return mysqli_query($conn, $sql);
    }

    function readTemplate($name, $link) {
        // The template of the email sent is stored in the mail.html file.
        // This is read and the appropriate parameters are replaced to create the email to be sent
        // Accepts the name of the user as (string)name and link to be emailed as (string)link
        // returns the email to be sent as string
        //
        $myfile = fopen("mail.html", "r") or die("Unable to open file!");
        $str = "";
        while(!feof($myfile)) {
            $read = fgets($myfile);
            $str = "$str$read";
          }
        fclose($myfile);
        $str = str_replace("#user", $name, $str);
        $str = str_replace("#link", $link, $str);
        return $str;
    }
?>