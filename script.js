// GalleryFilter class to manage filtering, rendering, and interactions
class GalleryFilter {
    // CSS selectors and class names
    filtersSelector = ".cs-button"; // Selector for filter buttons
    imagesSelector = ".cs-listing"; // Selector for the listing grid
    activeClass = "cs-active"; // Class for active filter button
    hiddenClass = "cs-hidden"; // Class to hide inactive listings

    constructor() {
        // DOM elements
        this.$buttonGroup = document.querySelector('.cs-button-group'); // Button group container
        this.$listingWrapper = document.querySelector('.cs-listing-wrapper'); // Wrapper for the grid
        this.$dropdown = document.querySelector('.cs-dropdown-content'); // Dropdown menu

        // Load figures and initialize
        this.loadFigures().then(figures => {
            this.figures = figures;

            // Populate dropdown with series
            this.renderDropdown(figures);

            // Create single all listing with series sections
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
                $filter.addEventListener("click", () => this.onClick($filter)); // Add click handler for filters
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
            button.dataset.filter = series; // Use series name directly as filter
            button.textContent = series;
            button.addEventListener('click', () => this.onClick(button));
            this.$dropdown.appendChild(button);
        });
    }

    // Render single all listing with series sections
    renderAllListings(figures) {
        this.$listingWrapper.innerHTML = '';

        const allListing = document.createElement('div');
        allListing.className = `cs-listing`;
        allListing.dataset.category = 'all';

        Object.keys(figures).forEach(series => {
            const seriesSection = document.createElement('section');
            seriesSection.className = 'cs-series-section';
            seriesSection.dataset.category = series; // Add data-category for filtering

            // Add logo card as first item
            const logoItem = document.createElement('div');
            logoItem.className = 'cs-item cs-logo-item';
            const logoUrl = figures[series].logo || 'https://placehold.co/150x60?text=Logo+Missing';
            logoItem.innerHTML = `
                <img class="cs-series-logo" src="${logoUrl}" alt="${series} Logo">
            `;
            seriesSection.appendChild(logoItem);
            console.log(`Rendered logo for ${series}: ${logoUrl}`);

            // Add all figure cards, with first row limited to 4 after logo
            figures[series].figures.forEach((figure, index) => {
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

            // Add divider (except after the last series)
            if (series !== Object.keys(figures)[Object.keys(figures).length - 1]) {
                const divider = document.createElement('hr');
                divider.className = 'cs-series-divider';
                allListing.appendChild(divider);
            }
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
                document.body.classList.add('cs-overlay-open');

                const overlay = document.createElement('div');
                overlay.className = 'image-overlay';
                overlay.innerHTML = `
                    <img src="${image.src}" alt="${image.alt}" class="enlarged-image">
                    <button class="cs-close-overlay">X</button>
                `;
                document.body.appendChild(overlay);
                console.log('Overlay opened:', image.src);

                overlay.addEventListener('click', (e) => {
                    if (e.target === overlay) {
                        overlay.remove();
                        document.body.classList.remove('cs-overlay-open');
                        console.log('Overlay closed: click outside');
                    }
                });

                const closeButton = overlay.querySelector('.cs-close-overlay');
                closeButton.addEventListener('click', () => {
                    overlay.remove();
                    document.body.classList.remove('cs-overlay-open');
                    console.log('Overlay closed: close button');
                });

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

        // Show only the selected series section
        if (!showAll) {
            console.log('Selected filter value:', filter); // Debug the filter value
            const allSections = document.querySelectorAll('.cs-series-section');
            allSections.forEach(section => {
                const sectionCategory = section.dataset.category;
                console.log('Section category to check:', sectionCategory); // Debug each section's category
                const shouldShow = sectionCategory === filter;
                section.classList.remove(hiddenClass); // Remove hidden class
                if (!shouldShow) section.classList.add(hiddenClass); // Add only if hiding
                section.offsetHeight; // Force reflow for transition
                section.style.display = shouldShow ? 'grid' : 'none'; // Force display state
                console.log(`Section ${sectionCategory} final visibility: ${section.style.display}, classList: ${Array.from(section.classList)}`); // Confirm final state and classes
            });
        } else {
            document.querySelectorAll('.cs-series-section').forEach(section => {
                section.classList.remove(hiddenClass);
                section.style.display = 'grid';
            });
        }
    }
}

// Initialize the gallery
new GalleryFilter();