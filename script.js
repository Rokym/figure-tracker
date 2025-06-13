// Logo URLs for each series (replace with your GitHub raw URLs)
// Example: AirGear: 'https://raw.githubusercontent.com/rokym/figure-tracker/main/images/logos/airgear_logo_200.png'
const seriesLogos = {
    AirGear: 'https://via.placeholder.com/200x200?text=Air+Gear',
    Bleach: 'https://via.placeholder.com/200x200?text=Bleach',
    AttackOnTitan: 'https://via.placeholder.com/200x200?text=Attack+on+Titan',
    Berserk: 'https://via.placeholder.com/200x200?text=Berserk',
    BlueLock: 'https://via.placeholder.com/200x200?text=Blue+Lock',
    ChainsawMan: 'https://via.placeholder.com/200x200?text=Chainsaw+Man',
    CodeGeass: 'https://via.placeholder.com/200x200?text=Code+Geass',
    DeathNote: 'https://via.placeholder.com/200x200?text=Death+Note',
    DemonSlayer: 'https://via.placeholder.com/200x200?text=Demon+Slayer',
    DragonBallZ: 'https://via.placeholder.com/200x200?text=Dragon+Ball+Z',
    FireForce: 'https://via.placeholder.com/200x200?text=Fire+Force',
    FullmetalAlchemist: 'https://via.placeholder.com/200x200?text=Fullmetal+Alchemist',
    GurrenLagann: 'https://via.placeholder.com/200x200?text=Gurren+Lagann',
    Haikyu: 'https://via.placeholder.com/200x200?text=Haikyu',
    HellsParadise: 'https://via.placeholder.com/200x200?text=Hell%27s+Paradise',
    HunterXHunter: 'https://via.placeholder.com/200x200?text=Hunter+x+Hunter',
    JujutsuKaisen: 'https://via.placeholder.com/200x200?text=Jujutsu+Kaisen',
    KaijuNo8: 'https://via.placeholder.com/200x200?text=Kaiju+No.8',
    KatekyoHitmanReborn: 'https://via.placeholder.com/200x200?text=Katekyo+Hitman+Reborn',
    KurokoNoBasket: 'https://via.placeholder.com/200x200?text=Kuroko+no+Basket',
    Mashle: 'https://via.placeholder.com/200x200?text=Mashle',
    MobPsycho100: 'https://via.placeholder.com/200x200?text=Mob+Psycho+100',
    Naruto: 'https://via.placeholder.com/200x200?text=Naruto',
    OnePiece: 'https://via.placeholder.com/200x200?text=One+Piece',
    OnePunchMan: 'https://via.placeholder.com/200x200?text=One-Punch+Man',
    SakamotoDays: 'https://via.placeholder.com/200x200?text=Sakamoto+Days',
    ShangriLaFrontier: 'https://via.placeholder.com/200x200?text=Shangri-La+Frontier',
    SoloLeveling: 'https://via.placeholder.com/200x200?text=Solo+Leveling',
    SoulEater: 'https://via.placeholder.com/200x200?text=Soul+Eater',
    TheGodOfHighSchool: 'https://via.placeholder.com/200x200?text=The+God+of+High+School',
    TokyoGhoul: 'https://via.placeholder.com/200x200?text=Tokyo+Ghoul',
    TokyoRevengers: 'https://via.placeholder.com/200x200?text=Tokyo+Revengers',
    TowerOfGod: 'https://via.placeholder.com/200x200?text=Tower+of+God',
    UndeadUnluck: 'https://via.placeholder.com/200x200?text=Undead+Unluck',
    VinlandSaga: 'https://via.placeholder.com/200x200?text=Vinland+Saga',
    WindBreaker: 'https://via.placeholder.com/200x200?text=Wind+Breaker',
    YuYuHakusho: 'https://via.placeholder.com/200x200?text=Yu+Yu+Hakusho',
    Zelda: 'https://via.placeholder.com/200x200?text=Zelda',
    FinalFantasy: 'https://via.placeholder.com/200x200?text=Final+Fantasy'
};

// Load figures.json
async function loadFigures() {
    try {
        const response = await fetch('figures.json');
        return await response.json();
    } catch (error) {
        console.error('Error loading JSON:', error);
        return {};
    }
}

