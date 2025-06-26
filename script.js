// Logo URLs and customizations for series banners
const seriesLogos = {
    AirGear: { url: 'https://raw.githubusercontent.com/Rokym/figure-tracker/main/images/banners/airgear.jpg', size: 'medium', color: 'default' },
    Bleach: { url: 'https://raw.githubusercontent.com/Rokym/figure-tracker/main/images/banners/bleach.jpg', size: 'large', color: 'bleach' },
    AttackOnTitan: { url: 'https://raw.githubusercontent.com/Rokym/figure-tracker/main/images/banners/attackontitan_200.jpg', size: 'medium', color: 'default' },
    Berserk: { url: 'https://raw.githubusercontent.com/Rokym/figure-tracker/main/images/banners/berserk.jpg', size: 'medium', color: 'default' },
    BlueLock: { url: 'https://raw.githubusercontent.com/Rokym/figure-tracker/main/images/banners/bluelock.jpg', size: 'medium', color: 'default' },
    ChainsawMan: { url: 'https://raw.githubusercontent.com/Rokym/figure-tracker/main/images/banners/chainsawman_200.jpg', size: 'medium', color: 'default' },
    CodeGeass: { url: 'https://raw.githubusercontent.com/Rokym/figure-tracker/refs/heads/main/images/banners/codegeass1.png', size: 'large', color: 'default' },
    DeathNote: { url: 'https://raw.githubusercontent.com/Rokym/figure-tracker/refs/heads/main/images/banners/deathnote1.jpg', size: 'medium', color: 'default' },
    DemonSlayer: { url: 'https://raw.githubusercontent.com/Rokym/figure-tracker/main/images/banners/demonslayer_200.jpg', size: 'small', color: 'default' },
    DragonBallZ: { url: 'https://raw.githubusercontent.com/Rokym/figure-tracker/main/images/banners/dragonballsuper_2000.jpg', size: 'medium', color: 'default' },
    FireForce: { url: 'https://raw.githubusercontent.com/Rokym/figure-tracker/main/images/banners/fireforce_200.jpg', size: 'small', color: 'default' },
    FullmetalAlchemist: { url: 'https://raw.githubusercontent.com/Rokym/figure-tracker/main/images/banners/fullmetalalchemist_200.jpg', size: 'medium', color: 'default' },
    GurrenLagann: { url: 'https://raw.githubusercontent.com/Rokym/figure-tracker/main/images/banners/gurrenlagann_200.jpg', size: 'medium', color: 'default' },
    Haikyu: { url: 'https://raw.githubusercontent.com/Rokym/figure-tracker/main/images/banners/haikyu.jpg', size: 'medium', color: 'default' },
    HellsParadise: { url: 'https://raw.githubusercontent.com/Rokym/figure-tracker/main/images/banners/hellsparadise_200.jpg', size: 'medium', color: 'default' },
    HunterXHunter: { url: 'https://raw.githubusercontent.com/Rokym/figure-tracker/main/images/banners/hxh_200.jpg', size: 'medium', color: 'default' },
    JujutsuKaisen: { url: 'https://raw.githubusercontent.com/Rokym/figure-tracker/main/images/banners/jujutsukaisen.jpg', size: 'large', color: 'default' },
    KaijuNo8: { url: 'https://raw.githubusercontent.com/Rokym/figure-tracker/main/images/banners/kaijuno8_200.jpg', size: 'medium', color: 'default' },
    KatekyoHitmanReborn: { url: 'https://raw.githubusercontent.com/Rokym/figure-tracker/main/images/banners/katekyohitmanreborn_200.jpg', size: 'medium', color: 'default' },
    FinalFantasy: { url: 'https://raw.githubusercontent.com/Rokym/figure-tracker/main/images/banners/finalfantasy7.png', size: 'medium', color: 'default' },
    KurokoNoBasket: { url: 'https://raw.githubusercontent.com/Rokym/figure-tracker/refs/heads/main/images/banners/kurokonobasket1.jpg', size: 'medium', color: 'default' },
    Mashle: { url: 'https://raw.githubusercontent.com/Rokym/figure-tracker/main/images/banners/mashle_2001.jpg', size: 'medium', color: 'default' },
    MobPsycho100: { url: 'https://raw.githubusercontent.com/Rokym/figure-tracker/main/images/banners/mobpsycho100_200.jpg', size: 'medium', color: 'default' },
    Naruto: { url: 'https://raw.githubusercontent.com/Rokym/figure-tracker/main/images/banners/Naruto_logo.svg.png', size: 'large', color: 'naruto' },
    OnePiece: { url: 'https://raw.githubusercontent.com/Rokym/figure-tracker/main/images/banners/onepiece_zoro.jpg', size: 'medium', color: 'default' },
    OnePunchMan: { url: 'https://raw.githubusercontent.com/Rokym/figure-tracker/main/images/banners/onepunchman.jpg', size: 'medium', color: 'default' },
    SakamotoDays: { url: 'https://raw.githubusercontent.com/Rokym/figure-tracker/main/images/banners/sakamotodays_200.jpg', size: 'medium', color: 'default' },
    ShangriLaFrontier: { url: 'https://raw.githubusercontent.com/Rokym/figure-tracker/main/images/banners/shangrilafrontier_200.jpg', size: 'medium', color: 'default' },
    SoloLeveling: { url: 'https://raw.githubusercontent.com/Rokym/figure-tracker/main/images/banners/sololeveling_arise.jpg', size: 'medium', color: 'default' },
    SoulEater: { url: 'https://raw.githubusercontent.com/Rokym/figure-tracker/main/images/banners/souleater_200.jpg', size: 'medium', color: 'default' },
    TheGodOfHighSchool: { url: 'https://raw.githubusercontent.com/Rokym/figure-tracker/main/images/banners/thegodofhighschool_200.jpg', size: 'medium', color: 'default' },
    TokyoGhoul: { url: 'https://raw.githubusercontent.com/Rokym/figure-tracker/main/images/banners/tokyoghoul_200.jpg', size: 'medium', color: 'default' },
    TokyoRevengers: { url: 'https://raw.githubusercontent.com/Rokym/figure-tracker/main/images/banners/tokyo-revengers.png', size: 'medium', color: 'default' },
    TowerOfGod: { url: 'https://raw.githubusercontent.com/Rokym/figure-tracker/main/images/banners/towerofgod_200.jpg', size: 'medium', color: 'default' },
    UndeadUnluck: { url: 'https://raw.githubusercontent.com/Rokym/figure-tracker/main/images/banners/undeadunluck.png', size: 'medium', color: 'default' },
    VinlandSaga: { url: 'https://raw.githubusercontent.com/Rokym/figure-tracker/main/images/banners/vinlandsaga_200.jpg', size: 'medium', color: 'default' },
    WindBreaker: { url: 'https://raw.githubusercontent.com/Rokym/figure-tracker/main/images/banners/windbreaker_200.jpg', size: 'medium', color: 'default' },
    YuYuHakusho: { url: 'https://raw.githubusercontent.com/Rokym/figure-tracker/refs/heads/main/images/banners/yuyuhakusho1.png', size: 'medium', color: 'default' },
    Zelda: { url: 'https://raw.githubusercontent.com/Rokym/figure-tracker/main/images/banners/thelegendofzelda_200.jpg', size: 'medium', color: 'default' }
};

