<?php

header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');

if(!isset($_POST)) die();

session_start();

$response = [];

$con = mysqli_connect('localhost', 'root', '', 'test_site');

$username = mysqli_real_escape_string($con, $_POST['username']);
$password = mysqli_real_escape_string($con, $_POST['password']);

$query = "INSERT INTO users (username, password) VALUES ('$username', '$password')";

$result = mysqli_query($con, $query);

if($result){
	$response['status'] = 'loggedin';
	$response['user'] = $username;
	$response['id'] = md5(uniqid());
	$_SESSION['id'] = $response['id'];
	$_SESSION['user'] = $username;
} else {
	$response['status'] = 'error';
}

echo json_encode($response);
/*
print_r($_POST);*/