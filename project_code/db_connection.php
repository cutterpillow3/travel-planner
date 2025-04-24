<?php

define('DB_PATH', 'travel-planner/database/travel.db'); // Define a constant for the database path

function connect_db(): SQLite3 {
    $db = new SQLite3(DB_PATH); // Use the defined constant

    if (!$db) {
        throw new Exception("Database connection failed: " . $db->lastErrorMsg());
    }

    return $db;
}

// Optional: Function to close the database connection
function close_db(SQLite3 $db): void {
    $db->close();
}

?>
