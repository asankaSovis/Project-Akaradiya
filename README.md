# Project-Akaradiya
Building a database of Sinhala definitions for an English dictionary using crowd sourcing. Anyone can create an account using their email. They can later add words to the dictionary, add definitions to the existing words, vote for the best definition from currently existing definitions that others have added. At fixed time periods, the words with the most votes above a threshold are compiled into a release database which is provided to the public as the 'Akaradiya Sinhala English Dictionary'. The cycle continues with new versions of the dictionary database released at a constant interval.
For anyone who is fluent in English and Sinhala, most preferably native Sinhala speakers. Not restricted by gender or race. Age restrictions can be put up if required, for now, above 16 is preferred.

## Introduction
We can observe that a lot of offline dictionaries exist in our usage, most are in printed type. They can be referred to physically but, in most cases, they provide only one definition or meaning to words. We know that Madhura, Derana, Malalasekara are few examples for Sinhala dictionaries, both online and offline that most Sri Lankans use.
Madura contains over 230,000 definitions with the facility to translate from English to Sinhala and vice versa. Nowadays, the android app and Madura software are available to the public.
Dict.lk is also a famous website that provides an online Sinhala dictionary. It provides abbreviation, glossary, technical terms in the alphabetic order. It is one of the fastest and most effective searchable dictionaries for the Sinhala language.
When we talk about the open dictionaries Wikipedia, Macmillan, Urban, Wiktionary and Cambridge are some of the most famous open dictionaries in the world. They are most trusted and well reputed, and have British and American English words with definitions, pictures etc. They operate in the concept of allowing anyone to submit a new word and the best and latest proposals get to make it to the public. They are more convenient as they are more portable and flexible compared to the printed and closed dictionaries.
On the other hand, we identify those open dictionaries have the potential to grow while getting better and more accurate in the long term. Wikipedia is the best example. The open dictionaries can also influence the creation of new words and publicize the use of them.
Our goal is to introduce the advantages of the open dictionary concept to the Sinhala language. Through this, we plan to create a much broader and diverse collection of definitions to the community.
Even though currently, our plan lies in an English to Sinhala language dictionary, it has the potential to expand into a much broader scope of Sinhala to English and Sinhala dictionary as well.

**NOTE THAT THIS IS STILL IN THE DEVELOPMENT PHASE**

## Project Objectives and Expected Benefits
1.	Objective 1 - Create an initial platform for sharing knowledge on Sinhala language
    - A platform that is dedicated for creating and improving accessibility for Sinhala language content online. Fuel a concept that can be a stepping stone for other open platforms for Sri Lankans for building more products and services. 

2.	Objective 2 - Create a place where anyone can contribute and collaborate to expand
    - Members of the site are authorized to access the database, can add words and give definitions for the word that is already given. This creates a platform where people can get together and collaborate to achieve a common goal. The platform on the other hand, is not restricted for certain individual, but is open for anyone with the passion.

3.	Objective 3 - Create a common database of definitions anyone can access
    - There exists a gap between Sinhala language and the internet. It is quite hard to find a common location with all the definitions of Sinhala language that is reliable and open. With our solution, everyone get access to a universal dictionary owned by the people, for the people. Thus, with time, it can grow better and more reliable.

### Defining a Word:
A word is an English word that is in the database that needs a definition. A word is divided into Attribute Blocks which contains the attributes required to structure a complete definition. The structure of a word is as follows:

```
**Word**
**Definition** [Class	|	Pronunciation	|	Definition]
```
- A word can have multiple Attribute Blocks. Users can choose which ones are better than the other. The ones that best associates with the word remains after filtering.
- A word should be a Char[15], with an INT ID.
- An Attribute Block must contain an INT as ID, Punctuation as Char[15] and Definition as Char[500] while linking to a Class, User and Word with their respective IDs.
- A class should contain its ID as INT, Keyword as Char[50] and description as Char[200].

### Who is a User
A user is anyone who signup with the service to interact with the database, add and vote definitions, words and to earn badges and jump through the leaderboard. They are signed in via the email and one email can signup for only one account. If a user forget their password, they can recover via their email.
A user account must have the following prameters:

1.	UserID (INT) – The usique ID a user receive when signing in to the service.
2.	Username (Char[20]) – The name which users use to publicly identify themselves in the websites community.
3.	Email (Char[254]) – The email with which the user registered themselves in the service.
4.	Password (Char[20]) – The password which they use to authenticate themselves.
5.	AuthID (Char[50]) – The authentication ID the user has used to log themselves in.
6.	Verified (BOOL) – If the user has verified the email or not.
7.	Gender (BOOL) – The gender of the user.
8.	Signup Date (DATE) – The date in which the user created an account.
9.	Active Date (DATE) – The date in which the user was last active.
10.	Profile Pic (CHAR[20]) – The profile picture the user has selected.

#### Security of a User
A user must have only one email and no email can create two users.
An email should adhere to the following guidelines:
1.	Recipient name - Uppercase and lowercase letters in English, Digits from 0 to 9, Special characters.
2.	@ symbol
3.	Domain name - Uppercase and lowercase letters in English, Digits from 0 to 9, Hyphen and Period.
4.	Top-level domain
A password should adhere to the following guidelines:
1.	At least 8 characters
2.	A mixture of both uppercase and lowercase letters
3.	A mixture of letters and numbers
4.	At least one special character
5.	It MUST NOT contain < and >
An email must be verified before using it via a link sent to the email address. Only then can the email be used for accessing the website.
There should be the functionality to reset the password. When clicked, an email must be sent to the email address with a link to reset the password in case the user forgot the password.
Passwords must be stored encrypted in the database.

## File Structure
- akaradiya/404error/404.html [The master 404 error]
- akaradiya/assets/images/placeholder.png [Random placeholder image]
- akaradiya/assets/favicon.ico [Master icon file]
- akaradiya/edit/edit.php [PHP of the user information editing form] ✓
- akaradiya/edit/index.html [HTML of the user information editing form] ✓
- akaradiya/edit/main.js [JS of the user information editing form] ✓
- akaradiya/mail/vendor [Files of Swiftmailer library] ✓
- akaradiya/mail/composer.json [  "   ] ✓
- akaradiya/mail/composer.lock [  "   ] ✓
- akaradiya/mail/sendmail.php [PHP of the email sending form] ✓
- akaradiya/mail/index.html [HTML of the email sending form] ✓
- akaradiya/mail/mail.html [HTML structure of the email to be sent to the user] ✓
- akaradiya/mail/main.js [JS of the email sending form] ✓
- akaradiya/reset/index.html [HTML of the reset of user password form] ✓
- akaradiya/reset/reset.php [PHP of the reset of user password form] ✓
- akaradiya/reset/main.js [JS of the reset of user password form] ✓
- akaradiya/signup/index.html [HTML of the signup/login form] ✓
- akaradiya/signup/login.php [PHP of the login form] ✓
- akaradiya/signup/signup.php [PHP of the signup form] ✓
- akaradiya/signup/main.js [JS of the signup/login form] ✓
- akaradiya/verification/index.html [HTML of the verification form] ✓
- akaradiya/verification/authentication.php [PHP of the verification form] ✓
- akaradiya/verification/main.js [JS of the verification form] ✓
- akaradiya/.gitignore [Gitignore file]
- akaradiya/.htaccess [Apache configuration file]
- akaradiya/index.html [Homepage HTML file]
- akaradiya/main.css [Main CSS file to be used throughout the project] ✓
- akaradiya/README.md [Readme file of Github {This file}]