// Function to load the JSON file
async function loadFigures() {
    try {
        // Fetch figures.json from the same folder
        const response = await fetch('figures.json');
        // Convert response to JSON data
        return await response.json();
    } catch (error) {
        // If file is missing or invalid, show error in console
        console.error('Error loading JSON:', error);
        return {};
    }
}

// Function to show figures for a series (e.g., AirGear)
function renderFigures(series, figures) {
    // Get the placeholder div for figures
    const figureList = document.getElementById('figure-list');
    // Get the title element
    const categoryTitle = document.getElementById('category-title');
    
    // Update title (e.g., "AirGear" becomes "Air Gear")
    categoryTitle.textContent = series.replace(/([A-Z])/g, ' $1').trim();
    
    // Clear old figures
    figureList.innerHTML = '';
    
    // Check if series exists in JSON or has no figures
    if (!figures[series] || figures[series].length === 0) {
        figureList.innerHTML = '<p>No figures found for this series.</p>';
        return;
    }
    
    // Loop through each figure in the series
    figures[series].forEach(figure => {
        // Create a new div for the figure
        const figureDiv = document.createElement('div');
        // Add "figure" class for styling
        figureDiv.className = 'figure';
        // Add HTML for image, name, details, and link
        figureDiv.innerHTML = `
            <img src="${figure.image}" alt="${figure.name}">
            <div class="figure-details">
                <h3>${figure.name}</h3>
                <p><strong>Set:</strong> ${figure.set}</p>
                <p><strong>Released:</strong> ${figure.released}</p>
                <p>${figure.description}</p>
                <a href="${figure.link}" target="_blank">Buy / View Listing</a>
            </div>
        `;
        // Add figure to the page
        figureList.appendChild(figureDiv);
    });
}

// Function to set up the page
async function init() {
    // Load JSON data
    const figures = await loadFigures();
    
    // Add click events to sidebar items with data-series
    document.querySelectorAll('.sidebar li[data-series]').forEach(item => {
        item.addEventListener('click', () => {
            // Get series name (e.g., "AirGear")
            const series = item.getAttribute('data-series');
            // Show figures for that series
            renderFigures(series, figures);
        });
    });
    
    // Show Air Gear figures by default
    renderFigures('AirGear', figures);
}

// Run setup when page loads
init();