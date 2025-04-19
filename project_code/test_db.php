<?php
try {
    $db = new SQLite3('/Users/mau/Documents/travel-planner/database/travel.db'); // simplified connection.
    echo "Database connected successfully!";
    $db->close();
} catch (Exception $e) {
    echo "Database connection failed: " . $e->getMessage();
}
?>