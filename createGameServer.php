<?php
	error_reporting(E_ALL); 
	ini_set('display_errors','1');
	$httpClientIP = (!empty($_SERVER['HTTP_CLIENT_IP'])) ? $_SERVER['HTTP_CLIENT_IP'] : "NR";
	$httpXForwardedFor = (!empty($_SERVER['HTTP_X_FORWARDED_FOR'])) ? $_SERVER['HTTP_X_FORWARDED_FOR'] : "NR";
	$remoteAddress = (!empty($_SERVER['REMOTE_ADDR'])) ? $_SERVER['REMOTE_ADDR'] : "NR";
	$date = getdate()[mon] . "/" . getdate()[mday] . "/" . getdate()[year] . "-" . getdate()[hours] . ":" . getdate()[minutes] . ":" . getdate()[seconds];
	$file = "servers/gameServers/" .
			$_POST["serverName"] . "_" . 
			$httpClientIP . "_" . 
			$httpXForwardedFor . "_" . 
			$remoteAddress . 
			".server";
	
	$file = trim($file);
	$file = str_replace(":", "-", $file);
	
	$writing = @fopen($file, "x") or die("Unable to open: " . $file);
	if($writing){
		fputs($writing, 
			"SERVER-NAME=" . $_POST["serverName"] . "_" . "DATE-CREATED=" . $date . "DATE-LAST-OPENED=" . $date .
			"SERVER-PLAYERS=" . "[" . "{" . "name of space in array" . ":" . "what goes in this part in the array" . "}" . "]"
		);
	}
	fclose($writing);
	// might as well not overwrite the file if we didn't replace anything
	
	echo($_POST["serverName"]);
	exit();
?>