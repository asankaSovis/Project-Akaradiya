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

    if(isset($_POST['email'])) {
        require_once './vendor/autoload.php';
        require_once './credential.php';

        $email = $_POST['email'];

        $result = checkVerified($email, $conn);

        $value = mysqli_fetch_row($result);
        
        if ($value == null) {
            $error = "<nousers>";
        } else if ($value[0] == '1') {
            $error = "<authed>";
        } else if ($value[0] == '0') {
            $heading = "Verify Your Akaradiya Account";
            $authLink = "'$value[1]'";
            $text = $authLink;
            $error = sendEmail($email, $heading, $text);
        } else {
            $error = "<error>";
        }
        var_dump($error);
    }

    function sendEmail($email, $heading, $text) {
        // Create the Transport
        $transport = (new Swift_SmtpTransport('smtp.gmail.com', 587, 'tls'))
        ->setUsername(EMAIL)
        ->setPassword(PASSWORD)
        ;

        //Create the Mailer using your created Transport
        $mailer = new Swift_Mailer($transport);

        // Create a message
        $message = (new Swift_Message($heading))
            ->setFrom([EMAIL => 'Akaradiya Open Dictionary'])
            ->setTo([$email])
            ->setBody($text)
        ;

        // Send mail
        if($result = $mailer -> send($message)) {
            $error = "<success>";
        } else {
            $error = "<error>";
        }
        return $error;
    }

    function checkVerified($email, $conn) {
        $sql = "SELECT Verified, PassWord FROM users WHERE Email='$email'";
        return mysqli_query($conn, $sql);
    }
?>