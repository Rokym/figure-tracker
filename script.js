// GalleryFilter class to manage filtering, rendering, and interactions
class GalleryFilter {
    // CSS selectors and class names
    filtersSelector = ".cs-button";
    imagesSelector = ".cs-listing";
    activeClass = "cs-active";
    hiddenClass = "cs-hidden";

    constructor() {
        // DOM elements
        this.$buttonGroup = document.querySelector('.cs-button-group');
        this.$listingWrapper = document.querySelector('.cs-listing-wrapper');
        this.$dropdown = document.querySelector('.cs-dropdown-content');

        // Load figures and initialize
        this.loadFigures().then(figures => {
            this.figures = figures;

            // Populate dropdown with series
            this.renderDropdown(figures);

            // Create all listings (series, purchased, all)
            this.renderAllListings(figures);

            // Default to All tab
            this.filter('all');

            // Initialize filter buttons
            this.$filters = document.querySelectorAll(this.filtersSelector);
            this.$images = document.querySelectorAll(this.imagesSelector) || [];
            if (this.$filters.length > 0) {
                this.$activeFilter = Array.from(this.$filters).find(f => f.dataset.filter === 'all') || this.$filters[0];
                this.$activeFilter.classList.add(this.activeClass);
            }
            for (const $filter of this.$filters) {
                $filter.addEventListener("click", () => this.onClick($filter));
            }

            // Setup image pop-up and zoom listeners
            this.setupImagePopups();
            this.setupZoomDebug();

            // Debug: Log initial card count
            console.log('Initial card count:', document.querySelectorAll('.cs-item').length);
        }).catch(error => {
            console.error('Initialization failed:', error);
            this.$listingWrapper.innerHTML = '<p style="color: var(--bodyTextColorWhite); text-align: center;">Failed to initialize gallery. Please check figures.json.</p>';
        });
    }

    // Fetch figures.json
    async loadFigures() {
        try {
            const response = await fetch('figures.json');
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            return await response.json();
        } catch (error) {
            console.error('Error loading figures.json:', error);
            return {};
        }
    }

    // Render dropdown menu with series buttons
    renderDropdown(figures) {
        this.$dropdown.innerHTML = '';
        Object.keys(figures).forEach(series => {
            const button = document.createElement('button');
            button.className = 'cs-button';
            button.dataset.filter = `series-${series}`;
            button.textContent = series;
            button.addEventListener('click', () => this.onClick(button));
            this.$dropdown.appendChild(button);
        });
    }

