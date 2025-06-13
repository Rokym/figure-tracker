// Function to load figures.json
async function loadFigures() {
    try {
        const response = await fetch('figures.json');
        return await response.json();
    } catch (error) {
        console.error('Error loading JSON:', error);
        return {};
    }
}

// Function to render figures for a series
function renderFigures(series, figures) {
    const figureList = document.getElementById('figure-list');
    
    // Clear previous figures
    figureList.innerHTML = '';
    
    // Check if series has no figures
    if (!figures[series] || figures[series].length === 0) {
        figureList.innerHTML = '<p>No figures found for this series.</p>';
        return;
    }
    
    // Create figure elements
    figures[series].forEach(figure => {
        const figureDiv = document.createElement('div');
        figureDiv.innerHTML = `
            <h3>${figure.name}</h3>
            <img src="${figure.image}" alt="${figure.name}">
            <p><strong>Set:</strong> ${figure.set}</p>
            <p><strong>Company:</strong> ${figure.company || 'N/A'}</p>
            <p><strong>Released:</strong> ${figure.released}</p>
            <p><strong>Description:</strong> ${figure.description}</p>
            <a href="${figure.link}" target="_blank">Buy / View Listing</a>
        `;
        figureList.appendChild(figureDiv);
    });
}

// Initialize the page
async function init() {
    const figures = await loadFigures();
    
    // Add click events to sidebar items
    document.querySelectorAll('.sidebar li[data-series]').forEach(item => {
        item.addEventListener('click', () => {
            const series = item.getAttribute('data-series');
            renderFigures(series, figures);
        });
    });
    
    // Load Air Gear figures by default
    renderFigures('AirGear', figures);
}

// Run when page loads
init();