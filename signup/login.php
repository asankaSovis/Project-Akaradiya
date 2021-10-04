<?php
    $Servername='localhost';
    $username='root';
    $password='Asanka123';
    $dbname = "project_akaradiya";
    $error = "None";

    $conn=mysqli_connect($servername,$username,$password,"$dbname");
    if(!$conn) {
        $error = 'Could not Connect MySql Server:' .mysql_error();
    }

    $email = $_POST['email'];
    $pword = $_POST['password'];

    $result = checkEmail($email, $pword, $conn);

    $value = mysqli_fetch_row($result)[0];

    if (mysqli_num_rows($result) == 0) {
        $error = "Invalid Credentials";
    } elseif ($value == '1') {
        $error = "This email is verified.";
    } else {
        $error = "This email is not verified.";
    }

    mysqli_close($conn);
    var_dump($error);

    function checkEmail($email, $pword, $conn) {
        $sql = "SELECT Verified FROM users WHERE Email='$email' AND PassWord='$pword'";
        return mysqli_query($conn, $sql);
    }
?>