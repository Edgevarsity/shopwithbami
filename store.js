/* ==========================================================
   shopwithbami — Storefront Interactions
   ========================================================== */

(function () {
    "use strict";

    const SWB = window.SWB;
    if (!SWB) return;

    /* ---------- Hero Banner Carousel ---------- */

    const heroSlides = [
        {
            src: "Assets/shopwithbami-hero.svg",
            alt: "Welcome to shopwithbami — Fresh deals across fashion, tech, home and more",
            action: { type: "scroll", target: "#flash-sales-section" }
        },
        {
            src: "Assets/Homepage-slider-1248x357.jpg",
            alt: "Brand Festival — ASUS Computing Brand Day",
            action: { type: "section", id: "computing-deals" }
        },
        {
            src: "Assets/Homepage-slider.jpg",
            alt: "Handbags and Wallets — Up to 60% off",
            action: { type: "category", category: "Fashion" }
        },
        {
            src: "Assets/1248X375.jpg",
            alt: "Home Makeover — Up to 50% off",
            action: { type: "category", category: "Home & Office" }
        },
        {
            src: "Assets/BEYOND-THE-BRAND.jpg",
            alt: "Beyond the Brand — Everyday value deals",
            action: { type: "section", id: "beyond-the-brand" }
        },
        {
            src: "Assets/trendyol-slider.jpg",
            alt: "Street Style Festival — Multi-buy fashion savings",
            action: { type: "category", category: "Fashion" }
        }
    ];

    let currentSlide = 0;
    let heroTimer = null;

    function renderHeroSlide(index) {
        const img = document.getElementById("image");
        const dotsWrap = document.getElementById("hero-dots");
        if (!img) return;

        currentSlide = (index + heroSlides.length) % heroSlides.length;
        const slide = heroSlides[currentSlide];

        img.classList.add("is-fading");
        setTimeout(function () {
            img.src = slide.src;
            img.alt = slide.alt;
            img.classList.remove("is-fading");
        }, 120);

        if (dotsWrap) {
            dotsWrap.querySelectorAll(".hero-dot").forEach(function (dot, i) {
                dot.classList.toggle("is-active", i === currentSlide);
                dot.setAttribute("aria-current", i === currentSlide ? "true" : "false");
            });
        }
    }

    function nextImage() {
        renderHeroSlide(currentSlide + 1);
        restartHeroAutoplay();
    }

    function previousImage() {
        renderHeroSlide(currentSlide - 1);
        restartHeroAutoplay();
    }

    // Expose globally for existing onclick attributes
    window.nextImage = nextImage;
    window.previousImage = previousImage;

    function restartHeroAutoplay() {
        clearInterval(heroTimer);
        heroTimer = setInterval(function () {
            renderHeroSlide(currentSlide + 1);
        }, 5500);
    }

    function initHeroSlider() {
        const slider = document.getElementById("hero-slider");
        const dotsWrap = document.getElementById("hero-dots");
        const slideLink = document.getElementById("hero-slide-link");
        if (!slider || !dotsWrap) return;

        dotsWrap.innerHTML = "";
        heroSlides.forEach(function (slide, idx) {
            const dot = document.createElement("button");
            dot.type = "button";
            dot.className = "hero-dot" + (idx === 0 ? " is-active" : "");
            dot.setAttribute("aria-label", `Go to slide ${idx + 1}`);
            dot.addEventListener("click", function () {
                renderHeroSlide(idx);
                restartHeroAutoplay();
            });
            dotsWrap.appendChild(dot);
        });

        if (slideLink) {
            slideLink.addEventListener("click", function (e) {
                const action = heroSlides[currentSlide].action;
                if (!action) return;
                if (action.type === "scroll") {
                    const target = document.querySelector(action.target);
                    if (target) {
                        e.preventDefault();
                        target.scrollIntoView({ behavior: "smooth" });
                    }
                } else if (action.type === "section") {
                    e.preventDefault();
                    openSectionView(action.id);
                } else if (action.type === "category") {
                    e.preventDefault();
                    openCatalogView({ title: action.category, category: action.category });
                }
            });
        }

        slider.addEventListener("mouseenter", function () { clearInterval(heroTimer); });
        slider.addEventListener("mouseleave", restartHeroAutoplay);
        restartHeroAutoplay();
    }

    /* ---------- Horizontal Scroll Helper ---------- */

    function bindHorizontalControls(track, leftBtn, rightBtn, stepRatio) {
        if (!track || !leftBtn || !rightBtn) return;
        const ratio = stepRatio || 0.75;

        function updateArrowState() {
            const maxScroll = Math.max(0, track.scrollWidth - track.clientWidth);
            leftBtn.disabled = track.scrollLeft <= 2;
            rightBtn.disabled = track.scrollLeft >= maxScroll - 2;
            leftBtn.classList.toggle("is-disabled", leftBtn.disabled);
            rightBtn.classList.toggle("is-disabled", rightBtn.disabled);
        }

        leftBtn.addEventListener("click", function () {
            const step = Math.max(240, Math.round(track.clientWidth * ratio));
            track.scrollBy({ left: -step, behavior: "smooth" });
        });

        rightBtn.addEventListener("click", function () {
            const step = Math.max(240, Math.round(track.clientWidth * ratio));
            track.scrollBy({ left: step, behavior: "smooth" });
        });

        track.addEventListener("scroll", updateArrowState, { passive: true });
        window.addEventListener("resize", updateArrowState);
        setTimeout(updateArrowState, 80);
    }

    /* ---------- Flash Sales Countdown Timer ---------- */

    function initFlashCountdown() {
        const hoursEl = document.getElementById("hours");
        const minsEl = document.getElementById("minutes");
        const secsEl = document.getElementById("seconds");
        const fillEl = document.getElementById("flash-sales-progress-fill");
        if (!hoursEl || !minsEl || !secsEl) return;

        const CYCLE_MS = 5 * 60 * 60 * 1000; // 5-hour flash sale cycle
        let endTime = Number(window.localStorage.getItem(SWB.STORAGE_KEYS.FLASH_END));
        if (!endTime || endTime <= Date.now() + 60000) {
            endTime = Date.now() + (4 * 3600 + 42 * 60 + 18) * 1000;
            try {
                window.localStorage.setItem(SWB.STORAGE_KEYS.FLASH_END, String(endTime));
            } catch (e) {}
        }

        function tick() {
            let remaining = endTime - Date.now();
            if (remaining <= 0) {
                endTime = Date.now() + CYCLE_MS;
                try {
                    window.localStorage.setItem(SWB.STORAGE_KEYS.FLASH_END, String(endTime));
                } catch (e) {}
                remaining = CYCLE_MS;
            }
            const totalSeconds = Math.floor(remaining / 1000);
            const h = Math.floor(totalSeconds / 3600);
            const m = Math.floor((totalSeconds % 3600) / 60);
            const s = totalSeconds % 60;

            hoursEl.textContent = String(h).padStart(2, "0");
            minsEl.textContent = String(m).padStart(2, "0");
            secsEl.textContent = String(s).padStart(2, "0");

            if (fillEl) {
                const elapsedPct = Math.min(96, Math.max(12, Math.round(((CYCLE_MS - remaining) / CYCLE_MS) * 100)));
                fillEl.style.width = elapsedPct + "%";
            }
        }

        tick();
        setInterval(tick, 1000);
    }

    /* ---------- Render Flash Sales & Product Shelves ---------- */

    function renderFlashSales() {
        const container = document.getElementById("flash-sales-products");
        const section = SWB.getSectionById("flash-sales");
        if (!container || !section) return;

        container.innerHTML = "";
        section.products.forEach(function (product) {
            container.appendChild(SWB.createProductCard(product, { showStockBar: true }));
        });
    }

    function renderProductShelves() {
        document.querySelectorAll("section[data-section-id]").forEach(function (el) {
            const secId = el.dataset.sectionId;
            const section = SWB.getSectionById(secId);
            if (!section || !section.products.length) return;

            el.innerHTML = "";

            const header = document.createElement("div");
            header.className = "shelf-header";

            const headingGroup = document.createElement("div");
            headingGroup.className = "shelf-heading-group";

            const title = document.createElement("h2");
            title.textContent = section.title;
            headingGroup.appendChild(title);

            if (section.subtitle) {
                const sub = document.createElement("span");
                sub.className = "shelf-subtitle";
                sub.textContent = section.subtitle;
                headingGroup.appendChild(sub);
            }

            const seeAllBtn = document.createElement("button");
            seeAllBtn.type = "button";
            seeAllBtn.className = "shelf-see-all";
            seeAllBtn.innerHTML = `See All <i class="fa-solid fa-arrow-right"></i>`;
            seeAllBtn.addEventListener("click", function () {
                openSectionView(section.id);
            });

            header.appendChild(headingGroup);
            header.appendChild(seeAllBtn);

            const trackWrapper = document.createElement("div");
            trackWrapper.className = "shelf-track-wrapper";

            const leftArrow = document.createElement("button");
            leftArrow.type = "button";
            leftArrow.className = "arrow arrow-left";
            leftArrow.setAttribute("aria-label", `Scroll ${section.title} left`);
            leftArrow.innerHTML = `<i class="fa-solid fa-chevron-left"></i>`;

            const list = document.createElement("div");
            list.className = "product-list";

            section.products.forEach(function (product) {
                list.appendChild(SWB.createProductCard(product, { showStockBar: false }));
            });

            const rightArrow = document.createElement("button");
            rightArrow.type = "button";
            rightArrow.className = "arrow arrow-right";
            rightArrow.setAttribute("aria-label", `Scroll ${section.title} right`);
            rightArrow.innerHTML = `<i class="fa-solid fa-chevron-right"></i>`;

            trackWrapper.appendChild(leftArrow);
            trackWrapper.appendChild(list);
            trackWrapper.appendChild(rightArrow);

            el.appendChild(header);
            el.appendChild(trackWrapper);

            bindHorizontalControls(list, leftArrow, rightArrow, 0.78);
        });
    }

    /* ---------- Filtered Catalog / Search Results View ---------- */

    let currentCatalogItems = [];
    let currentCatalogTitle = "";

    function sortItems(items, sortMode) {
        const list = items.slice();
        if (sortMode === "price-asc") {
            list.sort(function (a, b) { return a.price - b.price; });
        } else if (sortMode === "price-desc") {
            list.sort(function (a, b) { return b.price - a.price; });
        } else if (sortMode === "rating-desc") {
            list.sort(function (a, b) { return b.ratingNum - a.ratingNum; });
        } else if (sortMode === "discount-desc") {
            list.sort(function (a, b) { return b.discountPercent - a.discountPercent; });
        }
        return list;
    }

    function renderCatalogGrid() {
        const grid = document.getElementById("catalog-grid");
        const countEl = document.getElementById("catalog-view-count");
        const titleEl = document.getElementById("catalog-view-title");
        const sortSelect = document.getElementById("catalog-sort");
        if (!grid) return;

        const sorted = sortItems(currentCatalogItems, sortSelect ? sortSelect.value : "featured");
        titleEl.textContent = currentCatalogTitle;
        countEl.textContent = `${sorted.length} product${sorted.length === 1 ? "" : "s"} found`;

        grid.innerHTML = "";
        if (sorted.length === 0) {
            grid.innerHTML = `
                <div class="catalog-empty">
                    <i class="fa-solid fa-magnifying-glass"></i>
                    <h3>No matching products found</h3>
                    <p>Try searching for another keyword like "Samsung", "TV", "Sneakers", "Laptop", or "Blender".</p>
                    <button type="button" class="swb-primary-btn" id="catalog-reset-empty">View All Storefront Deals</button>
                </div>
            `;
            const resetBtn = document.getElementById("catalog-reset-empty");
            if (resetBtn) resetBtn.addEventListener("click", closeCatalogView);
            return;
        }

        sorted.forEach(function (product) {
            grid.appendChild(SWB.createProductCard(product, { showStockBar: product.isFlash }));
        });
    }

    function openCatalogView(opts) {
        const view = document.getElementById("catalog-view");
        const main = document.getElementById("storefront-main");
        const sortSelect = document.getElementById("catalog-sort");
        if (!view || !main) return;

        if (opts.items) {
            currentCatalogItems = opts.items;
        } else {
            currentCatalogItems = SWB.searchCatalog(opts.query || "", opts.category || "");
        }
        currentCatalogTitle = opts.title || "Catalog";

        if (sortSelect) sortSelect.value = opts.sort || "featured";
        renderCatalogGrid();

        main.hidden = true;
        view.hidden = false;

        // Highlight active category button if applicable
        document.querySelectorAll(".nav-two-child button").forEach(function (btn) {
            btn.classList.toggle("is-active", Boolean(opts.category && btn.dataset.category === opts.category));
        });

        window.scrollTo({ top: 0, behavior: "smooth" });
    }

    function openSectionView(sectionId) {
        const section = SWB.getSectionById(sectionId);
        if (!section) return;
        openCatalogView({
            title: section.title,
            items: section.products
        });
    }

    function closeCatalogView() {
        const view = document.getElementById("catalog-view");
        const main = document.getElementById("storefront-main");
        const input = document.getElementById("search-input");
        if (view) view.hidden = true;
        if (main) main.hidden = false;
        if (input) input.value = "";
        document.querySelectorAll(".nav-two-child button.is-active").forEach(function (btn) {
            btn.classList.remove("is-active");
        });
        if (window.location.search) {
            window.history.replaceState({}, "", window.location.pathname);
        }
        window.scrollTo({ top: 0, behavior: "smooth" });
    }

    /* ---------- Search Bar & Live Autocomplete ---------- */

    function initSearch() {
        const form = document.getElementById("search-form");
        const input = document.getElementById("search-input");
        const suggestions = document.getElementById("search-suggestions");
        if (!form || !input || !suggestions) return;

        function hideSuggestions() {
            suggestions.hidden = true;
            suggestions.innerHTML = "";
        }

        input.addEventListener("input", function () {
            const q = input.value.trim();
            if (q.length < 2) {
                hideSuggestions();
                return;
            }
            const matches = SWB.searchCatalog(q, "").slice(0, 6);
            if (matches.length === 0) {
                suggestions.innerHTML = `<div class="search-suggestion-empty">No quick matches for "${q.replace(/</g, "&lt;")}"</div>`;
                suggestions.hidden = false;
                return;
            }

            suggestions.innerHTML = "";
            matches.forEach(function (p) {
                const item = document.createElement("a");
                item.href = "product.html?id=" + encodeURIComponent(p.id);
                item.className = "search-suggestion-item";
                item.innerHTML = `
                    <img src="${p.image}" alt="">
                    <div class="search-suggestion-meta">
                        <span class="search-suggestion-name"></span>
                        <span class="search-suggestion-cat">${p.category}</span>
                    </div>
                    <strong class="search-suggestion-price">${p.priceFormatted}</strong>
                `;
                item.querySelector("img").alt = p.name;
                item.querySelector(".search-suggestion-name").textContent = p.name;
                suggestions.appendChild(item);
            });

            const seeAll = document.createElement("button");
            seeAll.type = "button";
            seeAll.className = "search-suggestion-all";
            seeAll.innerHTML = `View all results for "<strong></strong>" <i class="fa-solid fa-arrow-right"></i>`;
            seeAll.querySelector("strong").textContent = q;
            seeAll.addEventListener("click", function () {
                hideSuggestions();
                openCatalogView({ title: `Results for "${q}"`, query: q });
            });
            suggestions.appendChild(seeAll);
            suggestions.hidden = false;
        });

        form.addEventListener("submit", function (e) {
            e.preventDefault();
            hideSuggestions();
            const q = input.value.trim();
            if (!q) {
                closeCatalogView();
                return;
            }
            openCatalogView({ title: `Search results for "${q}"`, query: q });
        });

        document.addEventListener("click", function (e) {
            if (!e.target.closest(".search-wrapper")) {
                hideSuggestions();
            }
        });
    }

    /* ---------- Wire Interactive Sections & Links ---------- */

    function initNavigationAndTriggers() {
        // Horizontal nav-two & category promo slider arrows
        bindHorizontalControls(
            document.getElementById("nav-two"),
            document.getElementById("nav-two-left"),
            document.getElementById("nav-two-right"),
            0.6
        );
        bindHorizontalControls(
            document.getElementById("category-images"),
            document.getElementById("slider-left-two"),
            document.getElementById("slider-right-two"),
            0.7
        );

        // Brand logo resets view when already on index.html
        const homeLink = document.getElementById("brand-home-link");
        if (homeLink) {
            homeLink.addEventListener("click", function (e) {
                const view = document.getElementById("catalog-view");
                if (view && !view.hidden) {
                    e.preventDefault();
                    closeCatalogView();
                }
            });
        }

        // Secondary nav categories
        document.querySelectorAll(".nav-two-child button[data-category]").forEach(function (btn) {
            btn.addEventListener("click", function () {
                const cat = btn.dataset.category;
                const title = cat === "Other categories" ? "All Products" : cat;
                openCatalogView({ title: title, category: cat });
            });
        });

        // Catalog back & sort controls
        const backBtn = document.getElementById("catalog-back-btn");
        if (backBtn) backBtn.addEventListener("click", closeCatalogView);

        const sortSelect = document.getElementById("catalog-sort");
        if (sortSelect) sortSelect.addEventListener("change", renderCatalogGrid);

        // Promo tiles in category slider
        document.querySelectorAll(".promo-tile[data-promo]").forEach(function (tile) {
            tile.addEventListener("click", function () {
                const promo = tile.dataset.promo;
                if (promo === "call-to-order") {
                    SWB.openInfoModal(
                        "Call to Order",
                        "Prefer placing your order over the phone? Our shopping assistants are ready to help.",
                        [
                            "Hotline: 0201 888 1106",
                            "Available Monday – Saturday, 8:00 AM – 8:00 PM WAT",
                            "Pay on Delivery available for phone orders nationwide"
                        ]
                    );
                } else if (promo === "clearance") {
                    openCatalogView({
                        title: "Clearance Sales — Biggest Discounts",
                        items: SWB.searchCatalog("", ""),
                        sort: "discount-desc"
                    });
                } else if (promo === "banger-deals") {
                    openSectionView("flash-sales");
                } else if (promo === "buy-2") {
                    openSectionView("hot-deals-right-now");
                } else if (promo === "trendyol") {
                    openCatalogView({ title: "Fashion & Trendyol Deals", category: "Fashion" });
                } else if (promo === "new-arrival") {
                    openSectionView("top-sellers");
                } else if (promo === "shoes") {
                    openCatalogView({ title: "Shoes & Sneakers Deals", query: "Shoes" });
                }
            });
        });

        // See All buttons (Flash Sales, Deals of the Day)
        document.querySelectorAll("[data-see-all]").forEach(function (btn) {
            btn.addEventListener("click", function () {
                openSectionView(btn.dataset.seeAll);
            });
        });

        // Deals of the Day tiles
        document.querySelectorAll(".deal-card").forEach(function (card) {
            card.addEventListener("click", function () {
                if (card.dataset.dealSection) {
                    openSectionView(card.dataset.dealSection);
                } else if (card.dataset.dealQuery) {
                    openCatalogView({
                        title: `Deals: ${card.dataset.dealQuery}`,
                        query: card.dataset.dealQuery
                    });
                } else if (card.dataset.dealCategory) {
                    openCatalogView({
                        title: card.dataset.dealCategory,
                        category: card.dataset.dealCategory
                    });
                }
            });
        });

        // All Your Essentials grid cards
        document.querySelectorAll(".essentials-grid article").forEach(function (tile) {
            function activate() {
                const label = tile.querySelector("p") ? tile.querySelector("p").textContent.trim() : "Deals";
                if (tile.dataset.essentialSection) {
                    openSectionView(tile.dataset.essentialSection);
                } else if (tile.dataset.essentialQuery) {
                    openCatalogView({ title: label, query: tile.dataset.essentialQuery });
                } else if (tile.dataset.essentialCategory) {
                    openCatalogView({ title: label, category: tile.dataset.essentialCategory });
                }
            }
            tile.addEventListener("click", activate);
            tile.addEventListener("keydown", function (e) {
                if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    activate();
                }
            });
        });

        // About Store links
        document.querySelectorAll(".about-store__link[data-browse-category]").forEach(function (link) {
            link.addEventListener("click", function (e) {
                e.preventDefault();
                const cat = link.dataset.browseCategory;
                openCatalogView({ title: cat, category: cat });
            });
        });

        // Handle URL query params (?q=... or ?category=...) from product.html
        const params = new URLSearchParams(window.location.search);
        const qParam = params.get("q");
        const catParam = params.get("category");
        if (qParam) {
            const input = document.getElementById("search-input");
            if (input) input.value = qParam;
            openCatalogView({ title: `Search results for "${qParam}"`, query: qParam });
        } else if (catParam) {
            openCatalogView({ title: catParam, category: catParam });
        }
    }

    /* ---------- Bootstrap ---------- */

    document.addEventListener("DOMContentLoaded", function () {
        SWB.initSharedHeader();
        SWB.initSharedFooter();
        initHeroSlider();
        initFlashCountdown();
        renderFlashSales();
        renderProductShelves();
        initSearch();
        initNavigationAndTriggers();
    });
})();
