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
            this.$images = document.querySelectorAll(this.imagesSelector);
            if (this.$filters.length > 0) {
                this.$activeFilter = Array.from(this.$filters).find(f => f.dataset.filter === 'all') || this.$filters[0];
                this.$activeFilter.classList.add(this.activeClass);
            }
            for (const $filter of this.$filters) {
                $filter.addEventListener("click", () => this.onClick($filter));
            }

            // Setup image pop-up listeners
            this.setupImagePopups();
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
            this.$listingWrapper.innerHTML = '<p style="color: var(--bodyTextColorWhite); text-align: center;">Failed to load figures. Please try again.</p>';
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

            // Add series title
            const title = document.createElement('h3');
            title.className = 'cs-series-title';
            title.textContent = series;
            listing.appendChild(title);

            // Add figures
            figures[series].forEach(figure => {
                const item = document.createElement('div');
                item.className = 'cs-item';
                item.innerHTML = `
                    <div class="cs-item-content">
                        <div class="cs-picture-group">
                            <picture class="cs-picture">
                                <img loading="lazy" decoding="async" src="${figure.image}" alt="${figure.name}" width="305" height="400" onerror="this.src='https://via.placeholder.com/305x400?text=Image+Failed'" class="clickable-image">
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
        Object.keys(figures).forEach(series => {
            figures[series].forEach(figure => {
                if (figure.purchased) {
                    const item = document.createElement('div');
                    item.className = 'cs-item';
                    item.innerHTML = `
                        <div class="cs-item-content">
                            <div class="cs-picture-group">
                                <picture class="cs-picture">
                                    <img loading="lazy" decoding="async" src="${figure.image}" alt="${figure.name}" width="305" height="400" onerror="this.src='https://via.placeholder.com/305x400?text=Image+Failed'" class="clickable-image">
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
                }
            });
        });
        this.$listingWrapper.appendChild(purchasedListing);

        // Render all listing with series sections, no titles
        const allListing = document.createElement('div');
        allListing.className = `cs-listing cs-hidden`;
        allListing.dataset.category = 'all';
        Object.keys(figures).forEach(series => {
            const seriesSection = document.createElement('section');
            seriesSection.className = 'cs-series-section';
            figures[series].forEach(figure => {
                const item = document.createElement('div');
                item.className = 'cs-item';
                item.innerHTML = `
                    <div class="cs-item-content">
                        <div class="cs-picture-group">
                            <picture class="cs-picture">
                                <img loading="lazy" decoding="async" src="${figure.image}" alt="${figure.name}" width="305" height="400" onerror="this.src='https://via.placeholder.com/305x400?text=Image+Failed'" class="clickable-image">
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

        this.$images = document.querySelectorAll(this.imagesSelector);
        this.setupImagePopups();
    }

    // Setup click listeners for image pop-ups
    setupImagePopups() {
        const images = document.querySelectorAll('.clickable-image');
        images.forEach(image => {
            image.addEventListener('click', () => {
                const overlay = document.createElement('div');
                overlay.className = 'image-overlay';
                overlay.innerHTML = `<img src="${image.src}" alt="${image.alt}" class="enlarged-image">`;
                document.body.appendChild(overlay);
                overlay.addEventListener('click', () => overlay.remove());
            });
        });
    }

    // Handle filter button clicks
    onClick($filter) {
        console.log('Filter clicked:', $filter.dataset.filter); // Debug log
        this.filter($filter.dataset.filter);
        const { activeClass } = this;
        this.$activeFilter.classList.remove(activeClass);
        $filter.classList.add(activeClass);
        this.$activeFilter = $filter;
    }

    // Filter figures and trigger animations
    filter(filter) {
        console.log('Filtering:', filter); // Debug log
        const showAll = filter === "all";
        const { hiddenClass } = this;

        // Toggle cs-hidden for animations
        for (const $image of this.$images) {
            const show = showAll || $image.dataset.category === filter;
            $image.classList.toggle(hiddenClass, !show);
        }
    }
}

// Initialize the gallery
new GalleryFilter();