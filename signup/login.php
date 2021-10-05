<?php
    $servername='localhost';
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

    $value = mysqli_fetch_row($result);

    if (mysqli_num_rows($result) == 0) {
        $error = "Invalid Credentials";
    } elseif ($value[0] == '1') {
        if (password_verify($pword, $value[1])) {
            $error = "<verified>";
        } else {
            $error = "Invalid Credentials";
        }
    } else {
        $error = "<notverified>";
    }

    mysqli_close($conn);
    var_dump($error);

    function checkEmail($email, $pword, $conn) {
        $sql = "SELECT Verified, PassWord FROM users WHERE Email='$email'";
        return mysqli_query($conn, $sql);
    }
?>