// Load figures.json data
async function loadFigures() {
    try {
        const response = await fetch('figures.json');
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        return await response.json();
    } catch (error) {
        console.error('Error loading figures.json:', error);
        return {};
    }
}

// Save current state to sessionStorage
function saveState(series, query, scrollPosition) {
    sessionStorage.setItem('currentSeries', series);
    sessionStorage.setItem('searchQuery', query || '');
    sessionStorage.setItem('scrollPosition', scrollPosition);
}

// Restore state from sessionStorage
function restoreState() {
    return {
        series: sessionStorage.getItem('currentSeries') || 'All',
        query: sessionStorage.getItem('searchQuery') || '',
        scrollPosition: parseFloat(sessionStorage.getItem('scrollPosition')) || 0
    };
}

// Render content based on series
function renderContent(series, figures, searchQuery = '') {
    const seriesLogoDiv = document.getElementById('series-logo');
    const contentDiv = document.getElementById('content');
    
    // Clear previous content
    seriesLogoDiv.innerHTML = '';
    contentDiv.innerHTML = '';
    
    if (series === 'All') {
        if (searchQuery) {
            // Render search results
            const results = searchItems(figures, searchQuery);
            seriesLogoDiv.innerHTML = `<img src="https://via.placeholder.com/400x100?text=Search+Results" alt="Search Results">`;
            if (results.length === 0) {
                contentDiv.innerHTML = '<p class="no-items">No items found.</p>';
                saveState(series, searchQuery, 0);
                return;
            }
            renderItems(results, figures, contentDiv, series, true);
        } else {
            // Render logo grid for All page
            const logoGrid = document.createElement('div');
            logoGrid.className = 'logo-grid';
            Object.keys(figures).filter(s => s !== 'Purchased').forEach(s => {
                const logoCard = document.createElement('div');
                logoCard.className = 'logo-card';
                logoCard.setAttribute('data-color', seriesLogos[s]?.color || 'default');
                logoCard.innerHTML = `
                    <img src="${seriesLogos[s]?.url || 'https://via.placeholder.com/250'}" alt="${s}" data-series="${s}" data-size="${seriesLogos[s]?.size || 'medium'}">
                `;
                logoGrid.appendChild(logoCard);
            });
            contentDiv.appendChild(logoGrid);
            saveState(series, searchQuery, 0);
        }
    } else if (series === 'Purchased') {
        // Render purchased items
        seriesLogoDiv.innerHTML = `<img src="https://via.placeholder.com/400x100?text=Purchased" alt="Purchased">`;
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
            saveState(series, searchQuery, 0);
            return;
        }
        renderItems(items, figures, contentDiv, series, false);
    } else {
        // Render individual series page
        seriesLogoDiv.innerHTML = `<img src="${seriesLogos[series]?.url || 'https://via.placeholder.com/400x100?text=' + series}" alt="${series}">`;
        if (!figures[series] || figures[series].length === 0) {
            contentDiv.innerHTML = '<p class="no-items">No items found for this series.</p>';
            saveState(series, searchQuery, 0);
            return;
        }
        renderItems(figures[series].map(item => ({ ...item, series })), figures, contentDiv, series, false);
    }
}

