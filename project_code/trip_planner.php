<?php
include 'db_connection.php';

// Get destinations from GET request (e.g., trip_planner.php?destinations=1,2,3)
$destination_ids = explode(',', $_GET['destinations']);

function get_transport_options($from_id, $to_id) {
    $db = connect_db();
    $stmt = $db->prepare('SELECT `to`.transport_type, `to`.description FROM transport_options `to` JOIN destination_transport dt ON `to`.transport_id = dt.transport_id WHERE dt.destination_id_from = :from AND dt.destination_id_to = :to');
    $stmt->bindValue(':from', $from_id, SQLITE3_INTEGER);
    $stmt->bindValue(':to', $to_id, SQLITE3_INTEGER);
    $results = $stmt->execute();
    $options = [];
    while($row = $results->fetchArray(SQLITE3_ASSOC)){
        $options[] = $row;
    }
    $db->close();
    return $options;
}

// Example usage.
$trip_plan = [];
$total_eco_rating = 0;

// Loop through the selected destination IDs to get transport options and eco-ratings
for($i = 0; $i < count($destination_ids) - 1; $i++){
    $from_id = $destination_ids[$i];
    $to_id = $destination_ids[$i+1];
    $transport_options = get_transport_options($from_id, $to_id);
    $trip_plan[] = ["from" => $from_id, "to" => $to_id, "options" => $transport_options];

    // Get eco-rating for the starting destination
    $db = connect_db();
    $stmt = $db->prepare('SELECT eco_rating FROM destinations WHERE destination_id = :id');
    $stmt->bindValue(":id", $from_id, SQLITE3_INTEGER);
    $result = $stmt->execute();
    $destination = $result->fetchArray(SQLITE3_ASSOC);
    $db->close();
    if ($destination) {
        $total_eco_rating += $destination['eco_rating'];
    }
}

// Get eco-rating for the final destination
$db = connect_db();
$stmt = $db->prepare('SELECT eco_rating FROM destinations WHERE destination_id = :id');
$stmt->bindValue(":id", $destination_ids[count($destination_ids)-1], SQLITE3_INTEGER);
$result = $stmt->execute();
$destination = $result->fetchArray(SQLITE3_ASSOC);
$db->close();
if ($destination) {
    $total_eco_rating += $destination['eco_rating'];
}

// Calculate the average eco-rating
$average_eco_rating = count($destination_ids) > 0 ? $total_eco_rating / count($destination_ids) : 0;

echo "<h1>Trip Plan</h1>";
foreach($trip_plan as $trip){
    echo "<p>From: ".$trip['from']." to: ".$trip['to']."</p>";
    echo "<h2>Transport Options</h2>";
    foreach($trip['options'] as $option){
        echo "<p>".$option['transport_type'].": ".$option['description']."</p>";
    }
}
echo "<p>Average Eco Rating: ".$average_eco_rating."</p>";

?>
