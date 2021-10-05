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
 
    $username = $_POST['username'];
    $email = $_POST['email'];
    $pword = $_POST['password'];
    $gender = $_POST['gender'];

    if (checkEmail($email, $conn)) {
        $error = signup($username, $email, encrypt($pword), $gender, $conn);
    }
    else
    {
        $error = "This email is already registered.";
    }

    mysqli_close($conn);
    var_dump($error);

    function checkEmail($email, $conn) {
        $sql = "SELECT * FROM users WHERE Email='$email'";
        $result = mysqli_query($conn, $sql);
        return (mysqli_num_rows($result) == 0);
    }

    function signup($username, $email, $pword, $gender, $conn) {
        $sql = "INSERT INTO users (Email, PassWord, UserName, Gender)
        VALUES ('$email','$pword','$username','$gender')";
        if (mysqli_query($conn, $sql)) {
            $error = "<success>";
        } else {
            $error = "Error: " . $sql . ":-" . mysqli_error($conn);
        }
        return $error;
    }

    function encrypt($password) {
        return password_hash($password, PASSWORD_BCRYPT);
    }
?>