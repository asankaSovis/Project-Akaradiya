<?php

    // <!-- This php will handle all the functions related to login
    // a user sent by the /signup/main.js file. -->

    // <!-- ERROR CODES-------------
    // <verified> - The user is verified and credentials are correct. Can log in
    // <notverified> - The user is not verified. Have to show the resend verification link
    // <error> - Any other error(Including wrong credentials. This is to protect user data)
    // ------------------------ -->

    session_start();

    $error = "None";
    $params = $_POST['task'];

    if($params == 'getSession') {
        if (isset($_SESSION['username'])) {
            $error = $_SESSION['username'];
        }
    } elseif ($params == 'abortSession') {
        $error = session_destroy();
    }
    // Closing the connection and dumping the error to POST
    var_dump($error);
?>