    // Render all listings (one per series, purchased, all)
    renderAllListings(figures) {
        this.$listingWrapper.innerHTML = '';

        // Render listing for each series
        Object.keys(figures).forEach(series => {
            const listing = document.createElement('div');
            listing.className = `cs-listing cs-hidden`;
            listing.dataset.category = `series-${series}`;

            // Add logo card
            const logoItem = document.createElement('div');
            logoItem.className = 'cs-item cs-logo-item';
            // Use series-level logo
            const logoUrl = figures[series].logo || 'https://placehold.co/150x60?text=Logo+Missing';
            logoItem.innerHTML = `
                <img class="cs-series-logo" src="${logoUrl}" alt="${series} Logo">
            `;
            listing.appendChild(logoItem);
            console.log(`Rendered logo for ${series}: ${logoUrl}`);

            // Add figures
            figures[series].figures.forEach(figure => {
                const item = document.createElement('div');
                item.className = 'cs-item';
                item.innerHTML = `
                    <div class="cs-item-content">
                        <div class="cs-picture-group">
                            <picture class="cs-picture">
                                <img loading="lazy" decoding="async" src="${figure.image}" alt="${figure.name}" width="305" height="400" onerror="this.src='https://placehold.co/305x400?text=Image+Failed'" class="clickable-image">
                            </picture>
                        </div>
                        <div class="cs-details">
                            <span class="cs-category">${figure.type}</span>
                            <h3 class="cs-name">${figure.name}</h3>
                            <p class="cs-description">${figure.description || 'No description available'}</p>
                            <div class="cs-actions">
                                <div class="cs-flex">
                                    <span class="cs-price">${figure.company}</span>
                                    <span class="cs-was-price">${figure.released}</span>
                                </div>
                                <a href="${figure.link || '#'}" class="cs-buy">
                                    <img class="cs-basket" src="https://csimg.nyc3.cdn.digitaloceanspaces.com/Images/Icons/ecomm-bag-icon.svg" alt="buy" height="24" width="24" loading="lazy" decoding="async">
                                </a>
                            </div>
                        </div>
                    </div>
                `;
                listing.appendChild(item);
            });
            this.$listingWrapper.appendChild(listing);
        });

        // Render purchased listing
        const purchasedListing = document.createElement('div');
        purchasedListing.className = `cs-listing cs-hidden`;
        purchasedListing.dataset.category = 'purchased';
        const purchasedTitle = document.createElement('h3');
        purchasedTitle.className = 'cs-series-title';
        purchasedTitle.textContent = 'Purchased Figures';
        purchasedListing.appendChild(purchasedTitle);

        // Group purchased figures by series
        const purchasedBySeries = {};
        Object.keys(figures).forEach(series => {
            purchasedBySeries[series] = figures[series].figures.filter(figure => figure.purchased);
        });

        Object.keys(purchasedBySeries).forEach(series => {
            if (purchasedBySeries[series].length > 0) {
                // Add logo card
                const logoItem = document.createElement('div');
                logoItem.className = 'cs-item cs-logo-item';
                const logoUrl = figures[series].logo || 'https://placehold.co/150x60?text=Logo+Missing';
                logoItem.innerHTML = `
                    <img class="cs-series-logo" src="${logoUrl}" alt="${series} Logo">
                `;
                purchasedListing.appendChild(logoItem);
                console.log(`Rendered purchased logo for ${series}: ${logoUrl}`);

                // Add figures
                purchasedBySeries[series].forEach(figure => {
                    const item = document.createElement('div');
                    item.className = 'cs-item';
                    item.innerHTML = `
                        <div class="cs-item-content">
                            <div class="cs-picture-group">
                                <picture class="cs-picture">
                                    <img loading="lazy" decoding="async" src="${figure.image}" alt="${figure.name}" width="305" height="400" onerror="this.src='https://placehold.co/305x400?text=Image+Failed'" class="clickable-image">
                                </picture>
                            </div>
                            <div class="cs-details">
                                <span class="cs-category">${figure.type}</span>
                                <h3 class="cs-name">${figure.name}</h3>
                                <p class="cs-description">${figure.description || 'No description available'}</p>
                                <div class="cs-actions">
                                    <div class="cs-flex">
                                        <span class="cs-price">${figure.company}</span>
                                        <span class="cs-was-price">${figure.released}</span>
                                    </div>
                                    <a href="${figure.link || '#'}" class="cs-buy">
                                        <img class="cs-basket" src="https://csimg.nyc3.cdn.digitaloceanspaces.com/Images/Icons/ecomm-bag-icon.svg" alt="buy" height="24" width="24" loading="lazy" decoding="async">
                                    </a>
                                </div>
                            </div>
                        </div>
                    `;
                    purchasedListing.appendChild(item);
                });
            }
        });
        this.$listingWrapper.appendChild(purchasedListing);

        // Render all listing with series sections and logos
        const allListing = document.createElement('div');
        allListing.className = `cs-listing cs-hidden`;
        allListing.dataset.category = 'all';
        Object.keys(figures).forEach(series => {
            const seriesSection = document.createElement('section');
            seriesSection.className = 'cs-series-section';

            // Add logo card
            const logoItem = document.createElement('div');
            logoItem.className = 'cs-item cs-logo-item';
            const logoUrl = figures[series].logo || 'https://placehold.co/150x60?text=Logo+Missing';
            logoItem.innerHTML = `
                <img class="cs-series-logo" src="${logoUrl}" alt="${series} Logo">
            `;
            seriesSection.appendChild(logoItem);
            console.log(`Rendered all logo for ${series}: ${logoUrl}`);

            // Add figures
            figures[series].figures.forEach(figure => {
                const item = document.createElement('div');
                item.className = 'cs-item';
                item.innerHTML = `
                    <div class="cs-item-content">
                        <div class="cs-picture-group">
                            <picture class="cs-picture">
                                <img loading="lazy" decoding="async" src="${figure.image}" alt="${figure.name}" width="305" height="400" onerror="this.src='https://placehold.co/305x400?text=Image+Failed'" class="clickable-image">
                            </picture>
                        </div>
                        <div class="cs-details">
                            <span class="cs-category">${figure.type}</span>
                            <h3 class="cs-name">${figure.name}</h3>
                            <p class="cs-description">${figure.description || 'No description available'}</p>
                            <div class="cs-actions">
                                <div class="cs-flex">
                                    <span class="cs-price">${figure.company}</span>
                                    <span class="cs-was-price">${figure.released}</span>
                                </div>
                                <a href="${figure.link || '#'}" class="cs-buy">
                                    <img class="cs-basket" src="https://csimg.nyc3.cdn.digitaloceanspaces.com/Images/Icons/ecomm-bag-icon.svg" alt="buy" height="24" width="24" loading="lazy" decoding="async">
                                </a>
                            </div>
                        </div>
                    </div>
                `;
                seriesSection.appendChild(item);
            });
            allListing.appendChild(seriesSection);
            // Add divider
            const divider = document.createElement('hr');
            divider.className = 'cs-series-divider';
            allListing.appendChild(divider);
        });
        this.$listingWrapper.appendChild(allListing);

        // Update images after rendering
        this.$images = document.querySelectorAll(this.imagesSelector) || [];
        this.setupImagePopups();
        this.setupZoomDebug();
    }

