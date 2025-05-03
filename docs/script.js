document.addEventListener('DOMContentLoaded', () => {
    // Constants for better organization
    const DESTINATIONS_URL = '/project_code/destinations.php';
    const TRIP_PLANNER_URL = '/project_code/trip_planner.php';
    
    // DOM Elements
    const destinationList = document.getElementById('destination-list');
    const destinationSelects = document.querySelectorAll('select');
    const loadingIndicator = document.getElementById('loading-indicator');
    const detailsContainer = document.getElementById('destination-details-container');

    // Show loading indicator
    function showLoading() {
        loadingIndicator.style.display = 'block';
    }

    // Hide loading indicator
    function hideLoading() {
        loadingIndicator.style.display = 'none';
    }

    // Fetch destinations from the server
    function fetchDestinations() {
        showLoading();
        fetch(DESTINATIONS_URL)
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
                console.error('Error loading destinations:', error);
                destinationList.innerHTML = '<p>Error loading destinations. Please try again later.</p>';
            });
    }

    // Populate destination list and dropdowns
    function populateDestinations(destinations) {
        destinationList.innerHTML = ''; // Clear existing destinations
        destinationSelects.forEach(select => {
            select.innerHTML = '<option value="">Select Destination</option>'; // Clear select options
        });

        destinations.forEach(destination => {
            addDestinationToList(destination);
            populateDropdowns(destination);
        });

        addEventListenersToViewDetailsLinks();
    }

    // Add destination to the destination list
    function addDestinationToList(destination) {
        const destinationDiv = document.createElement('div');
        destinationDiv.innerHTML = `
            <h2>${destination.name}</h2>
            <p>Municipality: ${destination.municipality}</p>
            <p>Eco Rating: ${destination.eco_rating}</p>
            <img src="${destination.image_path}" alt="${destination.name}" width="200">
            <a class="view-details-link" href="/project_code/destination_details.php?id=${destination.destination_id}">View Details</a>
        `;
        destinationList.appendChild(destinationDiv);
    }

    // Populate dropdowns with destination options
    function populateDropdowns(destination) {
        destinationSelects.forEach(select => {
            const option = document.createElement('option');
            option.value = destination.destination_id;
            option.textContent = destination.name;
            select.appendChild(option);
        });
    }

    // Handle trip planning
    document.getElementById('plan-trip').addEventListener('click', () => {
        const destination1 = document.getElementById('destination1').value;
        const destination2 = document.getElementById('destination2').value;
        const destination3 = document.getElementById('destination3').value;

        showLoading();
        fetch(`${TRIP_PLANNER_URL}?destinations=${destination1},${destination2},${destination3}&include_transport=true`)
            .then(response => {
                if (!response.ok) throw new Error('Network response was not ok');
                return response.json(); // Expecting JSON with transport options
            })
            .then(tripData => {
                hideLoading();
                displayTripResults(tripData);
            })
            .catch(error => {
                hideLoading();
                console.error('Error planning trip:', error);
                const tripResultsDiv = document.getElementById('trip-results');
                tripResultsDiv.innerHTML = '<h3>Transport Options</h3><p>Error planning trip. Please try again later.</p>';
            });
    });

    // Display trip results
    function displayTripResults(tripData) {
        const tripResultsDiv = document.getElementById('trip-results');
        tripResultsDiv.innerHTML = '<h3>Trip Plan</h3>'; // Clear previous results and add a heading

        if (tripData && tripData.trip_plan && Array.isArray(tripData.trip_plan) && tripData.trip_plan.length > 0) {
            tripData.trip_plan.forEach(destination => {
                tripResultsDiv.innerHTML += `<h4>${destination.name}</h4>`;
                displayTransportOptions(destination, tripResultsDiv);
            });

            if (tripData.average_eco_rating !== undefined) {
                tripResultsDiv.innerHTML += `<p><strong>Average Eco Rating:</strong> ${tripData.average_eco_rating.toFixed(2)}</p>`;
            }
        } else {
            tripResultsDiv.innerHTML = '<h3>Trip Plan</h3><p>Trip Planner results will show here with transport options</p>'; // Display placeholder message
        }
    }

    // Display transport options for a destination
    function displayTransportOptions(destination, tripResultsDiv) {
        if (destination.transport_options && Array.isArray(destination.transport_options) && destination.transport_options.length > 0) {
            tripResultsDiv.innerHTML += '<h5>Available Transport Options</h5><ul>';
            destination.transport_options.forEach(option => {
                tripResultsDiv.innerHTML += `<li>${option.transport_type}: ${option.description}</li>`;
            });
            tripResultsDiv.innerHTML += '</ul>';
        } else {
            tripResultsDiv.innerHTML += `<p>No transport options found at ${destination.name}.</p>`;
        }
    }

    // Add event listeners to "View Details" links
    function addEventListenersToViewDetailsLinks() {
        const viewDetailsLinks = document.querySelectorAll('.view-details-link');
        viewDetailsLinks.forEach(link => {
            link.addEventListener('click', (event) => {
                event.preventDefault(); // Prevent default navigation
                const detailsUrl = event.target.href;

                showLoading();
                fetchDetails(detailsUrl);
            });
        });
    }

    // Fetch and display destination details
    function fetchDetails(detailsUrl) {
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
                console.error('Error fetching destination details:', error);
                detailsContainer.innerHTML = '<p>Error fetching destination details. Please try again later.</p>';
                detailsContainer.style.display = 'block';
            });
    }

    // Display destination details in a popup
    function displayDestinationDetails(details) {
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
                <button id="close-details">Close Details</button>
            `;

            detailsContainer.style.display = 'block'; // Show the details container
            addCloseDetailsButtonListener();
        } else {
            detailsContainer.innerHTML = '<p>Destination details not found.</p>';
            detailsContainer.style.display = 'block';
        }
    }

    // Add listener for close details button
    function addCloseDetailsButtonListener() {
        const closeButton = detailsContainer.querySelector('#close-details');
        if (closeButton) {
            closeButton.addEventListener('click', () => {
                detailsContainer.style.display = 'none'; // Hide the popup
            });
        }
    }

    // Initial fetch of destinations
    fetchDestinations();
});
