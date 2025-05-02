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

function get_transport_options_at_destination($db, $destination_id) {
    $stmt = $db->prepare('
        SELECT topt.transport_type, topt.description
        FROM transport_options topt
        JOIN destination_transport dt ON topt.transport_id = dt.transport_id
        WHERE dt.destination_id = :destination_id
    ');
    $stmt->bindValue(':destination_id', $destination_id, SQLITE3_INTEGER);
    $results = $stmt->execute();

    if (!$results) {
        return []; // Return empty if query fails
    }

    $options = [];
    while($row = $results->fetchArray(SQLITE3_ASSOC)){
        $options[] = $row;
    }
    return $options;
}

function get_eco_rating($db, $destination_id) {
    $stmt = $db->prepare('SELECT eco_rating, name FROM destinations WHERE destination_id = :id');
    $stmt->bindValue(":id", $destination_id, SQLITE3_INTEGER);
    $result = $stmt->execute();

    if (!$result) {
        return null; // Return null if query fails
    }
    
    return $result->fetchArray(SQLITE3_ASSOC);
}

// Connect to the database once
$db = connect_db();
$trip_plan = [];
$total_eco_rating = 0;

// Loop through the selected destination IDs to get transport options and eco-ratings
foreach ($destination_ids as $destination_id) {
    $transport_options = get_transport_options_at_destination($db, $destination_id);
    $destination_info = get_eco_rating($db, $destination_id);
    $destination_name = $destination_info ? $destination_info['name'] : 'Unknown Destination';
    $trip_plan[] = ["destination_id" => $destination_id, "name" => $destination_name, "transport_options" => $transport_options];

    if ($destination_info && isset($destination_info['eco_rating'])) {
        $total_eco_rating += $destination_info['eco_rating'];
    }
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
