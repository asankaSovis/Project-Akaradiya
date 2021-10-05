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

    if (isset($_POST['verify'])) {
        $email = $_POST['email'];
        $pword = $_POST['password'];
        $error = checkEmail($email, $pword, $conn);
    } else if (isset($_POST['edit'])) {
        $email = $_POST['email'];
        $pword = $_POST['password'];
        $username = $_POST['username'];
        $gender = $_POST['gender'];
        $error = editInfo($email, $pword, $gender, $username, $conn);
    }

    mysqli_close($conn);
    var_dump($error);

    function checkEmail($email, $pword, $conn) {
        $sql = "SELECT Verified FROM users WHERE Email='$email' AND PassWord='$pword'";
        return mysqli_num_rows(mysqli_query($conn, $sql));
    }

    function editInfo($email, $pword, $gender, $username, $conn) {
        $sql = "UPDATE users SET UserName='$username', Gender='$gender' WHERE Email='$email' AND PassWord='$pword'";
        if(mysqli_query($conn, $sql)) {
            $error = "<success>";
        } else {
            $error = "<failed>";
        }
        return $error;
    }
?>