<?php

require('connectDB.php');
require_once('CORS.php');

$json = file_get_contents('php://input');
$data = json_decode($json, true);

if (isset($data['auto_nrs']) && is_array($data['auto_nrs'])) {
    $autoNumbers = $data['auto_nrs'];
    // Prepare a query with placeholders for each auto_nr
    $placeholders = implode(',', array_fill(0, count($autoNumbers), '?'));
    $sql = "DELETE FROM auto WHERE auto_nr IN ($placeholders)";

    $stmt = $conn->prepare($sql);

    if ($stmt->execute($autoNumbers)) {
        echo json_encode(['success' => true, 'message' => 'Records deleted successfully']);
    } else {
        echo json_encode(['success' => false, 'error' => 'Failed to delete records']);
    }
} else {
    echo json_encode(['success' => false, 'error' => 'Invalid data']);
}

?>
