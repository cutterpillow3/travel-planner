function get_destination_details($destination_id) {
    $db = connect_db();

    // Prepare and execute the destination query
    $stmt = $db->prepare('SELECT * FROM destinations WHERE destination_id = :id');
    $stmt->bindValue(':id', $destination_id, SQLITE3_INTEGER);
    $result = $stmt->execute();
    $destination = $result->fetchArray(SQLITE3_ASSOC);

    if (!$destination) {
        // Destination not found
        return ['error' => 'Destination not found.'];
    }

    // Prepare and execute the ratings query
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
