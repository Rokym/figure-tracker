class GalleryFilter {
    filtersSelector = ".cs-button";
    imagesSelector = ".cs-listing";
    activeClass = "cs-active";
    hiddenClass = "cs-hidden";
    hiddenDividerClass = "cs-hidden-divider";
    expandedClass = "cs-expanded";
    isImagePopupsSetup = false;

    constructor() {
        this.$modal = document.createElement('div');
        this.$modal.id = 'myModal';
        this.$modal.className = 'modal';
        this.$modal.setAttribute('style', 'display: none !important;');
        this.$modal.innerHTML = `
            <span class="close">×</span>
            <img class="modal-content" id="img01" loading="lazy" decoding="async">
            <div id="caption"></div>
        `;
        document.body.insertBefore(this.$modal, document.body.firstChild);
        console.log('Modal created and prepended to body, initial display: none');

        this.$modalImg = this.$modal.querySelector('#img01');
        this.$captionText = this.$modal.querySelector('#caption');
        this.$closeBtn = this.$modal.querySelector('.close');

        this.$buttonGroup = document.querySelector('.cs-button-group');
        this.$listingWrapper = document.querySelector('.cs-listing-wrapper');
        this.$dropdown = document.querySelector('.cs-dropdown-content');

        console.log('Modal parent:', this.$modal.parentElement.tagName);
        console.log('Modal initial styles:', {
            display: window.getComputedStyle(this.$modal).display,
            position: window.getComputedStyle(this.$modal).position,
            zIndex: window.getComputedStyle(this.$modal).zIndex
        });
        console.log('Initial DOM state: cs-listing-wrapper children:', this.$listingWrapper ? this.$listingWrapper.children.length : 'Not found');
        console.log('Initial cs-listing count:', document.querySelectorAll('.cs-listing').length);

        // Set up event delegation for .cs-show-more clicks
        this.$listingWrapper.addEventListener('click', (e) => {
            const button = e.target.closest('.cs-show-more');
            if (button) {
                const item = button.closest('.cs-item:not(.cs-logo-item)');
                if (item) {
                    this.handleShowMoreClick(item, e);
                    console.log(`Delegated click on Show More for card: ${item.querySelector('.cs-name').textContent}`);
                }
            }
        });
        console.log('Event delegation set up for .cs-show-more clicks on .cs-listing-wrapper');

        document.addEventListener('DOMContentLoaded', () => {
            if (this.$modal.style.display !== 'none' || window.getComputedStyle(this.$modal).display !== 'none') {
                console.warn('Modal visible after DOMContentLoaded, forcing hide');
                this.$modal.style.display = 'none';
                this.$modal.setAttribute('style', 'display: none !important;');
                console.log('Modal styles after force hide:', {
                    display: window.getComputedStyle(this.$modal).display
                });
            }
        });

        this.loadFigures().then(figures => {
            this.figures = figures;
            if (!figures || !Object.keys(figures).length) {
                console.error('No figures loaded from figures.json');
                this.$listingWrapper.innerHTML = '<p style="color: var(--text-color); text-align: center;">Failed to initialize gallery. Please check figures.json.</p>';
                return;
            }

            console.log('Loaded series:', Object.keys(figures).sort());

            this.renderDropdown(figures);
            this.renderAllListings(figures);
            this.filter('all');

            this.$filters = document.querySelectorAll(this.filtersSelector);
            this.$images = document.querySelectorAll(this.imagesSelector) || [];
            console.log('Filters found:', this.$filters.length);
            console.log('Listings found after render:', this.$images.length);

            if (this.$filters.length > 0) {
                this.$activeFilter = Array.from(this.$filters).find(f => f.dataset.filter === 'all') || this.$filters[0];
                this.$activeFilter.classList.add(this.activeClass);
                console.log('Active filter set:', this.$activeFilter.dataset.filter);
            }
            for (const $filter of this.$filters) {
                $filter.removeEventListener('click', this.onClick);
                $filter.addEventListener('click', () => this.onClick($filter));
            }

            this.setupImagePopups();
            this.setupOutsideClick();
            console.log('Initial card count:', document.querySelectorAll('.cs-item').length);
            console.log('Listing wrapper width:', window.getComputedStyle(this.$listingWrapper).width);
        }).catch(error => {
            console.error('Initialization failed:', error);
            this.$listingWrapper.innerHTML = '<p style="color: var(--text-color); text-align: center;">Failed to initialize gallery. Please check figures.json.</p>';
        });
    }

    async loadFigures() {
        try {
            const response = await fetch('figures.json');
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            const data = await response.json();
            console.log('Figures loaded successfully. Series count:', Object.keys(data).length);
            return data;
        } catch (error) {
            console.error('Error loading figures.json:', error);
            return {};
        }
    }

    renderDropdown(figures) {
        this.$dropdown.innerHTML = '';
        Object.keys(figures).forEach(series => {
            const button = document.createElement('button');
            button.className = 'cs-button';
            button.dataset.filter = `series-${series}`;
            button.textContent = series;
            button.addEventListener('click', () => this.onClick(button));
            this.$dropdown.appendChild(button);
            console.log(`Dropdown button added for series: ${series}`);
        });
        console.log('Dropdown buttons rendered:', this.$dropdown.children.length);
    }

    renderAllListings(figures) {
        this.$listingWrapper.innerHTML = '';
        console.log('Cleared cs-listing-wrapper to prevent duplication');

        Object.keys(figures).forEach(series => {
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
                console.log(`Rendering figure for ${series}: ${figure.name}, Image: ${figure.image}`);
                const item = document.createElement('div');
                item.className = 'cs-item';
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
                            <button class="cs-buy-now">Buy Now</button>
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
                console.log(`Rendering all figure for ${series}: ${figure.name}, Image: ${figure.image}`);
                const item = document.createElement('div');
                item.className = 'cs-item';
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
                            <button class="cs-buy-now">Buy Now</button>
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

            if (index === 0 && figures[series].figures.length > 5) {
                figures[series].figures.slice(5).forEach(figure => {
                    console.log(`Rendering additional figure for ${series}: ${figure.name}, Image: ${figure.image}`);
                    const item = document.createElement('div');
                    item.className = 'cs-item';
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
                                <button class="cs-buy-now">Buy Now</button>
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

            if (index < sortedSeries.length - 1) {
                const divider = document.createElement('hr');
                divider.className = 'cs-series-divider';
                allListing.appendChild(divider);
                console.log(`Added divider after ${series}`);
            }
        });
        this.$listingWrapper.appendChild(allListing);
        console.log(`All listing rendered, items: ${allListing.querySelectorAll('.cs-item').length}, sections: ${allListing.querySelectorAll('.cs-series-section').length}`);

        this.$images = document.querySelectorAll(this.imagesSelector) || [];
        console.log(`Total listings rendered: ${this.$images.length}`);
        console.log('Listing categories:', Array.from(this.$images).map(img => img.dataset.category));

        console.log('DOM structure of cs-listing-wrapper (truncated):', this.$listingWrapper.innerHTML.substring(0, 500) + '...');
        if (!this.isImagePopupsSetup) {
            this.setupImagePopups();
        }
        this.setupCardInteractions();
        this.setupOutsideClick();
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

        this.$closeBtn.removeEventListener('click', this.handleCloseClick);
        this.$closeBtn.addEventListener('click', this.handleCloseClick.bind(this));
        console.log('Event listener added to close button');

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
                console.log('Modal closed: click outside');
                console.log('Modal styles after close:', {
                    display: window.getComputedStyle(this.$modal).display
                });
            }, 0);
        }
    }

    handleEscKey(e) {
        if (e.key === 'Escape' && this.$modal.style.display === 'block') {
            setTimeout(() => {
                this.$modal.style.display = 'none';
                this.$modal.setAttribute('style', 'display: none !important;');
                document.body.classList.remove('cs-modal-open');
                console.log('Modal closed: ESC key');
                console.log('Modal styles after close:', {
                    display: window.getComputedStyle(this.$modal).display
                });
            }, 0);
        }
    }

    handleImageClick(event) {
        event.stopPropagation();
        const image = event.target;
        this.$modalImg.src = '';
        this.$modalImg.src = image.src;
        this.$captionText.innerHTML = image.alt;
        setTimeout(() => {
            this.$modal.style.display = 'block';
            this.$modal.removeAttribute('style');
            document.body.classList.add('cs-modal-open');
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
                // Note: Event listeners are now handled via delegation in constructor
                console.log(`Found Show More button for card: ${item.querySelector('.cs-name').textContent}`);
            } else {
                console.warn(`No .cs-show-more button found in card: ${item.querySelector('.cs-name').textContent}`);
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
                    console.log(`Card ${item.querySelector('.cs-name').textContent} collapsed via outside click`);
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
                    console.log(`Card ${item.querySelector('.cs-name').textContent} collapsed via outside touch`);
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
            console.log(`Card ${item.querySelector('.cs-name').textContent} ${isExpanded ? 'expanded' : 'collapsed'}`);
            const detailsOverlay = item.querySelector('.cs-details-overlay');
            const detailsContent = item.querySelector('.cs-details-content');
            console.log(`Details overlay styles for ${item.querySelector('.cs-name').textContent}:`, {
                top: window.getComputedStyle(detailsOverlay).top,
                height: window.getComputedStyle(detailsOverlay).height,
                transition: window.getComputedStyle(detailsOverlay).transition
            });
            console.log(`Details content styles for ${item.querySelector('.cs-name').textContent}:`, {
                paddingTop: window.getComputedStyle(detailsContent).paddingTop,
                maxHeight: window.getComputedStyle(detailsContent).maxHeight,
                height: window.getComputedStyle(detailsContent).height
            });
        }
    }

    onClick($filter) {
        if ($filter === this.$activeFilter) {
            console.log('Filter already active:', $filter.dataset.filter);
            return;
        }
        console.log('Filter clicked:', $filter.dataset.filter);
        this.filter($filter.dataset.filter);
        this.$activeFilter.classList.remove(this.activeClass);
        $filter.classList.add(this.activeClass);
        this.$activeFilter = $filter;
    }

    filter(filter) {
        console.log('Filtering:', filter);
        const images = document.querySelectorAll(this.imagesSelector) || [];
        console.log(`Found ${images.length} listings:`, Array.from(images).map(img => ({
            category: img.dataset.category,
            hidden: img.classList.contains(this.hiddenClass),
            items: img.querySelectorAll('.cs-item').length
        })));

        if (!images.length) {
            console.error('No .cs-listing elements found. Check renderAllListings.');
            this.$listingWrapper.innerHTML = '<p style="color: var(--text-color); text-align: center;">No listings found. Check DOM.</p>';
            return;
        }

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
            const shouldShow = filter === 'all' ? $image.dataset.category === 'all' : $image.dataset.category === filter;
            if (shouldShow) {
                $image.classList.remove(this.hiddenClass);
                $image.style.opacity = '1';
                $image.style.visibility = 'visible';
                $image.style.transform = 'scale(1)';
                $image.style.position = 'relative';
                $image.style.pointerEvents = 'auto';
                console.log(`Listing ${$image.dataset.category} shown, items: ${$image.querySelectorAll('.cs-item').length}`);
            }
        });

        const dividers = document.querySelectorAll('.cs-series-divider');
        console.log(`Found ${dividers.length} dividers`);

        dividers.forEach((divider, index) => {
            if (filter === 'all') {
                divider.classList.remove(this.hiddenDividerClass);
                console.log(`Divider ${index} shown`);
            } else {
                divider.classList.add(this.hiddenDividerClass);
                console.log(`Divider ${index} hidden`);
            }
        });

        const visibleListings = document.querySelectorAll(`.cs-listing:not(.${this.hiddenClass})`);
        console.log(`Visible listings after filter: ${visibleListings.length}`, Array.from(visibleListings).map(l => l.dataset.category));
        const visibleCards = document.querySelectorAll(`.cs-listing:not(.${this.hiddenClass}) .cs-item`);
        console.log(`Visible cards after filtering: ${visibleCards.length}`);
        if (filter === 'all') {
            const allListing = document.querySelector('.cs-listing[data-category="all"]');
            if (allListing) {
                console.log('All listing sections:', Array.from(allListing.querySelectorAll('.cs-series-section')).map(s => s.dataset.category));
                console.log('All listing items:', Array.from(allListing.querySelectorAll('.cs-item:not(.cs-logo-item)')).map(i => i.querySelector('.cs-name').textContent));
                const allListingStyles = window.getComputedStyle(allListing);
                console.log('All listing CSS styles:', {
                    display: allListingStyles.display,
                    gridTemplateColumns: allListingStyles.gridTemplateColumns,
                    gap: allListingStyles.gap,
                    width: allListingStyles.width
                });
                const firstSection = allListing.querySelector('.cs-series-section');
                if (firstSection) {
                    const sectionStyles = window.getComputedStyle(firstSection);
                    console.log('First series section CSS styles:', {
                        display: sectionStyles.display,
                        width: sectionStyles.width
                    });
                }
                const firstItem = allListing.querySelector('.cs-item:not(.cs-logo-item)');
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