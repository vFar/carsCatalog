<?php 

require('connectDB.php');
require_once('CORS.php');

$json = file_get_contents('php://input');
$data = json_decode($json, true);

if (is_array($data) && !empty($data)) {
    // Now you can access your data using the keys provided in your JSON structure
    // For example, if your JSON includes {"registrationNumber": "ABC123"}
    $registrationNumber = $data['registrationNumber'];
    $releaseYear = $data['releaseYear'];
    $carBrand = $data['carBrand'];
    $engineType = $data['engineType'];
    $engineCapacity = $data['engineCapacity'];
    $fullWeight = $data['fullWeight'];
    $curbWeight = $data['curbWeight'];
    $drivetrain = $data['drivetrain'];


    // Process your data (e.g., insert into database)
    // Prepare an SQL statement
    $stmt = $conn->prepare("INSERT INTO auto (auto_nr, auto_gads, markaID, motorsID, motoratilpums, pilnamasa, pasmasa, piedzinaID) VALUES ('$registrationNumber', $releaseYear, $carBrand, $engineType, $engineCapacity, $fullWeight, $curbWeight, $drivetrain)");

    // Execute the statement
    if ($stmt->execute()) {
        echo json_encode(array("message" => "Record added successfully"));
    } else {
        echo json_encode(array("error" => "Failed to add record"));
    }

    // Close the statement
    $stmt->close();
} else {
    echo json_encode(array("error" => "Invalid data"));
}

$conn->close();

?>