// Render content based on series
function renderContent(series, figures) {
    const seriesLogoDiv = document.getElementById('series-logo');
    const contentDiv = document.getElementById('content');
    
    // Clear previous content
    seriesLogoDiv.innerHTML = '';
    contentDiv.innerHTML = '';
    
    if (series === 'All') {
        // Landing page: show logo grid
        const logoGrid = document.createElement('div');
        logoGrid.className = 'logo-grid';
        Object.keys(figures).filter(s => s !== 'Purchased').forEach(s => {
            const logoDiv = document.createElement('div');
            logoDiv.className = 'logo-item';
            logoDiv.innerHTML = `<img src="${seriesLogos[s]}" alt="${s}" data-series="${s}">`;
            logoGrid.appendChild(logoDiv);
        });
        contentDiv.appendChild(logoGrid);
    } else if (series === 'Purchased') {
        // Purchased page: show purchased items
        seriesLogoDiv.innerHTML = `<img src="https://via.placeholder.com/300x100?text=Purchased" alt="Purchased">`;
        const items = [];
        Object.keys(figures).forEach(s => {
            if (figures[s]) {
                figures[s].forEach(item => {
                    if (item.purchased) {
                        items.push({ ...item, series: s });
                    }
                });
            }
        });
        if (items.length === 0) {
            contentDiv.innerHTML = '<p class="no-items">No purchased items.</p>';
            return;
        }
        renderItems(items, figures, contentDiv);
    } else {
        // Series page: show logo and items
        seriesLogoDiv.innerHTML = `<img src="${seriesLogos[series] || 'https://via.placeholder.com/300x100?text=' + series}" alt="${series}">`;
        if (!figures[series] || figures[series].length === 0) {
            contentDiv.innerHTML = '<p class="no-items">No items found for this series.</p>';
            return;
        }
        renderItems(figures[series].map(item => ({ ...item, series })), figures, contentDiv);
    }
}

// Render items (figures/merch) horizontally
function renderItems(items, figures, contentDiv) {
    const itemGrid = document.createElement('div');
    itemGrid.className = 'item-grid';
    items.forEach(item => {
        const itemDiv = document.createElement('div');
        itemDiv.className = 'item-card';
        itemDiv.innerHTML = `
            <img src="${item.image}" alt="${item.name}">
            <h3>${item.name} ${item.pinned ? '📌' : ''}</h3>
            <p><strong>Type:</strong> ${item.type}</p>
            <p><strong>Set:</strong> ${item.set}</p>
            <p><strong>Company:</strong> ${item.company || 'N/A'}</p>
            <p><strong>Released:</strong> ${item.released}</p>
            <p><strong>Description:</strong> ${item.description}</p>
            <a href="${item.link}" target="_blank">Buy / View Listing</a>
            <button class="toggle-purchased" data-series="${item.series}" data-name="${item.name}">
                ${item.purchased ? 'Mark as Not Purchased' : 'Mark as Purchased'}
            </button>
            <button class="toggle-pinned" data-series="${item.series}" data-name="${item.name}">
                ${item.pinned ? 'Unpin' : 'Pin'}
            </button>
        `;
        itemGrid.appendChild(itemDiv);
    });
    contentDiv.appendChild(itemGrid);
}

// Update JSON (simulated, requires server for persistence)
function updateItem(figures, series, name, key, value) {
    if (figures[series]) {
        const item = figures[series].find(i => i.name === name);
        if (item) {
            item[key] = value;
            // Simulate saving to figures.json (needs server for real persistence)
            console.log('Updated:', figures);
            return true;
        }
    }
    return false;
}

// Initialize page
async function init() {
    const figures = await loadFigures();
    
    // Sidebar clicks
    document.querySelectorAll('.sidebar a[data-series]').forEach(link => {
        link.addEventListener('click', e => {
            e.preventDefault();
            const series = link.getAttribute('data-series');
            renderContent(series, figures);
        });
    });
    
    // Logo clicks (for landing page)
    document.addEventListener('click', e => {
        if (e.target.tagName === 'IMG' && e.target.hasAttribute('data-series')) {
            renderContent(e.target.getAttribute('data-series'), figures);
        }
    });
    
    // Toggle purchased/pinned
    document.addEventListener('click', e => {
        if (e.target.classList.contains('toggle-purchased')) {
            const series = e.target.getAttribute('data-series');
            const name = e.target.getAttribute('data-name');
            const item = figures[series].find(i => i.name === name);
            if (updateItem(figures, series, name, 'purchased', !item.purchased)) {
                renderContent(document.querySelector('.sidebar a.active')?.getAttribute('data-series') || 'All', figures);
            }
        } else if (e.target.classList.contains('toggle-pinned')) {
            const series = e.target.getAttribute('data-series');
            const name = e.target.getAttribute('data-name');
            const item = figures[series].find(i => i.name === name);
            if (updateItem(figures, series, name, 'pinned', !item.pinned)) {
                renderContent(document.querySelector('.sidebar a.active')?.getAttribute('data-series') || 'All', figures);
            }
        }
    });
    
    // Load All by default
    renderContent('All', figures);
}

init();