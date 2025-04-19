<?php
include 'db_connection.php';

function get_destinations() {
    $db = connect_db();
    $results = $db->query('SELECT * FROM destinations');
    $destinations = [];
    while ($row = $results->fetchArray(SQLITE3_ASSOC)) {
        $destinations[] = $row;
    }
    $db->close();
    return $destinations;
}

$destinations = get_destinations();

// Example usage to display the destinations
foreach ($destinations as $destination) {
    echo "<h2>" . $destination['name'] . "</h2>";
    echo "<p>Location: " . $destination['location'] . "</p>";
    echo "<p>Eco Rating: " . $destination['eco_rating'] . "</p>";
    echo "<p>" . $destination['description'] . "</p>";
    echo "<img src='" . $destination['image_path'] . "' alt='" . $destination['name'] . "' width='200'>";
    echo "<a href='destination_details.php?id=" . $destination['destination_id'] . "'>View Details</a>";
    echo "<hr>";
}
?>