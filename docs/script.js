document.addEventListener('DOMContentLoaded', () => {
    const destinationList = document.getElementById('destination-list');
    const destinationSelects = document.querySelectorAll('select');
    const loadingIndicator = document.getElementById('loading-indicator');

    // Function to show loading indicator
    function showLoading() {
        loadingIndicator.style.display = 'block';
    }

    // Function to hide loading indicator
    function hideLoading() {
        loadingIndicator.style.display = 'none';
    }

    // Fetch destinations from the server
    function fetchDestinations() {
        showLoading();
        fetch('travel-planner/project_code/destinations.php')
            .then(response => {
                if (!response.ok) throw new Error('Network response was not ok');
                return response.json();
            })
            .then(destinations => {
                hideLoading();
                populateDestinations(destinations);
            })
            .catch(error => {
                hideLoading();
                alert('Error loading destinations: ' + error.message);
                console.error('Error loading destinations:', error);
            });
    }

    // Populate destination list and dropdowns
    function populateDestinations(destinations) {
        destinationList.innerHTML = ''; // Clear existing destinations
        destinationSelects.forEach(select => select.innerHTML = '<option value="">Select Destination</option>'); // Clear select options

        destinations.forEach(destination => {
            const destinationDiv = document.createElement('div');
            destinationDiv.innerHTML = `
                <h2>${destination.name}</h2>
                <p>Location: ${destination.location}</p>
                <p>Eco Rating: ${destination.eco_rating}</p>
                <img src="${destination.image_path}" alt="${destination.name}" width="200">
                <a class="view-details-link" href="travel-planner/project_code/destination_details.php?id=${destination.destination_id}">View Details</a>
            `;
            destinationList.appendChild(destinationDiv);

            // Populate dropdowns
            destinationSelects.forEach(select => {
                const option = document.createElement('option');
                option.value = destination.destination_id;
                option.textContent = destination.name;
                select.appendChild(option);
            });
        });

        addEventListenersToViewDetailsLinks();
    }

    // Handle trip planning
    document.getElementById('plan-trip').addEventListener('click', () => {
        const destination1 = document.getElementById('destination1').value;
        const destination2 = document.getElementById('destination2').value;
        const destination3 = document.getElementById('destination3').value;

        showLoading();
        fetch(`travel-planner/project_code/trip_planner.php?destinations=${destination1},${destination2},${destination3}`)
            .then(response => {
                if (!response.ok) throw new Error('Network response was not ok');
                return response.text();
            })
            .then(results => {
                hideLoading();
                document.getElementById('trip-results').innerHTML = results;
            })
            .catch(error => {
                hideLoading();
                alert('Error planning trip: ' + error.message);
                console.error('Error planning trip:', error);
            });
    });

    // Add event listeners to "View Details" links
    function addEventListenersToViewDetailsLinks() {
        const viewDetailsLinks = document.querySelectorAll('.view-details-link');
        viewDetailsLinks.forEach(link => {
            link.addEventListener('click', (event) => {
                event.preventDefault(); // Prevent default navigation
                const detailsUrl = event.target.href;

                showLoading();
                fetch(detailsUrl)
                    .then(response => {
                        if (!response.ok) throw new Error('Network response was not ok');
                        return response.json();
                    })
                    .then(details => {
                        hideLoading();
                        displayDestinationDetails(details);
                    })
                    .catch(error => {
                        hideLoading();
                        alert('Error fetching destination details: ' + error.message);
                        console.error('Error fetching destination details:', error);
                    });
            });
        });
    }

    // Display destination details in a popup
    function displayDestinationDetails(details) {
        const detailsContainer = document.getElementById('destination-details-container');
        detailsContainer.innerHTML = ''; // Clear previous details

        if (details && details.destination) {
            const destination = details.destination;
            detailsContainer.innerHTML += `
                <h2>${destination.name}</h2>
                <p>Location: ${destination.location}</p>
                <p>Eco Rating: ${destination.eco_rating}</p>
                <p>${destination.description}</p>
                <img src="${destination.image_path}" alt="${destination.name}" width="300">
                <h3>Ratings:</h3>
                ${details.ratings && details.ratings.length > 0 ?
                    '<ul>' + details.ratings.map(rating => `<li>${rating.criteria_name}: ${rating.rating_value}</li>`).join('') + '</ul>' :
                    '<p>No ratings available for this destination.</p>'
                }
            `;

            detailsContainer.style.display = 'block'; // Show the details container
        } else {
            detailsContainer.innerHTML = '<p>Destination details not found.</p>';
            detailsContainer.style.display = 'block';
        }

        // Close button functionality
        const closeButton = detailsContainer.querySelector('#close-details');
        closeButton.addEventListener('click', () => {
            detailsContainer.style.display = 'none'; // Hide the popup
        });
    }

    // Initial fetch of destinations
    fetchDestinations();
});
