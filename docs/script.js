// Load destinations from destinations.php
fetch('destinations.php')
    .then(response => response.json())
    .then(destinations => {
        const destinationList = document.getElementById('destination-list');
        const destinationSelects = document.querySelectorAll('select');

        destinations.forEach(destination => {
            const destinationDiv = document.createElement('div');
            destinationDiv.innerHTML = `
                <h2>${destination.name}</h2>
                <p>Location: ${destination.location}</p>
                <p>Eco Rating: ${destination.eco_rating}</p>
                <img src="${destination.image_path}" alt="${destination.name}" width="200">
                <a href="project_code/destination_details.php?id=${destination.destination_id}">View Details</a>
            `;
            destinationList.appendChild(destinationDiv);

            destinationSelects.forEach(select => {
                const option = document.createElement('option');
                option.value = destination.destination_id;
                option.textContent = destination.name;
                select.appendChild(option);
            });
        });
    })
    .catch(error => console.error('Error loading destinations:', error));

// Handle trip planning
document.getElementById('plan-trip').addEventListener('click', () => {
    const destination1 = document.getElementById('destination1').value;
    const destination2 = document.getElementById('destination2').value;
    const destination3 = document.getElementById('destination3').value;

    fetch(`/Users/mau/Documents/travel-planner/project_code/trip_planner.php?destinations=${destination1},${destination2},${destination3}`)
        .then(response => response.text())
        .then(results => {
            document.getElementById('trip-results').innerHTML = results;
        })
        .catch(error => console.error('Error planning trip:', error));
});