    // Setup click listeners for image pop-ups
    setupImagePopups() {
        // Remove existing overlays
        const existingOverlays = document.querySelectorAll('.image-overlay');
        existingOverlays.forEach(overlay => overlay.remove());

        const images = document.querySelectorAll('.clickable-image');
        images.forEach(image => {
            image.addEventListener('click', () => {
                // Lock background scrolling
                document.body.classList.add('cs-overlay-open');

                // Create overlay
                const overlay = document.createElement('div');
                overlay.className = 'image-overlay';
                overlay.innerHTML = `
                    <img src="${image.src}" alt="${image.alt}" class="enlarged-image">
                    <button class="cs-close-overlay">X</button>
                `;
                document.body.appendChild(overlay);
                console.log('Overlay opened:', image.src);

                // Close on click outside
                overlay.addEventListener('click', (e) => {
                    if (e.target === overlay) {
                        overlay.remove();
                        document.body.classList.remove('cs-overlay-open');
                        console.log('Overlay closed: click outside');
                    }
                });

                // Close on close button
                const closeButton = overlay.querySelector('.cs-close-overlay');
                closeButton.addEventListener('click', () => {
                    overlay.remove();
                    document.body.classList.remove('cs-overlay-open');
                    console.log('Overlay closed: close button');
                });

                // Close on ESC key
                const onKeydown = (e) => {
                    if (e.key === 'Escape') {
                        overlay.remove();
                        document.body.classList.remove('cs-overlay-open');
                        document.removeEventListener('keydown', onKeydown);
                        console.log('Overlay closed: ESC key');
                    }
                };
                document.addEventListener('keydown', onKeydown);
            });
        });
    }

    // Debug hover zoom
    setupZoomDebug() {
        const pictures = document.querySelectorAll('.cs-picture');
        pictures.forEach(pic => {
            pic.addEventListener('mouseenter', () => {
                console.log('Hover on picture:', pic.querySelector('img').src);
            });
            pic.addEventListener('mouseleave', () => {
                console.log('Hover off picture:', pic.querySelector('img').src);
            });
        });
    }

    // Handle filter button clicks
    onClick($filter) {
        console.log('Filter clicked:', $filter.dataset.filter);
        this.filter($filter.dataset.filter);
        const { activeClass } = this;
        this.$activeFilter.classList.remove(activeClass);
        $filter.classList.add(activeClass);
        this.$activeFilter = $filter;
    }

    // Filter figures and trigger animations
    filter(filter) {
        console.log('Filtering:', filter);
        const showAll = filter === "all";
        const { hiddenClass } = this;

        // Ensure $images is iterable
        const images = this.$images.length ? this.$images : [];
        for (const $image of images) {
            const show = showAll || $image.dataset.category === filter;
            $image.classList.toggle(hiddenClass, !show);
            if (show) {
                $image.offsetHeight; // Force reflow
                const items = $image.querySelectorAll('.cs-item');
                items.forEach((item, index) => {
                    console.log(`Card ${index + 1} in ${$image.dataset.category}: transform ${item.style.transform || 'none'}`);
                });
            }
        }
    }
}

// Initialize the gallery
new GalleryFilter();