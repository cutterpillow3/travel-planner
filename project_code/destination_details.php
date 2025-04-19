<?php
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

echo "<div class='details-container'>"; // Added container div

if ($details['destination']) {
    echo "<h2>" . $details['destination']['name'] . "</h2>";
    echo "<p>Location: " . $details['destination']['location'] . "</p>";
    echo "<p>Eco Rating: " . $details['destination']['eco_rating'] . "</p>";
    echo "<p>" . $details['destination']['description'] . "</p>";
    echo "<img src='" . $details['destination']['image_path'] . "' alt='" . $details['destination']['name'] . "' width='200'>";
    echo "<h3>Ratings:</h3>";
    foreach ($details['ratings'] as $rating) {
        echo "<p>" . $rating['criteria_name'] . ": " . $rating['rating_value'] . "</p>";
    }
} else {
    echo "Destination not found.";
}

echo "</div>"; // Closing container div
?>