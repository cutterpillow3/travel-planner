<?php

define('DB_PATH', '/../travel-planner/database/travel.db'); // Define a constant for the database path

function test_db_connection() {
    try {
        $db = new SQLite3(DB_PATH); // Use the defined constant
        echo json_encode(['message' => 'Database connected successfully!']);
        $db->close();
    } catch (Exception $e) {
        // Log the error (consider using a logging library or mechanism in production)
        error_log("Database connection failed: " . $e->getMessage());
        echo json_encode(['error' => 'Database connection failed.']);
    }
}

test_db_connection(); // Call the function to test the connection

?>
