<?php 

require('connectDB.php');
require_once('CORS.php');

$fetchAll = "SELECT nosaukums FROM motors";
$resultAll = $conn->query($fetchAll);

if ($resultAll->num_rows > 0) {
    $rows = array();
    while($row = $resultAll->fetch_assoc()) {
        $rows[] = $row;
    }
    echo json_encode($rows);
} else {
    echo json_encode([]);
}

$conn->close();

?>