<?php
include 'db_connection.php';

function get_destinations() {
    $db = connect_db();

    // Prepare the query and execute it
    $results = $db->query('SELECT * FROM destinations');
    if (!$results) {
        // Handle query error
        http_response_code(500);
        echo json_encode(['error' => 'Database query failed: ' . $db->lastErrorMsg()]);
        exit;
    }

    $destinations = [];
    while ($row = $results->fetchArray(SQLITE3_ASSOC)) {
        $destinations[] = $row;
    }

    $db->close();
    return $destinations;
}

$destinations = get_destinations();

// Set the Content-Type header to application/json
header('Content-Type: application/json');

// Encode the PHP array into a JSON string and output it
echo json_encode($destinations);
?>
