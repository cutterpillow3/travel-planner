document.addEventListener('DOMContentLoaded', () => {
    const destinationList = document.getElementById('destination-list');
    const destinationSelects = document.querySelectorAll('select');
    const loadingIndicator = document.createElement('div');
    loadingIndicator.textContent = 'Loading...';
    loadingIndicator.style.display = 'none'; // Initially hidden
    document.body.appendChild(loadingIndicator);

    function showLoading() {
        loadingIndicator.style.display = 'block';
    }

    function hideLoading() {
        loadingIndicator.style.display = 'none';
    }

    fetchDestinations();

    function fetchDestinations() {
        showLoading();
        fetch('travel-planner/project_code/destinations.php')
            .then(response => response.json())
            .then(destinations => {
                hideLoading();
                populateDestinations(destinations);
            })
            .catch(error => {
                hideLoading();
                alert('Error loading destinations. Please try again later.');
                console.error('Error loading destinations:', error);
            });
    }

    function populateDestinations(destinations) {
        destinationList.innerHTML = ''; // Clear existing destinations
        destinationSelects.forEach(select => select.innerHTML = '<option value="">Select Destination</option>'); // Clear select options

        destinations.forEach(destination => {
            const destinationDiv = createDestinationElement(destination);
            destinationList.appendChild(destinationDiv);

            destinationSelects.forEach(select => {
                const option = document.createElement('option');
                option.value = destination.destination_id;
                option.textContent = destination.name;
                select.appendChild(option);
            });
        });

        addEventListenersToViewDetailsLinks();
    }

    function createDestinationElement(destination) {
        const destinationDiv = document.createElement('div');
        destinationDiv.innerHTML = `
            <h2>${destination.name}</h2>
            <p>Location: ${destination.location}</p>
            <p>Eco Rating: ${destination.eco_rating}</p>
            <img src="${destination.image_path}" alt="${destination.name}" width="200">
            <a class="view-details-link" href="travel-planner/project_code/destination_details.php?id=${destination.destination_id}">View Details</a>
        `;
        return destinationDiv;
    }

    document.getElementById('plan-trip').addEventListener('click', () => {
        const destination1 = document.getElementById('destination1').value;
        const destination2 = document.getElementById('destination2').value;
        const destination3 = document.getElementById('destination3').value;

        showLoading();
        fetch(`travel-planner/project_code/trip_planner.php?destinations=${destination1},${destination2},${destination3}`)
            .then(response => response.text())
            .then(results => {
                hideLoading();
                document.getElementById('trip-results').innerHTML = results;
            })
            .catch(error => {
                hideLoading();
                alert('Error planning trip. Please try again later.');
                console.error('Error planning trip:', error);
            });
    });

    function addEventListenersToViewDetailsLinks() {
        const viewDetailsLinks = document.querySelectorAll('.view-details-link');
        viewDetailsLinks.forEach(link => {
            link.addEventListener('click', (event) => {
                event.preventDefault(); // Prevent default navigation
                const detailsUrl = event.target.href;
                fetchDestinationDetails(detailsUrl);
            });
        });
    }

    function fetchDestinationDetails(detailsUrl) {
        showLoading();
        fetch(detailsUrl)
            .then(response => response.json())
            .then(details => {
                hideLoading();
                displayDestinationDetails(details);
            })
            .catch(error => {
                hideLoading();
                alert('Error fetching destination details. Please try again later.');
                console.error('Error fetching destination details:', error);
            });
    }

    function displayDestinationDetails(details) {
        const detailsContainer = document.getElementById('destination-details-container') || createDetailsContainer();
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

            const closeButton = detailsContainer.querySelector('#close-details');
            if (closeButton) {
                closeButton.addEventListener('click', () => {
                    detailsContainer.style.display = 'none';
                });
            }

            detailsContainer.style.display = 'block'; // Show the details container
        } else {
            detailsContainer.innerHTML = '<p>Destination details not found.</p>';
            detailsContainer.style.display = 'block';
        }
    }

    function createDetailsContainer() {
        const container = document.createElement('div');
        container.id = 'destination-details-container';
        container.style.display = 'none'; // Initially hidden
        container.style.position = 'fixed';
        container.style.top = '50%';
        container.style.left = '50%';
        container.style.transform = 'translate(-50%, -50%)';
        container.style.backgroundColor = 'white';
        container.style.border = '1px solid #ccc';
        container.style.padding = '20px';
        container.style.zIndex = '1000'; // Ensure it's on top
        document.body.appendChild(container);
        return container;
    }
});
