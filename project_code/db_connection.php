<?php
function connect_db() {
    try {
        $db = new SQLite3('travel-planner/database/travel.db'); // Updated path
        return $db;
    } catch (Exception $e) {
        die("Database connection failed: " . $e->getMessage());
    }
}
?>
