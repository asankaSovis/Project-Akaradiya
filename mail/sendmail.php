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

    if(isset($_POST['email']) || isset($_POST['pword'])) {
        require_once './vendor/autoload.php';
        require_once './credential.php';

        $email = "";

        if (isset($_POST['email'])) {
            $email = $_POST['email'];
        } else {
            $email = $_POST['pword'];
        }

        $result = checkVerified($email, $conn);

        $value = mysqli_fetch_row($result);
        
        if ($value == null) {
            $error = "<nousers>";
        } else if ($value[0] == '1') {
            if (isset($_POST['email'])) {
                $error = "<authed>";
            } else {
                $heading = "Reset Your Akaradiya Account Password";
                $mydirect = HOMEDIRECTORY;
                $authLink = "$mydirect/reset?pword=$value[1]?email=$email";
                $text = readTemplate($value[2], $authLink);
                $error = sendEmail($email, $heading, $text);
            } 
        } else if ($value[0] == '0') {
            if (isset($_POST['pword']))
            {
                $error = "<notauthed>";
            } else {
                $heading = "Verify Your Akaradiya Account";
                $mydirect = HOMEDIRECTORY;
                $authLink = "$mydirect/verification?auth=$value[1]";
                $text = readTemplate($value[2], $authLink);
                $error = $text;
                $error = sendEmail($email, $heading, $text);
            }
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
            ->setContentType("text/html");
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
        $sql = "SELECT Verified, PassWord, UserName FROM users WHERE Email='$email'";
        return mysqli_query($conn, $sql);
    }

    function readTemplate($name, $link) {
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