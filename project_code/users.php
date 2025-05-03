<?php
// users.php

require_once 'db_connection.php'; // Include the database connection file

// Function to handle user login
function loginUser($username, $password) {
    $db = connect_db(); // Establish database connection using the function from db_connection.php

    // Prepare a SQL statement to fetch the user by username
    $stmt = $db->prepare("SELECT user_id, username, password FROM users WHERE username = :username");
    $stmt->bindParam(':username', $username);
    $result = $stmt->execute();
    $user = $result->fetchArray(SQLITE3_ASSOC);

    $db->close(); // Close the database connection

    // Check if a user with the given username exists
    if ($user) {
        if ($password === $user['password']) {
            // Password matches, return the user ID
            return $user['user_id'];
        } else {
            // Incorrect password
            return false;
        }
    } else {
        // User not found
        return false;
    }
}

// Handle login request if it's a POST request
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['username']) && isset($_POST['password'])) {
    $username = $_POST['username'];
    $password = $_POST['password'];

    $userId = loginUser($username, $password);

    if ($userId) {
        // Login successful
        session_start();
        $_SESSION['user_id'] = $userId;
        echo json_encode(['success' => true, 'message' => 'Login successful']);
    } else {
        // Login failed
        echo json_encode(['success' => false, 'message' => 'Invalid username or password']);
    }
    exit(); // Stop further script execution after handling the request
} else {
    // If it's not a POST request with username and password, just exit
    exit();
}
?>
