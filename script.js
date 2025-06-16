// Logo URLs (replace with your GitHub raw URLs)
const seriesLogos = {
    AirGear: 'https://raw.githubusercontent.com/Rokym/figure-tracker/refs/heads/main/images/banners/airgear.jpg',
    Bleach: 'https://raw.githubusercontent.com/Rokym/figure-tracker/refs/heads/main/images/banners/bleach.jpg',
    AttackOnTitan: 'https://raw.githubusercontent.com/Rokym/figure-tracker/refs/heads/main/images/banners/attackontitan_200.jpg',
    Berserk: 'https://raw.githubusercontent.com/Rokym/figure-tracker/refs/heads/main/images/banners/berserk.jpg',
    BlueLock: 'https://raw.githubusercontent.com/Rokym/figure-tracker/refs/heads/main/images/banners/bluelock.jpg',
    ChainsawMan: 'https://raw.githubusercontent.com/Rokym/figure-tracker/refs/heads/main/images/banners/chainsawman_200.jpg',
    CodeGeass: 'https://raw.githubusercontent.com/Rokym/figure-tracker/refs/heads/main/images/banners/codegeass_200.jpg',
    DeathNote: 'https://raw.githubusercontent.com/Rokym/figure-tracker/refs/heads/main/images/banners/deathnote_200.jpg',
    DemonSlayer: 'https://raw.githubusercontent.com/Rokym/figure-tracker/refs/heads/main/images/banners/demonslayer_200.jpg',
    DragonBallZ: 'https://raw.githubusercontent.com/Rokym/figure-tracker/refs/heads/main/images/banners/dragonballsuper_2000.jpg',
    FireForce: 'https://raw.githubusercontent.com/Rokym/figure-tracker/refs/heads/main/images/banners/fireforce_200.jpg',
    FullmetalAlchemist: 'https://raw.githubusercontent.com/Rokym/figure-tracker/refs/heads/main/images/banners/fullmetalalchemist_200.jpg',
    GurrenLagann: 'https://raw.githubusercontent.com/Rokym/figure-tracker/refs/heads/main/images/banners/gurrenlagann_200.jpg',
    Haikyu: 'https://raw.githubusercontent.com/Rokym/figure-tracker/refs/heads/main/images/banners/haikyu.jpg',
    HellsParadise: 'https://raw.githubusercontent.com/Rokym/figure-tracker/refs/heads/main/images/banners/hellsparadise_200.jpg',
    HunterXHunter: 'https://raw.githubusercontent.com/Rokym/figure-tracker/refs/heads/main/images/banners/hxh_200.jpg',
    JujutsuKaisen: 'https://raw.githubusercontent.com/Rokym/figure-tracker/refs/heads/main/images/banners/jujutsukaisen.jpg',
    KaijuNo8: 'https://raw.githubusercontent.com/Rokym/figure-tracker/refs/heads/main/images/banners/kaijuno8_200.jpg',
    KatekyoHitmanReborn: 'https://raw.githubusercontent.com/Rokym/figure-tracker/refs/heads/main/images/banners/katekyohitmanreborn_200.jpg',
    FinalFantasy: 'https://raw.githubusercontent.com/Rokym/figure-tracker/refs/heads/main/images/banners/finalfantasy7.png',
    KurokoNoBasket: 'https://raw.githubusercontent.com/Rokym/figure-tracker/refs/heads/main/images/banners/kurokonobasket_200-ezgif.com-gif-maker.jpg',
    Mashle: 'https://raw.githubusercontent.com/Rokym/figure-tracker/refs/heads/main/images/banners/mashle_2001.jpg',
    MobPsycho100: 'https://raw.githubusercontent.com/Rokym/figure-tracker/refs/heads/main/images/banners/mobpsycho100_200.jpg',
    Naruto: 'https://raw.githubusercontent.com/Rokym/figure-tracker/refs/heads/main/images/banners/Naruto_logo.svg.png',
    OnePiece: 'https://raw.githubusercontent.com/Rokym/figure-tracker/refs/heads/main/images/banners/onepiece_zoro.jpg',
    OnePunchMan: 'https://raw.githubusercontent.com/Rokym/figure-tracker/refs/heads/main/images/banners/onepunchman.jpg',
    SakamotoDays: 'https://raw.githubusercontent.com/Rokym/figure-tracker/refs/heads/main/images/banners/sakamotodays_200.jpg',
    ShangriLaFrontier: 'https://raw.githubusercontent.com/Rokym/figure-tracker/refs/heads/main/images/banners/shangrilafrontier_200.jpg',
    SoloLeveling: 'https://raw.githubusercontent.com/Rokym/figure-tracker/refs/heads/main/images/banners/sololeveling_arise.jpg',
    SoulEater: 'https://raw.githubusercontent.com/Rokym/figure-tracker/refs/heads/main/images/banners/souleater_200.jpg',
    TheGodOfHighSchool: 'https://raw.githubusercontent.com/Rokym/figure-tracker/refs/heads/main/images/banners/thegodofhighschool_200.jpg',
    TokyoGhoul: 'https://raw.githubusercontent.com/Rokym/figure-tracker/refs/heads/main/images/banners/tokyoghoul_200.jpg',
    TokyoRevengers: 'https://raw.githubusercontent.com/Rokym/figure-tracker/refs/heads/main/images/banners/tokyo-revengers.png',
    TowerOfGod: 'https://raw.githubusercontent.com/Rokym/figure-tracker/refs/heads/main/images/banners/towerofgod_200.jpg',
    UndeadUnluck: 'https://raw.githubusercontent.com/Rokym/figure-tracker/refs/heads/main/images/banners/undeadunluck.png',
    VinlandSaga: 'https://raw.githubusercontent.com/Rokym/figure-tracker/refs/heads/main/images/banners/vinlandsaga_200.jpg',
    WindBreaker: 'https://raw.githubusercontent.com/Rokym/figure-tracker/refs/heads/main/images/banners/windbreaker_200.jpg',
    YuYuHakusho: 'https://raw.githubusercontent.com/Rokym/figure-tracker/refs/heads/main/images/banners/yuyuhakusho_200.jpg',
    Zelda: 'https://raw.githubusercontent.com/Rokym/figure-tracker/refs/heads/main/images/banners/thelegendofzelda_200.jpg'
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
function renderContent(series, figures, searchQuery = '') {
    const seriesLogoDiv = document.getElementById('series-logo');
    const contentDiv = document.getElementById('content');
    
    // Clear previous content
    seriesLogoDiv.innerHTML = '';
    contentDiv.innerHTML = '';
    
    // Scroll to top
    window.scrollTo(0, 0);
    
    if (series === 'All') {
        if (searchQuery) {
            // Search results
            const results = searchItems(figures, searchQuery);
            seriesLogoDiv.innerHTML = `<img src="https://via.placeholder.com/300x100?text=Search+Results" alt="Search Results">`;
            if (results.length === 0) {
                contentDiv.innerHTML = '<p class="no-items">No items found.</p>';
                return;
            }
            renderItems(results, figures, contentDiv, series);
        } else {
            // Logo grid
            const logoGrid = document.createElement('div');
            logoGrid.className = 'logo-grid';
            Object.keys(figures).filter(s => s !== 'Purchased').forEach(s => {
                const logoDiv = document.createElement('div');
                logoDiv.className = 'logo-item';
                logoDiv.innerHTML = `<img src="${seriesLogos[s]}" alt="${s}" data-series="${s}">`;
                logoGrid.appendChild(logoDiv);
            });
            contentDiv.appendChild(logoGrid);
        }
    } else if (series === 'Purchased') {
        // Purchased page
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
        renderItems(items, figures, contentDiv, series);
    } else {
        // Series page
        seriesLogoDiv.innerHTML = `<img src="${seriesLogos[series] || 'https://via.placeholder.com/300x100?text=' + series}" alt="${series}">`;
        if (!figures[series] || figures[series].length === 0) {
            contentDiv.innerHTML = '<p class="no-items">No items found for this series.</p>';
            return;
        }
        renderItems(figures[series].map(item => ({ ...item, series })), figures, contentDiv, series);
    }
}

// Search items
function searchItems(figures, query) {
    query = query.toLowerCase();
    const results = [];
    Object.keys(figures).forEach(series => {
        if (series !== 'Purchased') {
            figures[series].forEach(item => {
                if (
                    item.name.toLowerCase().includes(query) ||
                    item.description.toLowerCase().includes(query) ||
                    item.set.toLowerCase().includes(query) ||
                    (item.company || '').toLowerCase().includes(query) ||
                    item.type.toLowerCase().includes(query)
                ) {
                    results.push({ ...item, series });
                }
            });
        }
    });
    return results;
}

// Render items with sort/filter
function renderItems(items, figures, contentDiv, series) {
    // Sort/filter controls
    const controlsDiv = document.createElement('div');
    controlsDiv.className = 'controls';
    controlsDiv.innerHTML = `
        <label>Sort by:
            <select id="sort-select">
                <option value="name-asc">Name (A-Z)</option>
                <option value="name-desc">Name (Z-A)</option>
                <option value="series-asc">Series (A-Z)</option>
                <option value="series-desc">Series (Z-A)</option>
                <option value="release-asc">Release Date (Oldest)</option>
                <option value="release-desc">Release Date (Newest)</option>
                <option value="type-asc">Type (A-Z)</option>
                <option value="type-desc">Type (Z-A)</option>
            </select>
        </label>
        <label><input type="checkbox" id="filter-figure" checked> Figure</label>
        <label><input type="checkbox" id="filter-manga" checked> Manga</label>
        <label><input type="checkbox" id="filter-merch" checked> Merch</label>
    `;
    contentDiv.appendChild(controlsDiv);
    
    // Item grid
    const itemGrid = document.createElement('div');
    itemGrid.className = 'item-grid';
    contentDiv.appendChild(itemGrid);
    
    // Apply sort/filter
    function updateItems() {
        let filteredItems = items.filter(item => {
            return (
                (document.getElementById('filter-figure').checked && item.type === 'figure') ||
                (document.getElementById('filter-manga').checked && item.type === 'manga') ||
                (document.getElementById('filter-merch').checked && item.type === 'merch')
            );
        });
        
        const sortValue = document.getElementById('sort-select').value;
        filteredItems.sort((a, b) => {
            if (sortValue === 'name-asc') return a.name.localeCompare(b.name);
            if (sortValue === 'name-desc') return b.name.localeCompare(a.name);
            if (sortValue === 'series-asc') return a.series.localeCompare(b.series);
            if (sortValue === 'series-desc') return b.series.localeCompare(a.series);
            if (sortValue === 'type-asc') return a.type.localeCompare(b.type);
            if (sortValue === 'type-desc') return b.type.localeCompare(a.type);
            if (sortValue === 'release-asc' || sortValue === 'release-desc') {
                const dateA = parseDate(a.released);
                const dateB = parseDate(b.released);
                return sortValue === 'release-asc' ? dateA - dateB : dateB - dateA;
            }
            return 0;
        });
        
        itemGrid.innerHTML = '';
        filteredItems.forEach(item => {
            const itemDiv = document.createElement('div');
            itemDiv.className = 'item-card';
            itemDiv.innerHTML = `
                <img src="${item.image}" alt="${item.name}">
                <h3>${item.name}</h3>
                <p><strong>Type:</strong> ${item.type}</p>
                <p><strong>Set:</strong> ${item.set}</p>
                <p><strong>Company:</strong> ${item.company || 'N/A'}</p>
                <p><strong>Released:</strong> ${item.released}</p>
                <p><strong>Description:</strong> ${item.description}</p>
                <a href="${item.link}" target="_blank">Buy / View Listing</a>
                <button class="toggle-purchased" data-series="${item.series}" data-name="${item.name}">
                    ${item.purchased ? 'Mark as Not Purchased' : 'Mark as Purchased'}
                </button>
            `;
            itemGrid.appendChild(itemDiv);
        });
    }
    
    // Parse release date (e.g., "10/2007" to Date)
    function parseDate(dateStr) {
        const [month, year] = dateStr.split('/');
        return new Date(parseInt(year), parseInt(month) - 1);
    }
    
    // Initial render
    updateItems();
    
    // Event listeners for sort/filter
    document.getElementById('sort-select').addEventListener('change', updateItems);
    document.getElementById('filter-figure').addEventListener('change', updateItems);
    document.getElementById('filter-manga').addEventListener('change', updateItems);
    document.getElementById('filter-merch').addEventListener('change', updateItems);
}

// Update item (in-memory)
function updateItem(figures, series, name, key, value) {
    if (figures[series]) {
        const item = figures[series].find(i => i.name === name);
        if (item) {
            item[key] = value;
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
            document.querySelectorAll('.sidebar a').forEach(a => a.classList.remove('active'));
            link.classList.add('active');
            renderContent(link.getAttribute('data-series'), figures);
        });
    });
    
    // Logo clicks
    document.addEventListener('click', e => {
        if (e.target.tagName === 'IMG' && e.target.hasAttribute('data-series')) {
            document.querySelectorAll('.sidebar a').forEach(a => a.classList.remove('active'));
            document.querySelector(`.sidebar a[data-series="${e.target.getAttribute('data-series')}"]`)?.classList.add('active');
            renderContent(e.target.getAttribute('data-series'), figures);
        }
    });
    
    // Toggle purchased
    document.addEventListener('click', e => {
        if (e.target.classList.contains('toggle-purchased')) {
            const series = e.target.getAttribute('data-series');
            const name = e.target.getAttribute('data-name');
            const item = figures[series].find(i => i.name === name);
            const confirmMsg = item.purchased
                ? 'Mark this item as not purchased?'
                : 'Mark this item as purchased?';
            if (window.confirm(confirmMsg)) {
                if (updateItem(figures, series, name, 'purchased', !item.purchased)) {
                    renderContent(document.querySelector('.sidebar a.active')?.getAttribute('data-series') || 'All', figures);
                }
            }
        }
    });
    
    // Search
    const searchBox = document.getElementById('search-box');
    searchBox.addEventListener('input', () => {
        const query = searchBox.value.trim();
        document.querySelectorAll('.sidebar a').forEach(a => a.classList.remove('active'));
        document.querySelector('.sidebar a[data-series="All"]').classList.add('active');
        renderContent('All', figures, query);
    });
    
    // Load All by default
    document.querySelector('.sidebar a[data-series="All"]').classList.add('active');
    renderContent('All', figures);
}

init();