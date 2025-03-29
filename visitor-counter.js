document.addEventListener("DOMContentLoaded", function () {
    updateVisitorCount();
});

function updateVisitorCount() {
    fetch("counter.php?t=" + new Date().getTime()) // Prevent cache issues
        .then(response => {
            if (!response.ok) {
                throw new Error("Network response was not OK");
            }
            return response.json();
        })
        .then(data => {
            console.log("Visitor Count Response:", data); // Debugging log
            let visitorElement = document.getElementById("visitor-count");
            
            if (data.total_visits !== undefined && visitorElement) {
                visitorElement.textContent = data.total_visits; // Update counter
            } else {
                console.error("Error: 'total_visits' missing in response", data);
            }
        })
        .catch(error => {
            console.error("Error fetching visitor count:", error);
        });
}
