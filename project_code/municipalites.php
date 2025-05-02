<?php
include 'db_connection.php';

function get_municipalities() {
    $db = connect_db();

    // Prepare the query to get unique municipalities
    $results = $db->query('SELECT DISTINCT municipality FROM destinations'); // Fetch unique municipalities
    if (!$results) {
        http_response_code(500);
        echo json_encode(['error' => 'Database query failed: ' . $db->lastErrorMsg()]);
        exit;
    }

    $municipalities = [];
    while ($row = $results->fetchArray(SQLITE3_ASSOC)) {
        $municipalities[] = $row;
    }

    $db->close();
    return $municipalities;
}

// Set the Content-Type header to application/json
header('Content-Type: application/json');
echo json_encode(get_municipalities());
?>
