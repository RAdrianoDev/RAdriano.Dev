<?php
  //Variables
  $first_name = $_POST['first_name'];
  $last_name = $_POST['last_name'];
  $fone_number = $_POST['fone_number'];
  $mobile = $_POST['mobile'];
  $phone = $_POST['phone'];
  $email = $_POST['email'];
  $linkedin = $_POST['linkedin'];
  $friend = $_POST['friend'];
  $ads = $_POST['ads'];
  $google = $_POST['google'];
  $contact_motive = $_POST['contact_motive']; //cessão de "options" do html não adicionada
  $language1 = $_POST['language1'];
  $language2 = $_POST['language2'];
  $language3 = $_POST['language3'];
  $language4 = $_POST['language4'];
  $language5 = $_POST['language5'];
  $language6 = $_POST['language6'];
  $language7 = $_POST['language7'];
  $language8 = $_POST['language8'];

  $message_box = $_POST['message_box'];
  $send_date = date('d/m/Y');
  $send_time = date('H:i:s');
  

  //E-mail body
  $file = "
    <html>
      <p><b>Firt Name: </b>$first_name </p>
      <p><b>Last Name: </b>$last_name </p>
      <p><b>Fone Number: </b>$fone_number </p>
      <p><b>Mobile: </b>$mobile </p>
      <p><b>Phone: </b>$phone </p>
      <p><b>E-mail: </b>$email</p>
      <p><b>Linkedin: </b>$linkedin</p>
      <p><b>Friend: </b>$friend</p>
      <p><b>Ads: </b>$ads</p>
      <p><b>Google: </b>$google</p>
      <p><b>Contact Motive: </b>$contact_motive</p>
      <p><b>HTML: </b>$language1</p>
      <p><b>CSS: </b>$language2</p>
      <p><b>JavaScript: </b>$language3</p>
      <p><b>C#: </b>$language4</p>
      <p><b>C: </b>$language5</p>
      <p><b>PHP: </b>$language6</p>
      <p><b>Python: </b>$language7</p>
      <p><b>JAVA: </b>$language8</p>
      <p><b>message_box: </b>$message_box</p>


      <p>The message was sent successfully on <b>$send_date</b> at <b>$send_time .</b></p>
    </html>
  ";
  
  //Email to who the content will be delivered
  $receiver = "ronaldo@radriano.dev";
  $subject = "Contact from WebSite RAdriano.dev";

  //Este sempre deverá existir para garantir a exibição correta dos caracteres
  $headers  = "MIME-Version: 1.0\n";
  $headers .= "Content-type: text/html; charset=iso-8859-1\n";
  $headers .= "From: $irst_name <$email>";

  //Enviar
  mail($receiver, $subject, $file, $headers);
  
  echo "<meta http-equiv='refresh' content='10;URL=../contact.html'>";
?>