<?php

header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');


if(!isset($_POST) || !isset($_POST['username'])) die();

session_start();

$response = [];

$con = mysqli_connect('localhost', 'root', '', 'test_site');

$newPass = mysqli_real_escape_string($con, $_POST['newpassword']);
$userName = mysqli_real_escape_string($con, $_POST['username']);

$query = "UPDATE users SET password = '$newPass' WHERE username = '$userName'";

$result = mysqli_query($con, $query);

if($result) {
	$response['status'] = 'done';
} else {
	$response['status'] = 'error';
}


echo json_encode($response);