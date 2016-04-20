<?php
	error_reporting(E_ALL); 
	ini_set('display_errors','1');
	$httpClientIP = (!empty($_SERVER['HTTP_CLIENT_IP'])) ? $_SERVER['HTTP_CLIENT_IP'] : "NR";
	$httpXForwardedFor = (!empty($_SERVER['HTTP_X_FORWARDED_FOR'])) ? $_SERVER['HTTP_X_FORWARDED_FOR'] : "NR";
	$remoteAddress = (!empty($_SERVER['REMOTE_ADDR'])) ? $_SERVER['REMOTE_ADDR'] : "NR";
	$date = getdate()["mon"] . "/" . getdate()["mday"] . "/" . getdate()["year"] . "-" . getdate()["hours"] . ":" . getdate()["minutes"] . ":" . getdate()["seconds"];
	$username = $_POST["username"];
	$password = $_POST["password"];
	$saltLength = 64;
	$salt = mcrypt_create_iv($saltLength);
	$passwordHash = password_hash($salt.$password, PASSWORD_DEFAULT, array("cost" => 14));
	$httpClientIPHash = password_hash($salt.$httpClientIP, PASSWORD_DEFAULT, array("cost" => 14));
	$httpXForwardedForHash = password_hash($salt.$httpXForwardedFor, PASSWORD_DEFAULT, array("cost" => 14));
	$remoteAddressHash = password_hash($salt.$remoteAddress, PASSWORD_DEFAULT, array("cost" => 14));
	
	
	if (!file_exists("users/" . $username. "/")) {
		mkdir("users/" . $username. "/", 0777, true);
	}else{
		die("falseUE");
	}
	
	$file = "users/" . $username. "/" . $username . ".user";
	$fileLogginIn = "users/" . $username. "/" . "off.log";
	
	$writing = @fopen($file, "x") or die("false");
	$temp = @fopen($fileLogginIn, "x");
	fclose($temp);
	if($writing){
		fputs($writing, 
			//"httpClientIP=" . $httpClientIPHash . "_httpXForwardedFor=" . $httpXForwardedForHash . "_remoteAddress=" . $remoteAddressHash . "_" .
			"username=" . $username . "_password=" . $passwordHash . ":RRos%" . $salt
		);
	}
	fclose($writing);
	// might as well not overwrite the file if we didn't replace anything*/
	echo("trueR");
	exit();
?>