// Search items based on query
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

// Render items with controls
function renderItems(items, figures, contentDiv, series, isSearch = false) {
    // Create controls for sorting and filtering
    const controlsDiv = document.createElement('div');
    controlsDiv.className = 'controls';
    controlsDiv.innerHTML = `
        <label>Sort by:
            <select id="sort-select">
                <option value="name-asc">Name (A-Z)</option>
                <option value="name-desc">Name (Z-A)</option>
                <option value="release-asc">Release Date (Oldest)</option>
                <option value="release-desc">Release Date (Newest)</option>
            </select>
        </label>
        <div class="filter-container">
            <button class="filter-icon"><i class="fas fa-filter"></i> Filter</button>
            <div class="filter-dropdown">
                <label><input type="checkbox" id="filter-figure" name="filter-type" value="figure" checked> Figure</label>
                <label><input type="checkbox" id="filter-manga" name="filter-type" value="manga" checked> Manga</label>
                <label><input type="checkbox" id="filter-merch" name="filter-type" value="merch" checked> Merch</label>
            </div>
        </div>
        <label>
            Columns:
            <select id="column-select">
                <option value="6">6 Columns</option>
                <option value="5">5 Columns</option>
            </select>
        </label>
    `;
    contentDiv.appendChild(controlsDiv);
    
    // Create item grid
    const itemGrid = document.createElement('div');
    itemGrid.className = 'item-grid';
    contentDiv.appendChild(itemGrid);
    
    // Update items based on filters and sorting
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
            if (sortValue === 'name-desc') return b.name.localeCompare(b.name);
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
                <img src="${item.image}" alt="${item.name}" class="figure-image">
                ${!isSearch && series !== 'All' ? '<hr class="card-divider">' : ''}
                <h3>${item.name}</h3>
                <p><strong>Type:</strong> ${item.type}</p>
                <p><strong>Set:</strong> ${item.set}</p>
                <p><strong>Company:</strong> ${item.company || 'N/A'}</p>
                <p><strong>Released:</strong> ${item.released}</p>
                <p class="description">${item.description}</p>
                <a href="${item.link}" target="_blank">Buy / View Listing</a>
                <button class="show-more">Show More</button>
                <button class="toggle-purchased" data-series="${item.series}" data-name="${item.name}">
                    ${item.purchased ? 'Mark as Not Purchased' : 'Mark as Purchased'}
                </button>
            `;
            itemGrid.appendChild(itemDiv);
            
            // Handle description show/hide
            const desc = itemDiv.querySelector('.description');
            const showMore = itemDiv.querySelector('.show-more');
            if (desc.scrollHeight <= desc.clientHeight) {
                showMore.style.display = 'none';
            } else {
                showMore.addEventListener('click', () => {
                    if (desc.classList.contains('expanded')) {
                        desc.classList.remove('expanded');
                        showMore.textContent = 'Show More';
                    } else {
                        desc.classList.add('expanded');
                        showMore.textContent = 'Show Less';
                    }
                });
            }
            
            // Handle image zoom
            const img = itemDiv.querySelector('.figure-image');
            img.addEventListener('click', () => {
                const overlay = document.createElement('div');
                overlay.className = 'zoom-overlay';
                overlay.innerHTML = `
                    <img src="${item.image}" alt="${item.name}">
                    <button class="close-btn">×</button>
                `;
                document.body.appendChild(overlay);
                
                overlay.addEventListener('click', (e) => {
                    if (e.target === overlay) {
                        overlay.remove();
                    }
                });
                
                overlay.querySelector('.close-btn').addEventListener('click', () => {
                    overlay.remove();
                });
            });
        });
        
        // Update columns
        const columns = document.getElementById('column-select').value;
        itemGrid.classList.toggle('five-columns', columns === '6');
        
        // Save scroll position
        contentDiv.addEventListener('scroll', () => {
            saveState(series, document.getElementById('search-box').value, contentDiv.scrollTop);
        }, { once: true });
    }
    
    // Parse release date for sorting
    function parseDate(dateStr) {
        const [month, year] = dateStr.split('/');
        return new Date(parseInt(year) || 0, parseInt(month) - 1 || 0);
    }
    
    // Toggle filter dropdown
    const filterIcon = controlsDiv.querySelector('.filter-icon');
    const filterDropdown = controlsDiv.querySelector('.filter-dropdown');
    filterIcon.addEventListener('click', () => {
        filterDropdown.classList.toggle('show');
    });
    
    // Close dropdown when clicking outside
    document.addEventListener('click', (e) => {
        if (!filterIcon.contains(e.target) && !filterDropdown.contains(e.target)) {
            filterDropdown.classList.remove('show');
        }
    });
    
    // Update items on filter/sort/column change
    document.getElementById('filter-figure').addEventListener('change', updateItems);
    document.getElementById('filter-manga').addEventListener('change', updateItems);
    document.getElementById('filter-merch').addEventListener('change', updateItems);
    document.getElementById('sort-select').addEventListener('change', updateItems);
    document.getElementById('column-select').addEventListener('change', updateItems);
    
    // Initial render
    updateItems();
}

// Update item in-memory
function updateItem(figures, series, name, key, value) {
    if (figures[series]) {
        const item = figures[series].find(i => i.name === name);
        if (item) {
            item[key] = value;
            return true;
        }
    }
    return false;
}

// Initialize page
async function init() {
    const figures = await loadFigures();
    
    // Toggle sidebar on hamburger click
    const hamburger = document.getElementById('hamburger');
    const sidebar = document.getElementById('sidebar');
    hamburger.addEventListener('click', () => {
        sidebar.classList.toggle('active');
    });
    
    // Close sidebar when clicking a link
    document.querySelectorAll('.sidebar a[data-series]').forEach(link => {
        link.addEventListener('click', () => {
            sidebar.classList.remove('active');
        });
    });
    
    // Handle sidebar and title link clicks
    document.querySelectorAll('.sidebar a[data-series], .top-left-text[data-series]').forEach(link => {
        link.addEventListener('click', e => {
            e.preventDefault();
            document.querySelectorAll('.sidebar a').forEach(a => a.classList.remove('active'));
            const series = link.getAttribute('data-series');
            document.querySelector(`.sidebar a[data-series="${series}"]`)?.classList.add('active');
            renderContent(series, figures);
            saveState(series, '', 0);
        });
    });
    
    // Handle logo clicks
    document.addEventListener('click', e => {
        if (e.target.tagName === 'IMG' && e.target.hasAttribute('data-series')) {
            document.querySelectorAll('.sidebar a').forEach(a => a.classList.remove('active'));
            const series = e.target.getAttribute('data-series');
            document.querySelector(`.sidebar a[data-series="${series}"]`)?.classList.add('active');
            renderContent(series, figures);
            saveState(series, '', 0);
            sidebar.classList.remove('active');
        }
    });
    
    // Handle purchased toggle
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
                    const currentSeries = document.querySelector('.sidebar a.active')?.getAttribute('data-series') || 'All';
                    renderContent(currentSeries, figures, document.getElementById('search-box').value);
                    saveState(currentSeries, document.getElementById('search-box').value, document.getElementById('content').scrollTop);
                }
            }
        }
    });
    
    // Handle search input
    const searchBox = document.getElementById('search-box');
    searchBox.addEventListener('input', () => {
        const query = searchBox.value.trim();
        document.querySelectorAll('.sidebar a').forEach(a => a.classList.remove('active'));
        document.querySelector('.sidebar a[data-series="All"]').classList.add('active');
        renderContent('All', figures, query);
        saveState('All', query, 0);
    });
    
    // Restore state or load default
    const { series, query, scrollPosition } = restoreState();
    document.querySelectorAll('.sidebar a').forEach(a => a.classList.remove('active'));
    document.querySelector(`.sidebar a[data-series="${series}"]`)?.classList.add('active');
    searchBox.value = query;
    renderContent(series, figures, query);
    setTimeout(() => {
        document.getElementById('content').scrollTop = scrollPosition;
    }, 0);
}

init();