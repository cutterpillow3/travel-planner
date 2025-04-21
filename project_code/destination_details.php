<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

include 'db_connection.php';

// ... rest of your PHP code
include 'db_connection.php';

function get_destination_details($destination_id) {
    $db = connect_db();
    $stmt = $db->prepare('SELECT * FROM destinations WHERE destination_id = :id');
    $stmt->bindValue(':id', $destination_id, SQLITE3_INTEGER);
    $result = $stmt->execute();
    $destination = $result->fetchArray(SQLITE3_ASSOC);

    $stmt = $db->prepare('SELECT rc.criteria_name, dr.rating_value FROM destination_ratings dr JOIN ratings_criteria rc ON dr.criteria_id = rc.criteria_id WHERE dr.destination_id = :id');
    $stmt->bindValue(':id', $destination_id, SQLITE3_INTEGER);
    $result = $stmt->execute();
    $ratings = [];
    while ($row = $result->fetchArray(SQLITE3_ASSOC)) {
        $ratings[] = $row;
    }

    $db->close();
    return ['destination' => $destination, 'ratings' => $ratings];
}

$destination_id = $_GET['id'];
$details = get_destination_details($destination_id);

header('Content-Type: application/json');
echo json_encode($details);
?>
