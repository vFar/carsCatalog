<?php

require('connectDB.php');
require_once('CORS.php');

// Get the registration number from the request
$json = file_get_contents('php://input');
$data = json_decode($json, true);
$registrationNumber = $data['registrationNumber'];

// Check if the registration number already exists in the database
$stmt = $conn->prepare("SELECT COUNT(*) as count FROM auto WHERE auto_nr = ?");
$stmt->bind_param("s", $registrationNumber);
$stmt->execute();
$result = $stmt->get_result();
$row = $result->fetch_assoc();
$count = $row['count'];

// Return JSON response indicating whether the registration number is unique or not
if ($count > 0) {
    echo json_encode(array("isUnique" => false));
} else {
    echo json_encode(array("isUnique" => true));
}

// Close the statement and database connection
$stmt->close();
$conn->close();

?>
