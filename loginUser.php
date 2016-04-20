<?php
	error_reporting(E_ALL);
	ini_set('display_errors','1');
	$httpClientIP = (!empty($_SERVER['HTTP_CLIENT_IP'])) ? $_SERVER['HTTP_CLIENT_IP'] : "NR";
	$httpXForwardedFor = (!empty($_SERVER['HTTP_X_FORWARDED_FOR'])) ? $_SERVER['HTTP_X_FORWARDED_FOR'] : "NR";
	$remoteAddress = (!empty($_SERVER['REMOTE_ADDR'])) ? $_SERVER['REMOTE_ADDR'] : "NR";
	$date = getdate()["mon"] . "/" . getdate()["mday"] . "/" . getdate()["year"] . "-" . getdate()["hours"] . ":" . getdate()["minutes"] . ":" . getdate()["seconds"];
	$username = $_POST["username"];
	$password = $_POST["password"];
	$file = "users/" . $username. "/" . $username . ".user";
	$fileLoggedOff = "users/" . $username. "/" . "off.log";
	$fileLoggedOn = "users/" . $username. "/" . "on.log";
	$progress = 0;
	
	if (!file_exists($fileLoggedOff)) {
		die("false");
	}
	$fileContents = file_get_contents($file);
	$fileContents = explode("_", $fileContents);
	@$stringContents = [];
	
	for($i = 0; $i < count($fileContents); $i++){
		$stringContents[] = explode("=", $fileContents[$i]);
		if(strcmp($stringContents[$i][0], "username") == 0){
			if(strcmp($stringContents[$i][1], $username) == 0){
				$progress++;
			}
		}
		if(strcmp($stringContents[$i][0], "password") == 0){
			
		}
	}
	
	// might as well not overwrite the file if we didn't replace anything*/
	echo("trueL");
	exit();
?>