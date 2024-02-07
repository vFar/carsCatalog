<?php 

require('connectDB.php');
require_once('CORS.php');

$fetchAll = "SELECT 
a.auto_nr, 
a.auto_gads, 
ma.nosaukums AS marka_nosaukums, 
mo.nosaukums AS motors_nosaukums, 
a.motoratilpums, 
a.pilnamasa, 
a.pasmasa, 
p.nosaukums AS piedzina_nosaukums 
FROM 
auto AS a 
INNER JOIN 
marka AS ma ON a.markaID = ma.ID 
INNER JOIN 
motors AS mo ON a.motorsID = mo.ID 
INNER JOIN 
piedzina AS p ON a.piedzinaID = p.ID
ORDER BY A.ID DESC
;";
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