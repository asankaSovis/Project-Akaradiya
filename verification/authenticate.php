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

    $auth = $_POST['q'];

    $result = checkVerified($auth, $conn);

    $value = mysqli_fetch_row($result)[0];

    $sql = "UPDATE users SET Verified=1 WHERE PassWord='$auth'";
    
    if (mysqli_num_rows($result) == 0) {   
        $error = "<nousers>";
    } else if(mysqli_query($conn, $sql)) {
        $error = "<success>$value";
    } else {
        $error = "<failed>";
    }

    mysqli_close($conn);
    var_dump($error);

    function checkVerified($auth, $conn) {
        $sql = "SELECT UserName FROM users WHERE Verified='0' AND PassWord='$auth'";
        return mysqli_query($conn, $sql);
    }
?>