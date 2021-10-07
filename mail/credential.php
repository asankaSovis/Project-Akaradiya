<!--  Holds all the sensitive information of the project

        **** NOTE: ALL INFORMATION HERE IS SENSITIVE AND MUST ****
                **** *N*O*T* BE SHARED ANYWHERE ****
                            ****
        **** DEFINE ALL THE SENSITIVE PHP VARIABLES HERE AND ****
                    **** CALL THIS WHEN NEEDED ****

    * Reference to this file is made on the.gitignore file
 -->

<?php
    // IMPORTANT-----------
    // This data is needed for all PHP files in the website. So make sure to
    // move this file to home directory
    // ****MAKE SURE TO MOVE THIS TO THE HOME DIRECTORY****
    // --------------------

    // My Gmail credentials
    // This Gmail account is used to send TLS meails to the user
    define('EMAIL', 'akaradiya.dictionary@gmail.com');
    define('PASSWORD', 'Asankaartist1');
    define('HOMEDIRECTORY', 'localhost/Akaradiya');

    // MySQL authentication data
    // These are the credentials of the MySQL database
    define('SERVERNAME', 'localhost');
    define('USERNAME_SQL', 'root');
    define('PASSWORD_SQL', 'Asanka123');
    define('DBNAME', 'project_akaradiya');
?>