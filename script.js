class GalleryFilter {
    filtersSelector = ".cs-button";
    imagesSelector = ".cs-listing";
    activeClass = "cs-active";
    hiddenClass = "cs-hidden";
    hiddenDividerClass = "cs-hidden-divider";
    expandedClass = "cs-expanded";
    isImagePopupsSetup = false;
    originalSectionOrder = [];

    constructor() {
        console.log('Initializing GalleryFilter at:', new Date().toLocaleString());
        this.$modal = document.createElement('div');
        this.$modal.id = 'myModal';
        this.$modal.className = 'modal';
        this.$modal.setAttribute('style', 'display: none !important;');
        this.$modal.innerHTML = `
            <span class="close" tabindex="0" aria-label="Close modal">×</span>
            <img class="modal-content" id="img01" loading="lazy" decoding="async">
            <div id="caption"></div>
        `;
        document.body.insertBefore(this.$modal, document.body.firstChild);
        console.log('Modal created and prepended to body, initial display: none');

        this.$modalImg = this.$modal.querySelector('#img01');
        this.$captionText = this.$modal.querySelector('#caption');
        this.$modalClose = this.$modal.querySelector('.close');
        this.$modalClose.addEventListener('click', this.handleCloseClick.bind(this));
        this.$modalClose.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                this.handleCloseClick(e);
                console.log('Modal closed: Enter or Space on close button');
            }
        });
        console.log('Close button event listeners added');

        this.$buttonGroup = document.querySelector('.cs-button-group');
        this.$listingWrapper = document.querySelector('.cs-listing-wrapper');
        this.$searchSelect = document.querySelector('.cs-search-select');

        // Create search input
        this.$searchInput = document.createElement('input');
        this.$searchInput.type = 'text';
        this.$searchInput.className = 'cs-search-input';
        this.$searchInput.placeholder = 'Search figures...';
        this.$searchInput.setAttribute('aria-label', 'Search figures by name');
        this.$buttonGroup.insertBefore(this.$searchInput, this.$searchSelect.parentElement);
        console.log('Search input created and prepended to button group');

        // Create clear search button
        this.$clearButton = document.createElement('button');
        this.$clearButton.className = 'cs-clear-search';
        this.$clearButton.textContent = '×';
        this.$clearButton.setAttribute('aria-label', 'Clear search');
        this.$clearButton.style.display = 'none';
        this.$buttonGroup.insertBefore(this.$clearButton, this.$searchSelect.parentElement);
        console.log('Clear search button created and inserted before select');

        // Debug DOM elements
        console.log('DOM elements:', {
            buttonGroup: !!this.$buttonGroup,
            listingWrapper: !!this.$listingWrapper,
            searchSelect: !!this.$searchSelect,
            searchInput: !!this.$searchInput,
            clearButton: !!this.$clearButton
        });

        if (!this.$listingWrapper || !this.$searchSelect || !this.$buttonGroup || !this.$searchInput || !this.$clearButton) {
            console.error('Required DOM elements missing. Check index.html structure.');
            this.$listingWrapper.innerHTML = '<p style="color: var(--text-color); text-align: center;">Error: Required elements (button group, listing wrapper, select, search input, or clear button) not found. Check HTML structure.</p>';
            return;
        }

        // Create Back to Top button
        this.$backToTop = document.createElement('button');
        this.$backToTop.className = 'cs-back-to-top';
        this.$backToTop.textContent = 'Top';
        this.$backToTop.setAttribute('aria-label', 'Scroll back to top');
        document.querySelector('#collection-1602').appendChild(this.$backToTop);
        console.log('Back to Top button created and appended to #collection-1602');

        // Set up scroll event for Back to Top button
        window.addEventListener('scroll', () => {
            const scrollPosition = window.scrollY;
            if (scrollPosition > 100) {
                this.$backToTop.classList.add('visible');
                console.log('Back to Top button shown, scrollY:', scrollPosition);
            } else {
                this.$backToTop.classList.remove('visible');
                console.log('Back to Top button hidden, scrollY:', scrollPosition);
            }
        });
        console.log('Scroll event listener added for Back to Top button');

        // Set up click event for Back to Top
        this.$backToTop.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
            console.log('Back to Top clicked, scrolling to top');
        });
        console.log('Click event listener added for Back to Top button');

        // Set up search input event
        this.$searchInput.addEventListener('input', () => {
            const query = this.$searchInput.value.trim().toLowerCase();
            this.$clearButton.style.display = query ? 'inline-block' : 'none';
            console.log('Search input changed:', query, 'Clear button display:', this.$clearButton.style.display);
            this.filter(this.$activeFilter?.dataset.filter || 'all', query);
        });
        console.log('Search input event listener added');

        // Set up clear search button event
        this.$clearButton.addEventListener('click', () => {
            this.$searchInput.value = '';
            this.$clearButton.style.display = 'none';
            console.log('Clear search button clicked, input cleared');
            this.filter(this.$activeFilter?.dataset.filter || 'all', '');
        });
        console.log('Clear search button event listener added');

        // Set up event delegation for .cs-show-more clicks
        this.$listingWrapper.addEventListener('click', (e) => {
            const button = e.target.closest('.cs-show-more');
            if (button) {
                const item = button.closest('.cs-item:not(.cs-logo-item)');
                if (item) {
                    this.handleShowMoreClick(item, e);
                    console.log(`Delegated click on Show More for card: ${item.querySelector('.cs-name')?.textContent || 'Unknown'}`);
                }
            }
        });
        console.log('Event delegation set up for .cs-show-more clicks on .cs-listing-wrapper');

        // Set up select change event
        this.$searchSelect.addEventListener('change', () => {
            const value = this.$searchSelect.value;
            console.log('Select changed:', value);
            this.filter(value || 'all', this.$searchInput.value.trim().toLowerCase());
            // Update active filter for "All" button
            this.$filters = document.querySelectorAll(this.filtersSelector);
            this.$activeFilter = Array.from(this.$filters).find(f => f.dataset.filter === (value !== 'all' ? `series-${value}` : 'all')) || this.$filters[0];
            this.$filters.forEach(f => f.classList.remove(this.activeClass));
            if (value === 'all') {
                this.$activeFilter.classList.add(this.activeClass);
                console.log('Active filter set to All via select change');
            }
        });
        console.log('Select change event listener added');

        // Load figures and initialize
        this.loadFigures().then(figures => {
            this.figures = figures;
            if (!figures || !Object.keys(figures).length) {
                console.error('No figures loaded from figures.json. File may be empty or invalid.');
                this.$listingWrapper.innerHTML = '<p style="color: var(--text-color); text-align: center;">No figures loaded. Ensure figures.json exists and contains valid data (e.g., {"Naruto":{"logo":"url","figures":[{"name":"Naruto Uzumaki","image":"url"}]}}).</p>';
                return;
            }

            console.log('Loaded series:', Object.keys(figures).sort());

            this.renderDropdown(figures);
            this.renderAllListings(figures);
            this.$images = document.querySelectorAll(this.imagesSelector) || [];
            console.log('Listings after render:', this.$images.length, Array.from(this.$images).map(img => img.dataset.category));

            if (this.$images.length === 0) {
                console.error('No listings rendered. Check figures.json or renderAllListings logic.');
                this.$listingWrapper.innerHTML = '<p style="color: var(--text-color); text-align: center;">No listings rendered. Ensure figures.json contains valid series and figures.</p>';
                return;
            }

            // Set up filter buttons after confirming listings exist
            this.$filters = document.querySelectorAll(this.filtersSelector);
            console.log('Filters found:', this.$filters.length);

            if (this.$filters.length > 0) {
                this.$activeFilter = Array.from(this.$filters).find(f => f.dataset.filter === 'all') || this.$filters[0];
                this.$activeFilter.classList.add(this.activeClass);
                console.log('Active filter set:', this.$activeFilter.dataset.filter);
            }
            for (const $filter of this.$filters) {
                $filter.removeEventListener('click', this.onClick);
                $filter.addEventListener('click', () => this.onClick($filter));
            }

            // Only filter after listings are confirmed
            this.filter('all');

            this.setupImagePopups();
            this.setupOutsideClick();
            console.log('Initial card count:', document.querySelectorAll('.cs-item').length);
            console.log('Listing wrapper width:', window.getComputedStyle(this.$listingWrapper).width);
        }).catch(error => {
            console.error('Initialization failed:', error.message);
            this.$listingWrapper.innerHTML = '<p style="color: var(--text-color); text-align: center;">Failed to initialize gallery: ' + error.message + '. Ensure figures.json exists, is accessible, and is valid JSON (e.g., {"Naruto":{"logo":"url","figures":[{"name":"Naruto Uzumaki","image":"url"}]}}).</p>';
        });
    }

    async loadFigures() {
        try {
            console.log('Fetching figures.json at:', new Date().toLocaleString());
            const response = await fetch('figures.json', { cache: 'no-cache' });
            console.log('Fetch response:', {
                url: response.url,
                status: response.status,
                statusText: response.statusText,
                ok: response.ok
            });
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}, URL: ${response.url}, Status Text: ${response.statusText}`);
            }
            const data = await response.json();
            console.log('Raw figures.json data:', JSON.stringify(data, null, 2));
            if (!data || typeof data !== 'object') {
                throw new Error('Invalid figures.json: Data is not an object');
            }
            const seriesCount = Object.keys(data).length;
            if (seriesCount === 0) {
                throw new Error('figures.json is empty');
            }
            console.log('Figures loaded successfully. Series count:', seriesCount, 'Series:', Object.keys(data).sort());
            return data;
        } catch (error) {
            console.error('Error loading figures.json:', error.message);
            if (error.message.includes('Failed to fetch')) {
                console.error('Possible causes: figures.json not found, server not running, CORS issue, or network error.');
            }
            this.$listingWrapper.innerHTML = '<p style="color: var(--text-color); text-align: center;">Failed to load figures.json: ' + error.message + '. Ensure the file exists in the project root, is accessible, and is valid JSON (e.g., {"Naruto":{"logo":"url","figures":[{"name":"Naruto Uzumaki","image":"url"}]}}).</p>';
            return {};
        }
    }

    renderDropdown(figures) {
        this.$searchSelect.innerHTML = '<option value="all">All Series</option>';
        const seriesNames = Object.keys(figures).sort();
        seriesNames.forEach(series => {
            const option = document.createElement('option');
            option.value = series;
            option.textContent = series;
            this.$searchSelect.appendChild(option);
            console.log(`Select option added for series: ${series}`);
        });
        console.log('Select options rendered:', this.$searchSelect.children.length);

        // Dynamically set select width based on longest series name
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        context.font = '1.1rem sans-serif';
        const longestName = seriesNames.reduce((a, b) => a.length > b.length ? a : b, 'All Series');
        const textWidth = context.measureText(longestName).width;
        const selectWidth = Math.min(Math.max(textWidth + 50, 200), 300);
        this.$searchSelect.style.width = `${selectWidth}px`;
        console.log(`Select width set to ${selectWidth}px for longest series: ${longestName}`);

        // Add Pinned filter button
        const pinnedButton = document.createElement('button');
        pinnedButton.className = 'cs-button';
        pinnedButton.dataset.filter = 'pinned';
        pinnedButton.textContent = 'Pinned';
        this.$buttonGroup.insertBefore(pinnedButton, this.$searchSelect.parentElement);
        console.log('Pinned filter button added');
    }

    renderAllListings(figures) {
        this.$listingWrapper.innerHTML = '';
        this.originalSectionOrder = [];
        console.log('Cleared cs-listing-wrapper to prevent duplication');

        Object.keys(figures).forEach(series => {
            if (!figures[series] || !figures[series].figures || !Array.isArray(figures[series].figures)) {
                console.warn(`Skipping invalid series: ${series} (missing or invalid figures array)`);
                return;
            }
            const listing = document.createElement('div');
            listing.className = `cs-listing cs-hidden`;
            listing.dataset.category = `series-${series}`;

            const logoItem = document.createElement('div');
            logoItem.className = 'cs-item cs-logo-item';
            const logoUrl = figures[series].logo || 'https://placehold.co/280x112?text=Logo+Missing';
            logoItem.innerHTML = `<img class="cs-series-logo" src="${logoUrl}" alt="${series} Logo">`;
            listing.appendChild(logoItem);
            console.log(`Rendered logo for ${series}: ${logoUrl}`);

            figures[series].figures.forEach(figure => {
                if (!figure.name || !figure.image) {
                    console.warn(`Invalid figure in ${series}:`, figure);
                    return;
                }
                console.log(`Rendering figure for ${series}: ${figure.name}, Image: ${figure.image}`);
                const item = document.createElement('div');
                item.className = 'cs-item';
                item.dataset.name = figure.name.toLowerCase();
                item.dataset.pinned = figure.pinned ? 'true' : 'false';
                const buyNowLink = figure.link
                    ? `<a class="cs-buy-now" href="${figure.link}" target="_blank" aria-label="Buy ${figure.name} now" data-tooltip="Go to purchase page">Buy Now</a>`
                    : `<button class="cs-buy-now" disabled data-tooltip="No purchase link available">Buy Now</button>`;
                item.innerHTML = `
                    <div class="cs-picture-group">
                        <picture class="cs-picture">
                            <img loading="lazy" decoding="async" src="${figure.image}" alt="${figure.name}" width="280" height="513" onerror="this.src='https://placehold.co/280x513?text=Image+Failed'" class="clickable-image">
                        </picture>
                    </div>
                    <div class="cs-overlay">
                        <h3 class="cs-name">${figure.name}</h3>
                        <button class="cs-show-more" aria-expanded="false">Show More Info</button>
                    </div>
                    <div class="cs-details-overlay">
                        <div class="cs-details-content">
                            <p><strong>Set:</strong> ${figure.set || 'N/A'}</p>
                            <p><strong>Company:</strong> ${figure.company || 'N/A'}</p>
                            <p><strong>Release Date:</strong> ${figure.released || 'N/A'}</p>
                            <p><strong>Description:</strong> ${figure.description || 'No description available'}</p>
                            <p class="cs-pinned"><strong>Pinned:</strong> ${figure.pinned ? 'Yes' : 'No'}</p>
                            ${buyNowLink}
                        </div>
                    </div>
                    <div class="cs-info-panel">
                        <p><strong>Set:</strong> ${figure.set || 'N/A'}</p>
                        <p><strong>Company:</strong> ${figure.company || 'N/A'}</p>
                        <p><strong>Release Date:</strong> ${figure.released || 'N/A'}</p>
                        <p><strong>Description:</strong> ${figure.description || 'No description available'}</p>
                        <p class="cs-pinned"><strong>Pinned:</strong> ${figure.pinned ? 'Yes' : 'No'}</p>
                    </div>
                `;
                listing.appendChild(item);
            });
            this.$listingWrapper.appendChild(listing);
            console.log(`Series listing rendered: series-${series}, items: ${listing.querySelectorAll('.cs-item').length}`);
        });

        const allListing = document.createElement('div');
        allListing.className = `cs-listing cs-hidden`;
        allListing.dataset.category = 'all';

        const sortedSeries = Object.keys(figures).sort();
        sortedSeries.forEach((series, index) => {
            if (!figures[series] || !figures[series].figures || !Array.isArray(figures[series].figures)) {
                console.warn(`Skipping invalid series in all listing: ${series}`);
                return;
            }
            const seriesSection = document.createElement('section');
            seriesSection.className = 'cs-series-section';
            seriesSection.dataset.category = series;

            const logoItem = document.createElement('div');
            logoItem.className = 'cs-item cs-logo-item';
            const logoUrl = figures[series].logo || 'https://placehold.co/280x112?text=Logo+Missing';
            logoItem.innerHTML = `<img class="cs-series-logo" src="${logoUrl}" alt="${series} Logo">`;
            seriesSection.appendChild(logoItem);
            console.log(`Rendered all logo for ${series}: ${logoUrl}`);

            const figuresToShow = figures[series].figures.slice(0, index === 0 ? 5 : figures[series].figures.length);
            figuresToShow.forEach(figure => {
                if (!figure.name || !figure.image) {
                    console.warn(`Invalid figure in ${series} (all listing):`, figure);
                    return;
                }
                console.log(`Rendering all figure for ${series}: ${figure.name}, Image: ${figure.image}`);
                const item = document.createElement('div');
                item.className = 'cs-item';
                item.dataset.name = figure.name.toLowerCase();
                item.dataset.pinned = figure.pinned ? 'true' : 'false';
                const buyNowLink = figure.link
                    ? `<a class="cs-buy-now" href="${figure.link}" target="_blank" aria-label="Buy ${figure.name} now" data-tooltip="Go to purchase page">Buy Now</a>`
                    : `<button class="cs-buy-now" disabled data-tooltip="No purchase link available">Buy Now</button>`;
                item.innerHTML = `
                    <div class="cs-picture-group">
                        <picture class="cs-picture">
                            <img loading="lazy" decoding="async" src="${figure.image}" alt="${figure.name}" width="280" height="513" onerror="this.src='https://placehold.co/280x513?text=Image+Failed'" class="clickable-image">
                        </picture>
                    </div>
                    <div class="cs-overlay">
                        <h3 class="cs-name">${figure.name}</h3>
                        <button class="cs-show-more" aria-expanded="false">Show More Info</button>
                    </div>
                    <div class="cs-details-overlay">
                        <div class="cs-details-content">
                            <p><strong>Set:</strong> ${figure.set || 'N/A'}</p>
                            <p><strong>Company:</strong> ${figure.company || 'N/A'}</p>
                            <p><strong>Release Date:</strong> ${figure.released || 'N/A'}</p>
                            <p><strong>Description:</strong> ${figure.description || 'No description available'}</p>
                            <p class="cs-pinned"><strong>Pinned:</strong> ${figure.pinned ? 'Yes' : 'No'}</p>
                            ${buyNowLink}
                        </div>
                    </div>
                    <div class="cs-info-panel">
                        <p><strong>Set:</strong> ${figure.set || 'N/A'}</p>
                        <p><strong>Company:</strong> ${figure.company || 'N/A'}</p>
                        <p><strong>Release Date:</strong> ${figure.released || 'N/A'}</p>
                        <p><strong>Description:</strong> ${figure.description || 'No description available'}</p>
                        <p class="cs-pinned"><strong>Pinned:</strong> ${figure.pinned ? 'Yes' : 'No'}</p>
                    </div>
                `;
                seriesSection.appendChild(item);
            });

            if (index === 0 && figures[series].figures && figures[series].figures.length > 5) {
                figures[series].figures.slice(5).forEach(figure => {
                    if (!figure.name || !figure.image) {
                        console.warn(`Invalid additional figure in ${series}:`, figure);
                        return;
                    }
                    console.log(`Rendering additional figure for ${series}: ${figure.name}, Image: ${figure.image}`);
                    const item = document.createElement('div');
                    item.className = 'cs-item';
                    item.dataset.name = figure.name.toLowerCase();
                    item.dataset.pinned = figure.pinned ? 'true' : 'false';
                    const buyNowLink = figure.link
                        ? `<a class="cs-buy-now" href="${figure.link}" target="_blank" aria-label="Buy ${figure.name} now" data-tooltip="Go to purchase page">Buy Now</a>`
                        : `<button class="cs-buy-now" disabled data-tooltip="No purchase link available">Buy Now</button>`;
                    item.innerHTML = `
                        <div class="cs-picture-group">
                            <picture class="cs-picture">
                                <img loading="lazy" decoding="async" src="${figure.image}" alt="${figure.name}" width="280" height="513" onerror="this.src='https://placehold.co/280x513?text=Image+Failed'" class="clickable-image">
                            </picture>
                        </div>
                        <div class="cs-overlay">
                            <h3 class="cs-name">${figure.name}</h3>
                            <button class="cs-show-more" aria-expanded="false">Show More Info</button>
                        </div>
                        <div class="cs-details-overlay">
                            <div class="cs-details-content">
                                <p><strong>Set:</strong> ${figure.set || 'N/A'}</p>
                                <p><strong>Company:</strong> ${figure.company || 'N/A'}</p>
                                <p><strong>Release Date:</strong> ${figure.released || 'N/A'}</p>
                                <p><strong>Description:</strong> ${figure.description || 'No description available'}</p>
                                <p class="cs-pinned"><strong>Pinned:</strong> ${figure.pinned ? 'Yes' : 'No'}</p>
                                ${buyNowLink}
                            </div>
                        </div>
                        <div class="cs-info-panel">
                            <p><strong>Set:</strong> ${figure.set || 'N/A'}</p>
                            <p><strong>Company:</strong> ${figure.company || 'N/A'}</p>
                            <p><strong>Release Date:</strong> ${figure.released || 'N/A'}</p>
                            <p><strong>Description:</strong> ${figure.description || 'No description available'}</p>
                            <p class="cs-pinned"><strong>Pinned:</strong> ${figure.pinned ? 'Yes' : 'No'}</p>
                        </div>
                    `;
                    seriesSection.appendChild(item);
                });
            }

            allListing.appendChild(seriesSection);
            this.originalSectionOrder.push({ category: series, element: seriesSection });
            console.log(`Stored section for ${series} in originalSectionOrder`);

            if (index < sortedSeries.length - 1) {
                const divider = document.createElement('hr');
                divider.className = 'cs-series-divider';
                allListing.appendChild(divider);
                console.log(`Added divider after ${series}`);
            }
        });
        this.$listingWrapper.appendChild(allListing);
        console.log(`All listing rendered, items: ${allListing.querySelectorAll('.cs-item').length}, sections: ${allListing.querySelectorAll('.cs-series-section').length}`);
        console.log('Original section order:', this.originalSectionOrder.map(s => s.category));
    }

    setupImagePopups() {
        if (this.isImagePopupsSetup) {
            console.log('Image popups already set up, skipping');
            return;
        }
        this.isImagePopupsSetup = true;
        console.log('Setting up image popups');

        const images = document.querySelectorAll('.clickable-image');
        console.log(`Found ${images.length} clickable images`);

        images.forEach(image => {
            image.removeEventListener('click', this.handleImageClick);
            image.addEventListener('click', this.handleImageClick.bind(this));
            console.log(`Event listener added to image: ${image.src}`);
        });

        this.$modal.removeEventListener('click', this.handleOutsideClick);
        this.$modal.addEventListener('click', this.handleOutsideClick.bind(this));
        console.log('Event listener added to modal for outside click');

        document.removeEventListener('keydown', this.handleEscKey);
        document.addEventListener('keydown', this.handleEscKey.bind(this));
        console.log('Event listener added for ESC key');
    }

    handleCloseClick(event) {
        event.stopPropagation();
        setTimeout(() => {
            this.$modal.style.display = 'none';
            this.$modal.setAttribute('style', 'display: none !important;');
            document.body.classList.remove('cs-modal-open');
            if (this.lastFocusedElement) {
                this.lastFocusedElement.focus();
                console.log('Focus restored to:', this.lastFocusedElement.tagName);
            }
            console.log('Modal closed: close button');
            console.log('Modal styles after close:', {
                display: window.getComputedStyle(this.$modal).display
            });
        }, 0);
    }

    handleOutsideClick(e) {
        if (e.target === this.$modal) {
            setTimeout(() => {
                this.$modal.style.display = 'none';
                this.$modal.setAttribute('style', 'display: none !important;');
                document.body.classList.remove('cs-modal-open');
                if (this.lastFocusedElement) {
                    this.lastFocusedElement.focus();
                    console.log('Focus restored to:', this.lastFocusedElement.tagName);
                }
                console.log('Modal closed: click outside');
                console.log('Modal styles after close:', {
                    display: window.getComputedStyle(this.$modal).display
                });
            }, 0);
        }
    }

    handleEscKey(e) {
        if (e.key === 'Escape') {
            this.handleCloseClick(e);
            console.log('Modal closed: ESC key triggered close button action');
        }
    }

    handleImageClick(event) {
        event.stopPropagation();
        const image = event.target;
        this.lastFocusedElement = document.activeElement;
        this.$modalImg.src = '';
        this.$modalImg.src = image.src;
        this.$captionText.innerHTML = image.alt;
        setTimeout(() => {
            this.$modal.style.display = 'block';
            this.$modal.removeAttribute('style');
            document.body.classList.add('cs-modal-open');
            this.$modalClose.focus();
            window.getComputedStyle(this.$modal).display;
            console.log('Modal opened for:', image.src, 'Caption:', image.alt);
            console.log('Modal parent:', this.$modal.parentElement.tagName);
            console.log('Modal styles:', {
                position: window.getComputedStyle(this.$modal).position,
                top: window.getComputedStyle(this.$modal).top,
                left: window.getComputedStyle(this.$modal).left,
                display: window.getComputedStyle(this.$modal).display,
                justifyContent: window.getComputedStyle(this.$modal).justifyContent,
                alignItems: window.getComputedStyle(this.$modal).alignItems,
                zIndex: window.getComputedStyle(this.$modal).zIndex
            });
            console.log('Modal content styles:', {
                display: window.getComputedStyle(this.$modalImg).display,
                width: window.getComputedStyle(this.$modalImg).width,
                maxWidth: window.getComputedStyle(this.$modalImg).maxWidth,
                maxHeight: window.getComputedStyle(this.$modalImg).maxHeight
            });
            console.log('Modal image dimensions:', {
                naturalWidth: this.$modalImg.naturalWidth,
                naturalHeight: this.$modalImg.naturalHeight
            });
        }, 0);
        this.$modalImg.onerror = () => {
            console.error('Modal image failed to load:', image.src);
            this.$modalImg.src = 'https://placehold.co/700x1280?text=Image+Failed';
        };
        this.$modalImg.onload = () => {
            console.log('Modal image loaded:', image.src);
            console.log('Modal image dimensions:', {
                naturalWidth: this.$modalImg.naturalWidth,
                naturalHeight: this.$modalImg.naturalHeight
            });
        };
    }

    setupCardInteractions() {
        const visibleListing = document.querySelector('.cs-listing:not(.cs-hidden)');
        const items = visibleListing
            ? visibleListing.querySelectorAll('.cs-item:not(.cs-logo-item)')
            : document.querySelectorAll('.cs-item:not(.cs-logo-item)');
        console.log(`Setting up interactions for ${items.length} items in ${visibleListing ? `visible listing: ${visibleListing.dataset.category}` : 'all listings'}`);
        items.forEach(item => {
            const button = item.querySelector('.cs-show-more');
            if (button) {
                console.log(`Found Show More button for card: ${item.querySelector('.cs-name')?.textContent || 'Unknown'}`);
            } else {
                console.warn(`No .cs-show-more button found in card: ${item.querySelector('.cs-name')?.textContent || 'Unknown'}`);
            }
        });
    }

    setupOutsideClick() {
        document.addEventListener('click', (e) => {
            const items = document.querySelectorAll(`.${this.expandedClass}`);
            items.forEach(item => {
                if (!item.contains(e.target) && !e.target.closest('.modal')) {
                    item.classList.remove(this.expandedClass);
                    const button = item.querySelector('.cs-show-more');
                    if (button) {
                        button.textContent = 'Show More Info';
                        button.setAttribute('aria-expanded', 'false');
                    }
                    console.log(`Card ${item.querySelector('.cs-name')?.textContent || 'Unknown'} collapsed via outside click`);
                }
            });
        }, { capture: true });

        document.addEventListener('touchstart', (e) => {
            const items = document.querySelectorAll(`.${this.expandedClass}`);
            items.forEach(item => {
                if (!item.contains(e.target) && !e.target.closest('.modal')) {
                    item.classList.remove(this.expandedClass);
                    const button = item.querySelector('.cs-show-more');
                    if (button) {
                        button.textContent = 'Show More Info';
                        button.setAttribute('aria-expanded', 'false');
                    }
                    console.log(`Card ${item.querySelector('.cs-name')?.textContent || 'Unknown'} collapsed via outside touch`);
                }
            });
        }, { capture: true });
    }

    handleShowMoreClick(item, event) {
        event.stopPropagation();
        document.querySelectorAll(`.${this.expandedClass}`).forEach(otherItem => {
            if (otherItem !== item) {
                otherItem.classList.remove(this.expandedClass);
                const otherButton = otherItem.querySelector('.cs-show-more');
                if (otherButton) {
                    otherButton.textContent = 'Show More Info';
                    otherButton.setAttribute('aria-expanded', 'false');
                }
            }
        });
        item.classList.toggle(this.expandedClass);
        const button = item.querySelector('.cs-show-more');
        if (button) {
            const isExpanded = item.classList.contains(this.expandedClass);
            button.textContent = isExpanded ? 'Show Less' : 'Show More Info';
            button.setAttribute('aria-expanded', isExpanded.toString());
            console.log(`Card ${item.querySelector('.cs-name')?.textContent || 'Unknown'} ${isExpanded ? 'expanded' : 'collapsed'}`);
            const detailsOverlay = item.querySelector('.cs-details-overlay');
            const detailsContent = item.querySelector('.cs-details-content');
            console.log(`Details overlay styles for ${item.querySelector('.cs-name')?.textContent || 'Unknown'}:`, {
                top: window.getComputedStyle(detailsOverlay).top,
                height: window.getComputedStyle(detailsOverlay).height,
                transition: window.getComputedStyle(detailsOverlay).transition
            });
            console.log(`Details content styles for ${item.querySelector('.cs-name')?.textContent || 'Unknown'}:`, {
                paddingTop: window.getComputedStyle(detailsContent).paddingTop,
                maxHeight: window.getComputedStyle(detailsContent).maxHeight,
                height: window.getComputedStyle(detailsContent).height
            });
        }
    }

    onClick($filter) {
        console.log('Filter clicked:', $filter.dataset.filter, 'at:', new Date().toLocaleString());
        this.$filters.forEach(f => f.classList.remove(this.activeClass));
        $filter.classList.add(this.activeClass);
        this.$activeFilter = $filter;
        if ($filter.dataset.filter === 'all') {
            this.$searchSelect.value = 'all';
            console.log('Select reset to All Series via All button');
        }
        this.filter($filter.dataset.filter, this.$searchInput.value.trim().toLowerCase());
    }

    filter(filter, searchQuery = '') {
        console.log('Filtering:', filter, 'Search query:', searchQuery, 'at:', new Date().toLocaleString());
        const images = document.querySelectorAll(this.imagesSelector) || [];
        if (!images.length) {
            console.error('No .cs-listing elements found. Check figures.json or renderAllListings logic.');
            this.$listingWrapper.innerHTML = '<p style="color: var(--text-color); text-align: center;">No listings found. Ensure figures.json exists and contains valid series and figures (e.g., {"Naruto":{"logo":"url","figures":[{"name":"Naruto Uzumaki","image":"url"}]}}).</p>';
            return;
        }

        console.log(`Found ${images.length} listings:`, Array.from(images).map(img => ({
            category: img.dataset.category,
            hidden: img.classList.contains(this.hiddenClass),
            items: img.querySelectorAll('.cs-item').length
        })));

        images.forEach($image => {
            $image.classList.add(this.hiddenClass);
            $image.style.opacity = '0';
            $image.style.visibility = 'hidden';
            $image.style.transform = 'scale(0)';
            $image.style.position = 'absolute';
            $image.style.pointerEvents = 'none';
            console.log(`Listing ${$image.dataset.category} hidden by default`);
        });

        images.forEach($image => {
            const effectiveFilter = filter === 'all' || filter === 'pinned' ? 'all' : `series-${filter}`;
            const shouldShowListing = $image.dataset.category === effectiveFilter;
            const items = $image.querySelectorAll('.cs-item:not(.cs-logo-item)');
            let hasVisibleItems = false;

            if (shouldShowListing) {
                items.forEach(item => {
                    const nameMatch = !searchQuery || item.dataset.name.includes(searchQuery);
                    const pinnedMatch = filter !== 'pinned' || item.dataset.pinned === 'true';
                    if (nameMatch && pinnedMatch) {
                        item.style.display = 'block';
                        hasVisibleItems = true;
                    } else {
                        item.style.display = 'none';
                    }
                });

                // For 'all' or 'pinned' listing, handle section visibility and no-results
                if ($image.dataset.category === 'all') {
                    const allListing = $image;
                    // Remove any existing no-results message
                    const noResultsMessage = allListing.querySelector('.cs-no-results');
                    if (noResultsMessage) {
                        noResultsMessage.remove();
                        console.log('Removed existing no-results message');
                    }

                    if (filter === 'pinned' && !hasVisibleItems) {
                        // Show no-results message for pinned view with no matches
                        const noResults = document.createElement('div');
                        noResults.className = 'cs-no-results';
                        noResults.innerHTML = '<p style="color: var(--text-color); text-align: center; grid-column: 1 / -1;">No pinned figures found.</p>';
                        allListing.appendChild(noResults);
                        console.log('Appended no-results message for pinned view');
                    } else if (filter === 'all' && searchQuery && !hasVisibleItems) {
                        // Show no-results message for all view with search and no matches
                        const noResults = document.createElement('div');
                        noResults.className = 'cs-no-results';
                        noResults.innerHTML = '<p style="color: var(--text-color); text-align: center; grid-column: 1 / -1;">No figures found.</p>';
                        allListing.appendChild(noResults);
                        console.log('Appended no-results message for all view');
                    } else if (filter === 'all' && !searchQuery) {
                        // No search: restore original alphabetical order with dividers
                        allListing.innerHTML = '';
                        this.originalSectionOrder.forEach((sectionData, index) => {
                            allListing.appendChild(sectionData.element);
                            sectionData.element.style.display = 'contents';
                            const logo = sectionData.element.querySelector('.cs-logo-item');
                            if (logo) {
                                logo.style.display = 'block';
                            }
                            console.log(`Restored section: ${sectionData.category} at position ${index + 1}`);
                            if (index < this.originalSectionOrder.length - 1) {
                                const divider = document.createElement('hr');
                                divider.className = 'cs-series-divider';
                                allListing.appendChild(divider);
                                console.log(`Added divider after restored section ${sectionData.category}`);
                            }
                        });
                    } else if (searchQuery) {
                        // During search: show only matching sections, reordered to top
                        const visibleSections = [];
                        const hiddenSections = [];

                        const sections = Array.from(allListing.querySelectorAll('.cs-series-section'));
                        sections.forEach(section => {
                            const visibleItems = section.querySelectorAll('.cs-item:not(.cs-logo-item)[style*="display: block"]');
                            if (visibleItems.length > 0) {
                                visibleSections.push(section);
                                section.style.display = 'contents';
                                console.log(`Section for series: ${section.dataset.category} marked visible (${visibleItems.length} figures)`);
                            } else {
                                hiddenSections.push(section);
                                section.style.display = 'none';
                                console.log(`Section for series: ${section.dataset.category} marked hidden (no visible figures)`);
                            }
                        });

                        // Reorder: append visible sections first, then hidden sections, no dividers
                        allListing.innerHTML = '';
                        visibleSections.forEach((section, index) => {
                            allListing.appendChild(section);
                            console.log(`Appended visible section: ${section.dataset.category} at position ${index + 1}`);
                        });
                        hiddenSections.forEach((section, index) => {
                            allListing.appendChild(section);
                            console.log(`Appended hidden section: ${section.dataset.category} at position ${visibleSections.length + index + 1}`);
                        });
                    }
                }

                if (hasVisibleItems || $image.dataset.category !== 'all') {
                    $image.classList.remove(this.hiddenClass);
                    $image.style.opacity = '1';
                    $image.style.visibility = 'visible';
                    $image.style.transform = 'scale(1)';
                    $image.style.position = 'relative';
                    $image.style.pointerEvents = 'auto';
                    console.log(`Listing ${$image.dataset.category} shown, visible items: ${$image.querySelectorAll('.cs-item:not(.cs-logo-item)[style*="display: block"]').length}`);
                }
            }
        });

        if (filter === 'all' || filter === 'pinned') {
            this.$searchSelect.value = 'all';
            this.$filters.forEach(f => f.classList.remove(this.activeClass));
            const targetButton = Array.from(this.$filters).find(f => f.dataset.filter === filter);
            if (targetButton) {
                targetButton.classList.add(this.activeClass);
                this.$activeFilter = targetButton;
                console.log(`Active filter set to ${filter}`);
            }
        }

        // Divider visibility logic
        const dividers = document.querySelectorAll('.cs-series-divider');
        console.log(`Found ${dividers.length} dividers`);

        dividers.forEach((divider, index) => {
            if (filter === 'all' || filter === 'pinned') {
                if (searchQuery) {
                    divider.classList.add(this.hiddenDividerClass);
                    console.log(`Divider ${index} hidden (search active)`);
                } else {
                    divider.classList.remove(this.hiddenDividerClass);
                    console.log(`Divider ${index} shown (no search, All/Pinned view)`);
                }
            } else {
                divider.classList.add(this.hiddenDividerClass);
                console.log(`Divider ${index} hidden (series-specific filter)`);
            }
        });

        const visibleListings = document.querySelectorAll(`.cs-listing:not(.${this.hiddenClass})`);
        console.log(`Visible listings after filter: ${visibleListings.length}`, Array.from(visibleListings).map(l => l.dataset.category));
        const visibleCards = document.querySelectorAll(`.cs-listing:not(.${this.hiddenClass}) .cs-item:not(.cs-logo-item)[style*="display: block"]`);
        console.log(`Visible cards after filtering: ${visibleCards.length}`);
        if (filter === 'all' || filter === 'pinned') {
            const allListing = document.querySelector('.cs-listing[data-category="all"]');
            if (allListing) {
                console.log('All listing sections:', Array.from(allListing.querySelectorAll('.cs-series-section')).map(s => ({
                    category: s.dataset.category,
                    visibleItems: s.querySelectorAll('.cs-item:not(.cs-logo-item)[style*="display: block"]').length,
                    sectionVisible: s.style.display !== 'none'
                })));
                console.log('All listing items:', Array.from(allListing.querySelectorAll('.cs-item:not(.cs-logo-item)[style*="display: block"]')).map(i => i.querySelector('.cs-name')?.textContent || 'Unknown'));
                const allListingStyles = window.getComputedStyle(allListing);
                console.log('All listing CSS styles:', {
                    display: allListingStyles.display,
                    gridTemplateColumns: allListingStyles.gridTemplateColumns,
                    gap: allListingStyles.gap,
                    width: allListingStyles.width
                });
                const firstSection = allListing.querySelector('.cs-series-section[style*="display: contents"]');
                if (firstSection) {
                    const sectionStyles = window.getComputedStyle(firstSection);
                    console.log('First visible series section CSS styles:', {
                        display: sectionStyles.display,
                        width: sectionStyles.width
                    });
                }
                const firstItem = allListing.querySelector('.cs-item:not(.cs-logo-item)[style*="display: block"]');
                if (firstItem) {
                    const itemStyles = window.getComputedStyle(firstItem);
                    console.log('First item CSS styles:', {
                        display: itemStyles.display,
                        width: itemStyles.width,
                        height: itemStyles.height,
                        margin: itemStyles.margin,
                        padding: itemStyles.padding
                    });
                    const firstImage = firstItem.querySelector('.cs-picture img');
                    if (firstImage) {
                        const imageStyles = window.getComputedStyle(firstImage);
                        console.log('First image CSS styles:', {
                            width: imageStyles.width,
                            height: imageStyles.height
                        });
                    }
                }
            } else {
                console.error('All listing not found after filtering to all or pinned');
            }
        }
        if (visibleListings.length > 0) {
            visibleListings.forEach(listing => {
                const styles = window.getComputedStyle(listing);
                console.log(`Visible listing ${listing.dataset.category} styles:`, {
                    display: styles.display,
                    gridTemplateColumns: styles.gridTemplateColumns,
                    gap: styles.gap,
                    width: styles.width
                });
            });
        } else {
            console.error('No visible listings found after filtering.');
        }
        console.log('Listing wrapper width:', window.getComputedStyle(this.$listingWrapper).width);
        console.log('Collection section width:', window.getComputedStyle(document.querySelector('#collection-1602')).width);
        console.log('Window inner width:', window.innerWidth);

        if (!this.isImagePopupsSetup) {
            this.setupImagePopups();
        }
        this.setupCardInteractions();
        this.setupOutsideClick();
    }
}

new GalleryFilter();