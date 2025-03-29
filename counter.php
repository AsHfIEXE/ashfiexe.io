<?php
// Enable error reporting for debugging
error_reporting(E_ALL);
ini_set('display_errors', 1);

// Enable CORS and JSON response headers at the start
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");

// Database connection
$servername = "sql312.infinityfree.com"; // Your InfinityFree SQL host
$username = "if0_38286179";
$password = "rRYHYLpU1omx";
$dbname = "if0_38286179_yourdb_visitors";

// Create MySQL connection
$conn = new mysqli($servername, $username, $password, $dbname);

// Check connection
if ($conn->connect_error) {
    echo json_encode(["error" => "Database connection failed: " . $conn->connect_error]);
    exit();
}

// Create table if not exists (run only once manually for efficiency)
$sql_create = "CREATE TABLE IF NOT EXISTS visitors (
    id INT PRIMARY KEY AUTO_INCREMENT,
    total_visits INT NOT NULL DEFAULT 0
)";
if (!$conn->query($sql_create)) {
    echo json_encode(["error" => "Failed to create table: " . $conn->error]);
    exit();
}

// Increment the total visit count safely
$sql_update = "INSERT INTO visitors (id, total_visits) VALUES (1, 1)
               ON DUPLICATE KEY UPDATE total_visits = total_visits + 1";
if (!$conn->query($sql_update)) {
    echo json_encode(["error" => "Failed to update visitor count: " . $conn->error]);
    exit();
}

// Retrieve the updated count
$sql_select = "SELECT total_visits FROM visitors WHERE id = 1";
$result = $conn->query($sql_select);
$row = $result->fetch_assoc();
$total_visits = $row ? $row["total_visits"] : 0;

// Close connection
$conn->close();

// Return JSON response
echo json_encode(["total_visits" => $total_visits]);
?>
