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
        this.$searchInput.setAttribute('aria-label', 'Search figures by name, description, set, or company');
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
            this.$listingWrapper.innerHTML = '<p style="color: var(--text-color); text-align: center;">Error: Required elements not found.</p>';
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

        // Set up event delegation for .cs-show-more and .cs-pin-button clicks
        this.$listingWrapper.addEventListener('click', (e) => {
            const showMoreButton = e.target.closest('.cs-show-more');
            const pinButton = e.target.closest('.cs-pin-button');
            if (showMoreButton) {
                const item = showMoreButton.closest('.cs-item:not(.cs-logo-item)');
                if (item) {
                    this.handleShowMoreClick(item, e);
                    console.log(`Delegated click on Show More for card: ${item.querySelector('.cs-name')?.textContent || 'Unknown'}`);
                }
            } else if (pinButton) {
                const item = pinButton.closest('.cs-item:not(.cs-logo-item)');
                if (item) {
                    this.handlePinClick(item, e);
                    console.log(`Delegated click on Pin/Unpin for card: ${item.querySelector('.cs-name')?.textContent || 'Unknown'}`);
                }
            }
        });
        console.log('Event delegation set up for .cs-show-more and .cs-pin-button clicks on .cs-listing-wrapper');

        // Set up select change event
        this.$searchSelect.addEventListener('change', () => {
            const value = this.$searchSelect.value;
            console.log('Select changed:', value);
            const filterValue = value !== 'all' ? `series-${value}` : 'all';
            this.filter(filterValue, this.$searchInput.value.trim().toLowerCase());
            this.$filters = document.querySelectorAll(this.filtersSelector);
            this.$activeFilter = Array.from(this.$filters).find(f => f.dataset.filter === filterValue) || this.$filters[0];
            this.$filters.forEach(f => f.classList.remove(this.activeClass));
            this.$activeFilter.classList.add(this.activeClass);
            console.log(`Active filter set to ${filterValue} via select change`);
        });
        console.log('Select change event listener added');

        // Load figures and initialize
        this.loadFigures().then(figures => {
            this.figures = figures;
            if (!figures || !Object.keys(figures).length) {
                console.error('No figures loaded from figures.json.');
                this.$listingWrapper.innerHTML = '<p style="color: var(--text-color); text-align: center;">No figures loaded. Check figures.json.</p>';
                return;
            }

            console.log('Loaded series:', Object.keys(figures).sort());

            this.renderDropdown(figures);
            this.renderAllListings(figures);
            this.$images = document.querySelectorAll(this.imagesSelector) || [];
            console.log('Listings after render:', this.$images.length, Array.from(this.$images).map(img => img.dataset.category));

            if (this.$images.length === 0) {
                console.error('No listings rendered.');
                this.$listingWrapper.innerHTML = '<p style="color: var(--text-color); text-align: center;">No listings rendered. Check figures.json.</p>';
                return;
            }

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

            this.filter('all');

            this.setupImagePopups();
            this.setupOutsideClick();
            console.log('Initial card count:', document.querySelectorAll('.cs-item').length);
            console.log('Listing wrapper width:', window.getComputedStyle(this.$listingWrapper).width);
        }).catch(error => {
            console.error('Initialization failed:', error.message);
            this.$listingWrapper.innerHTML = '<p style="color: var(--text-color); text-align: center;">Failed to initialize gallery: ' + error.message + '.</p>';
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
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            const data = await response.json();
            console.log('Raw figures.json data:', JSON.stringify(data, null, 2));
            if (!data || typeof data !== 'object' || !Object.keys(data).length) {
                throw new Error('Invalid or empty figures.json');
            }
            console.log('Figures loaded. Series count:', Object.keys(data).length);
            return data;
        } catch (error) {
            console.error('Error loading figures.json:', error.message);
            this.$listingWrapper.innerHTML = '<p style="color: var(--text-color); text-align: center;">Failed to load figures.json: ' + error.message + '.</p>';
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

        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        context.font = '1.1rem sans-serif';
        const longestName = seriesNames.reduce((a, b) => a.length > b.length ? a : b, 'All Series');
        const textWidth = context.measureText(longestName).width;
        const selectWidth = Math.min(Math.max(textWidth + 50, 200), 300);
        this.$searchSelect.style.width = `${selectWidth}px`;
        console.log(`Select width set to ${selectWidth}px for longest series: ${longestName}`);

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
        console.log('Cleared cs-listing-wrapper');

        Object.keys(figures).forEach(series => {
            if (!figures[series] || !figures[series].figures || !Array.isArray(figures[series].figures)) {
                console.warn(`Skipping invalid series: ${series}`);
                return;
            }
            const listing = document.createElement('div');
            listing.className = `cs-listing cs-hidden`;
            listing.dataset.category = `series-${series}`;

            // Add series logo container
            const logoContainer = document.createElement('div');
            logoContainer.className = 'cs-series-logo-container';
            const logoUrl = figures[series].logo || 'placehold.co/280x112?text=Logo+Missing';
            logoContainer.innerHTML = `<img class="cs-series-logo" src="${logoUrl}" alt="${series} Logo">`;
            listing.appendChild(logoContainer);
            console.log(`Rendered logo container for ${series}: ${logoUrl}`);

            figures[series].figures.forEach(figure => {
                if (!figure.name || !figure.image) {
                    console.warn(`Invalid figure in ${series}:`, figure);
                    return;
                }
                console.log(`Rendering figure for ${series}: ${figure.name}`);
                const item = document.createElement('div');
                item.className = 'cs-item';
                item.dataset.name = figure.name.toLowerCase();
                item.dataset.description = (figure.description || 'No description available').toLowerCase();
                item.dataset.set = (figure.set || 'N/A').toLowerCase();
                item.dataset.company = (figure.company || 'N/A').toLowerCase();
                const localPinned = localStorage.getItem(`pinned_${figure.name}`);
                const isPinned = localPinned !== null ? JSON.parse(localPinned) : !!figure.pinned;
                item.dataset.pinned = isPinned.toString();
                const buyNowLink = figure.link
                    ? `<a class="cs-buy-now" href="${figure.link}" target="_blank" aria-label="Buy ${figure.name} now" data-tooltip="Go to purchase page">Buy Now</a>`
                    : `<button class="cs-buy-now" disabled data-tooltip="No purchase link available">Buy Now</button>`;
                const pinButtonText = isPinned ? 'Unpin' : 'Pin';
                const pinTooltip = isPinned ? 'Remove from pinned' : 'Add to pinned';
                const pinnedIndicator = isPinned ? `<span class="cs-pinned-indicator" aria-label="Pinned figure" style="display: block;">★</span>` : `<span class="cs-pinned-indicator" aria-label="Pinned figure" style="display: none;">★</span>`;
                item.innerHTML = `
                    <div class="cs-picture-group">
                        <picture class="cs-picture">
                            <img loading="lazy" decoding="async" src="${figure.image}" alt="${figure.name}" width="280" height="513" onerror="this.src='placehold.co/280x513?text=Image+Failed'" class="clickable-image">
                        </picture>
                        ${pinnedIndicator}
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
                            <p class="cs-pinned"><strong>Pinned:</strong> ${isPinned ? 'Yes' : 'No'}</p>
                            ${buyNowLink}
                            <button class="cs-pin-button" data-tooltip="${pinTooltip}">${pinButtonText}</button>
                        </div>
                    </div>
                    <div class="cs-info-panel">
                        <p><strong>Set:</strong> ${figure.set || 'N/A'}</p>
                        <p><strong>Company:</strong> ${figure.company || 'N/A'}</p>
                        <p><strong>Release Date:</strong> ${figure.released || 'N/A'}</p>
                        <p><strong>Description:</strong> ${figure.description || 'No description available'}</p>
                        <p class="cs-pinned"><strong>Pinned:</strong> ${isPinned ? 'Yes' : 'No'}</p>
                        ${buyNowLink}
                        <button class="cs-pin-button" data-tooltip="${pinTooltip}">${pinButtonText}</button>
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

            // Add series logo container
            const logoContainer = document.createElement('div');
            logoContainer.className = 'cs-series-logo-container';
            const logoUrl = figures[series].logo || 'placehold.co/280x112?text=Logo+Missing';
            logoContainer.innerHTML = `<img class="cs-series-logo" src="${logoUrl}" alt="${series} Logo">`;
            seriesSection.appendChild(logoContainer);
            console.log(`Rendered logo container for ${series} in all listing: ${logoUrl}`);

            figures[series].figures.forEach(figure => {
                if (!figure.name || !figure.image) {
                    console.warn(`Invalid figure in ${series} (all listing):`, figure);
                    return;
                }
                console.log(`Rendering all figure for ${series}: ${figure.name}`);
                const item = document.createElement('div');
                item.className = 'cs-item';
                item.dataset.name = figure.name.toLowerCase();
                item.dataset.description = (figure.description || 'No description available').toLowerCase();
                item.dataset.set = (figure.set || 'N/A').toLowerCase();
                item.dataset.company = (figure.company || 'N/A').toLowerCase();
                const localPinned = localStorage.getItem(`pinned_${figure.name}`);
                const isPinned = localPinned !== null ? JSON.parse(localPinned) : !!figure.pinned;
                item.dataset.pinned = isPinned.toString();
                const buyNowLink = figure.link
                    ? `<a class="cs-buy-now" href="${figure.link}" target="_blank" aria-label="Buy ${figure.name} now" data-tooltip="Go to purchase page">Buy Now</a>`
                    : `<button class="cs-buy-now" disabled data-tooltip="No purchase link available">Buy Now</button>`;
                const pinButtonText = isPinned ? 'Unpin' : 'Pin';
                const pinTooltip = isPinned ? 'Remove from pinned' : 'Add to pinned';
                const pinnedIndicator = isPinned ? `<span class="cs-pinned-indicator" aria-label="Pinned figure" style="display: block;">★</span>` : `<span class="cs-pinned-indicator" aria-label="Pinned figure" style="display: none;">★</span>`;
                item.innerHTML = `
                    <div class="cs-picture-group">
                        <picture class="cs-picture">
                            <img loading="lazy" decoding="async" src="${figure.image}" alt="${figure.name}" width="280" height="513" onerror="this.src='placehold.co/280x513?text=Image+Failed'" class="clickable-image">
                        </picture>
                        ${pinnedIndicator}
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
                            <p class="cs-pinned"><strong>Pinned:</strong> ${isPinned ? 'Yes' : 'No'}</p>
                            ${buyNowLink}
                            <button class="cs-pin-button" data-tooltip="${pinTooltip}">${pinButtonText}</button>
                        </div>
                    </div>
                    <div class="cs-info-panel">
                        <p><strong>Set:</strong> ${figure.set || 'N/A'}</p>
                        <p><strong>Company:</strong> ${figure.company || 'N/A'}</p>
                        <p><strong>Release Date:</strong> ${figure.released || 'N/A'}</p>
                        <p><strong>Description:</strong> ${figure.description || 'No description available'}</p>
                        <p class="cs-pinned"><strong>Pinned:</strong> ${isPinned ? 'Yes' : 'No'}</p>
                        ${buyNowLink}
                        <button class="cs-pin-button" data-tooltip="${pinTooltip}">${pinButtonText}</button>
                        </div>
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
                    console.log(`Rendering additional figure for ${series}: ${figure.name}`);
                    const item = document.createElement('div');
                    item.className = 'cs-item';
                    item.dataset.name = figure.name.toLowerCase();
                    item.dataset.description = (figure.description || 'No description available').toLowerCase();
                    item.dataset.set = (figure.set || 'N/A').toLowerCase();
                    item.dataset.company = (figure.company || 'N/A').toLowerCase();
                    const localPinned = localStorage.getItem(`pinned_${figure.name}`);
                    const isPinned = localPinned !== null ? JSON.parse(localPinned) : !!figure.pinned;
                    item.dataset.pinned = isPinned.toString();
                    const buyNowLink = figure.link
                        ? `<a class="cs-buy-now" href="${figure.link}" target="_blank" aria-label="Buy ${figure.name} now" data-tooltip="Go to purchase page">Buy Now</a>`
                        : `<button class="cs-buy-now" disabled data-tooltip="No purchase link available">Buy Now</button>`;
                    const pinButtonText = isPinned ? 'Unpin' : 'Pin';
                    const pinTooltip = isPinned ? 'Remove from pinned' : 'Add to pinned';
                    const pinnedIndicator = isPinned ? `<span class="cs-pinned-indicator" aria-label="Pinned figure" style="display: block;">★</span>` : `<span class="cs-pinned-indicator" aria-label="Pinned figure" style="display: none;">★</span>`;
                    item.innerHTML = `
                        <div class="cs-picture-group">
                            <picture class="cs-picture">
                                <img loading="lazy" decoding="async" src="${figure.image}" alt="${figure.name}" width="280" height="513" onerror="this.src='placehold.co/280x513?text=Image+Failed'" class="clickable-image">
                            </picture>
                            ${pinnedIndicator}
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
                                <p class="cs-pinned"><strong>Pinned:</strong> ${isPinned ? 'Yes' : 'No'}</p>
                                ${buyNowLink}
                                <button class="cs-pin-button" data-tooltip="${pinTooltip}">${pinButtonText}</button>
                            </div>
                        </div>
                        <div class="cs-info-panel">
                            <p><strong>Set:</strong> ${figure.set || 'N/A'}</p>
                            <p><strong>Company:</strong> ${figure.company || 'N/A'}</p>
                            <p><strong>Release Date:</strong> ${figure.released || 'N/A'}</p>
                            <p><strong>Description:</strong> ${figure.description || 'No description available'}</p>
                            <p class="cs-pinned"><strong>Pinned:</strong> ${isPinned ? 'Yes' : 'No'}</p>
                            ${buyNowLink}
                            <button class="cs-pin-button" data-tooltip="${pinTooltip}">${pinButtonText}</button>
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
            }, 0);
        }
    }

    handleEscKey(e) {
        if (e.key === 'Escape') {
            this.handleCloseClick(e);
            console.log('Modal closed: ESC key');
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
            console.log('Modal opened for:', image.src, 'Caption:', image.alt);
        }, 0);
        this.$modalImg.onerror = () => {
            console.error('Modal image failed to load:', image.src);
            this.$modalImg.src = 'placehold.co/700x1280?text=Image+Failed';
        };
        this.$modalImg.onload = () => {
            console.log('Modal image loaded:', image.src);
        };
    }

    handlePinClick(item, event) {
        event.stopPropagation();
        event.preventDefault();
        const scrollPosition = window.scrollY;
        console.log(`Saving scroll position before pin action: ${scrollPosition}`);

        const figureName = item.querySelector('.cs-name').textContent;
        const currentPinned = item.dataset.pinned === 'true';
        const newPinned = !currentPinned;

        localStorage.setItem(`pinned_${figureName}`, JSON.stringify(newPinned));
        console.log(`Updated pinned state for ${figureName}: ${newPinned}`);

        const allItems = document.querySelectorAll(`.cs-item:not(.cs-logo-item)[data-name="${figureName.toLowerCase()}"]`);
        allItems.forEach(item => {
            item.dataset.pinned = newPinned.toString();
            const pinnedText = item.querySelector('.cs-details-content .cs-pinned');
            if (pinnedText) {
                pinnedText.innerHTML = `<strong>Pinned:</strong> ${newPinned ? 'Yes' : 'No'}`;
            }
            const pinnedTextInfo = item.querySelector('.cs-info-panel .cs-pinned');
            if (pinnedTextInfo) {
                pinnedTextInfo.innerHTML = `<strong>Pinned:</strong> ${newPinned ? 'Yes' : 'No'}`;
            }
            const pinButtons = item.querySelectorAll('.cs-pin-button');
            pinButtons.forEach(pinButton => {
                pinButton.textContent = newPinned ? 'Unpin' : 'Pin';
                pinButton.setAttribute('data-tooltip', newPinned ? 'Remove from pinned' : 'Add to pinned');
            });
            const pinnedIndicator = item.querySelector('.cs-pinned-indicator');
            if (pinnedIndicator) {
                pinnedIndicator.style.display = newPinned ? 'block' : 'none';
                if (newPinned) {
                    pinnedIndicator.classList.add('cs-pulse');
                    setTimeout(() => pinnedIndicator.classList.remove('cs-pulse'), 500); // Remove after animation
                }
            }
        });
        console.log(`Synced pinned state for ${figureName} across ${allItems.length} instances`);

        const currentFilter = this.$searchSelect.value !== 'all' ? `series-${this.$searchSelect.value}` : (this.$activeFilter?.dataset.filter || 'all');
        console.log(`Maintaining current filter: ${currentFilter}`);

        this.filter(currentFilter, this.$searchInput.value.trim().toLowerCase(), true);
        window.scrollTo({ top: scrollPosition, behavior: 'auto' });
        console.log(`Restored scroll position after pin action: ${scrollPosition}`);
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
        }, { passive: true });
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
        }
    }

    onClick($filter) {
        console.log('Filter clicked:', $filter.dataset.filter);
        let targetFilter = $filter.dataset.filter;
        if (targetFilter === 'pinned' && this.$activeFilter === $filter) {
            targetFilter = 'all';
            this.$filters.forEach(f => f.classList.remove(this.activeClass));
            this.$activeFilter = Array.from(this.$filters).find(f => f.dataset.filter === 'all') || this.$filters[0];
            this.$activeFilter.classList.add(this.activeClass);
            this.$searchSelect.value = 'all';
            console.log('Pinned filter toggled to All');
        } else {
            this.$filters.forEach(f => f.classList.remove(this.activeClass));
            $filter.classList.add(this.activeClass);
            this.$activeFilter = $filter;
            if (targetFilter === 'all') {
                this.$searchSelect.value = 'all';
                console.log('Select reset to All Series via All button');
            }
        }
        this.filter(targetFilter, this.$searchInput.value.trim().toLowerCase());
    }

    filter(filter, searchQuery = '', preserveFilterState = false) {
        console.log('Filtering:', filter, 'Search query:', searchQuery, 'Preserve filter state:', preserveFilterState);
        const images = document.querySelectorAll(this.imagesSelector) || [];
        if (!images.length) {
            console.error('No .cs-listing elements found.');
            this.$listingWrapper.innerHTML = '<p style="color: var(--text-color); text-align: center;">No listings found.</p>';
            return;
        }

        console.log(`Found ${images.length} listings`);

        images.forEach($image => {
            $image.classList.add(this.hiddenClass);
            $image.style.display = 'none';
            console.log(`Listing ${$image.dataset.category} hidden by default`);
        });

        const isSeriesFilter = filter.startsWith('series-');
        const targetListingCategory = preserveFilterState && isSeriesFilter ? filter : (filter === 'all' || filter === 'pinned' ? 'all' : filter);
        images.forEach($image => {
            const shouldShowListing = $image.dataset.category === targetListingCategory;
            const items = Array.from($image.querySelectorAll('.cs-item:not(.cs-logo-item)'));
            let hasVisibleItems = false;

            if (shouldShowListing) {
                items.forEach(item => {
                    const nameMatch = !searchQuery || 
                        item.dataset.name.includes(searchQuery) || 
                        item.dataset.description.includes(searchQuery) ||
                        item.dataset.set.includes(searchQuery) ||
                        item.dataset.company.includes(searchQuery);
                    const localPinned = localStorage.getItem(`pinned_${item.querySelector('.cs-name').textContent}`);
                    const isPinned = localPinned !== null ? JSON.parse(localPinned) : item.dataset.pinned === 'true';
                    const pinnedMatch = filter !== 'pinned' || isPinned;
                    if (nameMatch && pinnedMatch) {
                        item.style.display = 'block';
                        hasVisibleItems = true;
                    } else {
                        item.style.display = 'none';
                    }
                });

                const logoContainer = $image.querySelector('.cs-series-logo-container');
                if (logoContainer) {
                    logoContainer.style.display = hasVisibleItems ? 'block' : 'none';
                    console.log(`Logo container for ${$image.dataset.category} display: ${logoContainer.style.display}`);
                }

                if ($image.dataset.category === 'all') {
                    const allListing = $image;
                    const noResultsMessage = allListing.querySelector('.cs-no-results');
                    if (noResultsMessage) {
                        noResultsMessage.remove();
                        console.log('Removed existing no-results message');
                    }

                    if (filter === 'pinned' && !hasVisibleItems) {
                        const noResults = document.createElement('div');
                        noResults.className = 'cs-no-results visible';
                        noResults.innerHTML = '<p style="color: var(--text-color); text-align: center; grid-column: 1 / -1;">No pinned figures found.</p>';
                        allListing.appendChild(noResults);
                        console.log('Appended no-results message for pinned view');
                    } else if (filter === 'all' && searchQuery && !hasVisibleItems) {
                        const noResults = document.createElement('div');
                        noResults.className = 'cs-no-results visible';
                        noResults.innerHTML = '<p style="color: var(--text-color); text-align: center; grid-column: 1 / -1;">No figures found.</p>';
                        allListing.appendChild(noResults);
                        console.log('Appended no-results message for all view');
                    } else if (filter === 'all' && !searchQuery) {
                        allListing.innerHTML = '';
                        this.originalSectionOrder.forEach((sectionData, index) => {
                            allListing.appendChild(sectionData.element);
                            sectionData.element.style.display = 'contents';
                            const logo = sectionData.element.querySelector('.cs-series-logo-container');
                            if (logo) {
                                logo.style.display = 'block';
                            }
                            console.log(`Restored section: ${sectionData.category} at ${index + 1}`);
                            if (index < this.originalSectionOrder.length - 1) {
                                const divider = document.createElement('hr');
                                divider.className = 'cs-series-divider';
                                allListing.appendChild(divider);
                                console.log(`Added divider after ${sectionData.category}`);
                            }
                        });
                    } else if (filter === 'pinned' || searchQuery) {
                        const visibleSections = [];
                        const hiddenSections = [];

                        const sections = Array.from(allListing.querySelectorAll('.cs-series-section'));
                        sections.forEach(section => {
                            const selector = filter === 'pinned' 
                                ? '.cs-item:not(.cs-logo-item)[data-pinned="true"]'
                                : '.cs-item:not(.cs-logo-item)[style*="display: block"]';
                            const visibleItems = Array.from(section.querySelectorAll(selector));
                            if (visibleItems.length > 0) {
                                visibleSections.push(section);
                                section.style.display = 'contents';
                                const logo = section.querySelector('.cs-series-logo-container');
                                if (logo) {
                                    logo.style.display = 'block';
                                }
                                console.log(`Section ${section.dataset.category} visible (${visibleItems.length} figures)`);
                            } else {
                                hiddenSections.push(section);
                                section.style.display = 'none';
                                const logo = section.querySelector('.cs-series-logo-container');
                                if (logo) {
                                    logo.style.display = 'none';
                                }
                                console.log(`Section ${section.dataset.category} hidden`);
                            }
                        });

                        allListing.innerHTML = '';
                        visibleSections.forEach((section, index) => {
                            allListing.appendChild(section);
                            console.log(`Appended visible section: ${section.dataset.category} at ${index + 1}`);
                            if (index < visibleSections.length - 1) {
                                const divider = document.createElement('hr');
                                divider.className = 'cs-series-divider';
                                allListing.appendChild(divider);
                                console.log(`Added divider after visible section ${section.dataset.category}`);
                            }
                        });
                        hiddenSections.forEach((section, index) => {
                            allListing.appendChild(section);
                            console.log(`Appended hidden section: ${section.dataset.category} at ${visibleSections.length + index + 1}`);
                        });
                    }
                }

                if (hasVisibleItems || $image.dataset.category !== 'all') {
                    $image.classList.remove(this.hiddenClass);
                    $image.style.display = 'grid';
                    console.log(`Listing ${$image.dataset.category} shown, visible items: ${items.filter(i => i.style.display === 'block').length}`);
                }
            }
        });

        if (!preserveFilterState && (filter === 'all' || filter === 'pinned')) {
            this.$searchSelect.value = 'all';
            this.$filters.forEach(f => f.classList.remove(this.activeClass));
            const targetButton = Array.from(this.$filters).find(f => f.dataset.filter === filter);
            if (targetButton) {
                targetButton.classList.add(this.activeClass);
                this.$activeFilter = targetButton;
                console.log(`Active filter set to ${filter}`);
            }
        }

        const dividers = document.querySelectorAll('.cs-series-divider');
        console.log(`Found ${dividers.length} dividers`);

        dividers.forEach((divider, index) => {
            if (filter === 'all' || filter === 'pinned') {
                if (searchQuery || filter === 'pinned') {
                    divider.classList.add(this.hiddenDividerClass);
                    console.log(`Divider ${index} hidden (search or pinned active)`);
                } else {
                    divider.classList.remove(this.hiddenDividerClass);
                    console.log(`Divider ${index} shown (no search, All view)`);
                }
            } else {
                divider.classList.add(this.hiddenDividerClass);
                console.log(`Divider ${index} hidden (series-specific filter)`);
            }
        });

        const visibleListings = document.querySelectorAll(`.cs-listing:not(.${this.hiddenClass})`);
        console.log(`Visible listings after filter: ${visibleListings.length}`);
        const visibleCards = document.querySelectorAll(`.cs-listing:not(.${this.hiddenClass}) .cs-item:not(.cs-logo-item)[style*="display: block"]`);
        console.log(`Visible cards after filtering: ${visibleCards.length}`);

        if (!this.isImagePopupsSetup) {
            this.setupImagePopups();
        }
        this.setupCardInteractions();
        this.setupOutsideClick();
    }
}

new GalleryFilter();