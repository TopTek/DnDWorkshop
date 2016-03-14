<?php
	error_reporting(E_ALL); 
	ini_set('display_errors','1');
	$httpClientIP = (!empty($_SERVER['HTTP_CLIENT_IP'])) ? $_SERVER['HTTP_CLIENT_IP'] : "NR";
	$httpXForwardedFor = (!empty($_SERVER['HTTP_X_FORWARDED_FOR'])) ? $_SERVER['HTTP_X_FORWARDED_FOR'] : "NR";
	$remoteAddress = (!empty($_SERVER['REMOTE_ADDR'])) ? $_SERVER['REMOTE_ADDR'] : "NR";
	
	$file = "servers/gameServers/server" . "_" .
			$_POST["serverName"] . "_" . 
			$httpClientIP . "_" . 
			$httpXForwardedFor . "_" . 
			$remoteAddress . 
			".dndwksp";
	
	$file = trim($file);
	$file = str_replace(":", "-", $file);
	
	$writing = @fopen($file, "x") or die("Unable to open: " . $file);
	if($writing){
		fputs($writing, "created");
	}
	fclose($writing);
	// might as well not overwrite the file if we didn"t replace anything
	
	echo($_POST["serverName"]);
	exit();
?>