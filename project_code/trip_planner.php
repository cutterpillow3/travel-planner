<?php
include 'db_connection.php';

// Validate and sanitize the destination IDs
if (!isset($_GET['destinations'])) {
    http_response_code(400);
    echo json_encode(['error' => 'No destinations provided.']);
    exit;
}

$destination_ids = explode(',', $_GET['destinations']);
$destination_ids = array_map('intval', $destination_ids); // Sanitize input

function get_transport_options($db, $from_id, $to_id) {
    $stmt = $db->prepare('SELECT `to`.transport_type, `to`.description FROM transport_options `to` JOIN destination_transport dt ON `to`.transport_id = dt.transport_id WHERE dt.destination_id_from = :from AND dt.destination_id_to = :to');
    $stmt->bindValue(':from', $from_id, SQLITE3_INTEGER);
    $stmt->bindValue(':to', $to_id, SQLITE3_INTEGER);
    $results = $stmt->execute();

    $options = [];
    while($row = $results->fetchArray(SQLITE3_ASSOC)){
        $options[] = $row;
    }
    return $options;
}

function get_eco_rating($db, $destination_id) {
    $stmt = $db->prepare('SELECT eco_rating FROM destinations WHERE destination_id = :id');
    $stmt->bindValue(":id", $destination_id, SQLITE3_INTEGER);
    $result = $stmt->execute();
    return $result->fetchArray(SQLITE3_ASSOC);
}

// Connect to the database once
$db = connect_db();
$trip_plan = [];
$total_eco_rating = 0;

// Loop through the selected destination IDs to get transport options and eco-ratings
for($i = 0; $i < count($destination_ids) - 1; $i++){
    $from_id = $destination_ids[$i];
    $to_id = $destination_ids[$i+1];
    $transport_options = get_transport_options($db, $from_id, $to_id);
    $trip_plan[] = ["from" => $from_id, "to" => $to_id, "options" => $transport_options];

    // Get eco-rating for the starting destination
    $destination = get_eco_rating($db, $from_id);
    if ($destination) {
        $total_eco_rating += $destination['eco_rating'];
    }
}

// Get eco-rating for the final destination
$destination = get_eco_rating($db, $destination_ids[count($destination_ids)-1]);
if ($destination) {
    $total_eco_rating += $destination['eco_rating'];
}

// Calculate the average eco-rating
$average_eco_rating = count($destination_ids) > 0 ? $total_eco_rating / count($destination_ids) : 0;

// Build the response
$response = [
    'trip_plan' => $trip_plan,
    'average_eco_rating' => $average_eco_rating
];

// Set the Content-Type header to application/json
header('Content-Type: application/json');
echo json_encode($response);

// Close the database connection
$db->close();
?>
