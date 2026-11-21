/* ==========================================================
   shopwithbami — Product Detail Page (PDP)
   ========================================================== */

(function () {
    "use strict";

    const SWB = window.SWB;
    if (!SWB) return;

    function getSelectedProduct() {
        const params = new URLSearchParams(window.location.search);
        const id = params.get("id");
        if (id) {
            const found = SWB.getProductById(id);
            if (found) return found;
        }
        return SWB.allProducts[0];
    }

    function renderStars(ratingNum) {
        const full = Math.round(ratingNum);
        let html = "";
        for (let i = 1; i <= 5; i++) {
            html += `<i class="${i <= full ? "fa-solid" : "fa-regular"} fa-star"></i>`;
        }
        return html;
    }

    function getSavedReviews(productId) {
        try {
            const map = JSON.parse(window.localStorage.getItem(SWB.STORAGE_KEYS.REVIEWS) || "{}");
            return Array.isArray(map[productId]) ? map[productId] : [];
        } catch (e) {
            return [];
        }
    }

    function saveReview(productId, review) {
        try {
            const map = JSON.parse(window.localStorage.getItem(SWB.STORAGE_KEYS.REVIEWS) || "{}");
            if (!Array.isArray(map[productId])) map[productId] = [];
            map[productId].unshift(review);
            window.localStorage.setItem(SWB.STORAGE_KEYS.REVIEWS, JSON.stringify(map));
        } catch (e) {}
    }

    function renderProductPage(product) {
        const root = document.getElementById("pdp-root");
        if (!root || !product) return;

        document.title = `${product.name} | shopwithbami`;

        const saved = SWB.isWishlisted(product.id);
        const savings = Math.max(0, product.originalPrice - product.price);
        const related = SWB.getRelatedProducts(product, 6);

        const defaultReviews = [
            {
                author: "Chinedu O.",
                rating: 5,
                date: "Verified Purchase",
                comment: `Really impressed with the ${product.name}. Packaging was secure and delivery to Lagos took less than 48 hours.`
            },
            {
                author: "Amina K.",
                rating: 4,
                date: "Verified Purchase",
                comment: "Great value for the price and matches the description closely. Would happily order from shopwithbami again."
            }
        ];

        root.innerHTML = `
            <nav class="pdp-breadcrumb" aria-label="Breadcrumb">
                <a href="index.html">Home</a>
                <i class="fa-solid fa-chevron-right" aria-hidden="true"></i>
                <a href="index.html?category=${encodeURIComponent(product.category)}">${product.category}</a>
                <i class="fa-solid fa-chevron-right" aria-hidden="true"></i>
                <span>${product.name}</span>
            </nav>

            <div class="pdp-layout">
                <section class="pdp-main-card">
                    <div class="pdp-gallery">
                        <div class="pdp-image-box">
                            ${product.discountPercent > 0 ? `<span class="product-discount-badge">${product.percentOff}</span>` : ""}
                            <img id="pdp-main-img" src="${product.image}" alt="">
                        </div>
                        <div class="pdp-trust-strip">
                            <span><i class="fa-solid fa-shield-halved"></i> Original Product</span>
                            <span><i class="fa-solid fa-rotate-left"></i> 7-Day Returns</span>
                            <span><i class="fa-solid fa-hand-holding-dollar"></i> Pay on Delivery</span>
                        </div>
                    </div>

                    <div class="pdp-details">
                        <div class="pdp-top-meta">
                            <span class="pdp-brand-pill">${product.brand}</span>
                            <button type="button" class="pdp-wishlist-btn ${saved ? "is-saved" : ""}"
                                data-wishlist-id="${product.id}" aria-pressed="${saved}" aria-label="Save to wishlist">
                                <i class="${saved ? "fa-solid" : "fa-regular"} fa-heart"></i>
                                <span>${saved ? "Saved" : "Save"}</span>
                            </button>
                        </div>

                        <h1 class="pdp-title"></h1>

                        <div class="pdp-rating-row">
                            <span class="pdp-stars">${renderStars(product.ratingNum)}</span>
                            <strong>${product.rating}</strong>
                            <span class="pdp-reviews-count">(${product.reviewCount} verified ratings)</span>
                            <span class="pdp-sku">SKU: ${product.sku}</span>
                        </div>

                        <div class="pdp-price-box">
                            <div class="pdp-price-current">${product.priceFormatted}</div>
                            <div class="pdp-price-meta">
                                <span class="pdp-price-old">${product.originalPriceFormatted}</span>
                                ${savings > 0 ? `<span class="pdp-save-badge">You save ${SWB.formatNaira(savings)} (${product.percentOff})</span>` : ""}
                            </div>
                            <p class="pdp-stock-status">
                                <i class="fa-solid fa-circle-check"></i>
                                ${product.stockLeft ? `In stock — only ${product.stockLeft} left at this Flash Sale price` : "In stock — ready for fast dispatch"}
                            </p>
                        </div>

                        <div class="pdp-purchase-controls">
                            <div class="pdp-qty-wrap">
                                <span>Quantity</span>
                                <div class="swb-qty-control">
                                    <button type="button" id="pdp-qty-dec" aria-label="Decrease quantity">&minus;</button>
                                    <span id="pdp-qty-val">1</span>
                                    <button type="button" id="pdp-qty-inc" aria-label="Increase quantity">+</button>
                                </div>
                            </div>

                            <div class="pdp-action-buttons">
                                <button type="button" class="swb-primary-btn pdp-add-cart-btn" id="pdp-add-cart">
                                    <i class="fa-solid fa-cart-plus"></i> Add to Cart
                                </button>
                                <button type="button" class="swb-secondary-btn pdp-buy-now-btn" id="pdp-buy-now">
                                    Buy Now
                                </button>
                            </div>
                        </div>
                    </div>
                </section>

                <aside class="pdp-delivery-card">
                    <h3>Delivery &amp; Returns</h3>
                    <div class="pdp-delivery-item">
                        <i class="fa-solid fa-truck-fast"></i>
                        <div>
                            <strong>Express Delivery</strong>
                            <p>Delivered within 1–3 business days in Lagos &amp; Abuja, 2–5 days nationwide. Free on orders over ₦ 100,000.</p>
                        </div>
                    </div>
                    <div class="pdp-delivery-item">
                        <i class="fa-solid fa-rotate-left"></i>
                        <div>
                            <strong>Easy Return Policy</strong>
                            <p>Free returns within 7 days for eligible items in original condition.</p>
                        </div>
                    </div>
                    <div class="pdp-delivery-item">
                        <i class="fa-solid fa-shield-halved"></i>
                        <div>
                            <strong>Buyer Protection</strong>
                            <p>Verified store warranty and Pay on Delivery on eligible orders.</p>
                        </div>
                    </div>
                    <div class="pdp-promo-hint">
                        <i class="fa-solid fa-tag"></i>
                        Use code <strong>BAMI10</strong> in cart for 10% off!
                    </div>
                </aside>
            </div>

            <section class="pdp-info-section">
                <div class="pdp-description-col">
                    <h2>Product Details</h2>
                    <p class="pdp-description-text"></p>
                    <h3>Key Specifications</h3>
                    <dl class="pdp-specs-list">
                        ${product.specs.map(function (row) {
                            return `<div><dt>${row[0]}</dt><dd>${row[1]}</dd></div>`;
                        }).join("")}
                    </dl>
                </div>

                <div class="pdp-reviews-col">
                    <h2>Customer Reviews</h2>
                    <div id="pdp-reviews-list" class="pdp-reviews-list"></div>
                    <form id="pdp-review-form" class="pdp-review-form">
                        <h3>Write a Review</h3>
                        <div class="pdp-review-inputs">
                            <input type="text" name="author" required placeholder="Your name" aria-label="Your name">
                            <select name="rating" aria-label="Rating">
                                <option value="5">5 Stars — Excellent</option>
                                <option value="4">4 Stars — Good</option>
                                <option value="3">3 Stars — Average</option>
                                <option value="2">2 Stars — Fair</option>
                                <option value="1">1 Star — Poor</option>
                            </select>
                        </div>
                        <textarea name="comment" rows="3" required placeholder="Share your experience with this product..."></textarea>
                        <button type="submit" class="swb-primary-btn">Submit Review</button>
                    </form>
                </div>
            </section>

            <section class="pdp-related-section">
                <div class="shelf-header">
                    <div class="shelf-heading-group">
                        <h2>You May Also Like</h2>
                    </div>
                    <a href="index.html?category=${encodeURIComponent(product.category)}" class="shelf-see-all">
                        View Category <i class="fa-solid fa-arrow-right"></i>
                    </a>
                </div>
                <div class="catalog-grid" id="pdp-related-grid"></div>
            </section>
        `;

        // Safely assign text content
        root.querySelector(".pdp-title").textContent = product.name;
        root.querySelector(".pdp-description-text").textContent = product.description;

        const img = document.getElementById("pdp-main-img");
        img.alt = product.name;
        img.onerror = function () {
            this.onerror = null;
            this.src = SWB.createFallbackSvg(product.name);
        };

        // Quantity controls
        let qty = 1;
        const qtyVal = document.getElementById("pdp-qty-val");
        document.getElementById("pdp-qty-dec").addEventListener("click", function () {
            qty = Math.max(1, qty - 1);
            qtyVal.textContent = String(qty);
        });
        document.getElementById("pdp-qty-inc").addEventListener("click", function () {
            qty = Math.min(20, qty + 1);
            qtyVal.textContent = String(qty);
        });

        // Add to cart & Buy now
        document.getElementById("pdp-add-cart").addEventListener("click", function () {
            SWB.addToCart(product.id, qty);
        });
        document.getElementById("pdp-buy-now").addEventListener("click", function () {
            SWB.addToCart(product.id, qty);
            SWB.openCartDrawer();
        });

        // Wishlist toggle
        const wishBtn = root.querySelector(".pdp-wishlist-btn");
        wishBtn.addEventListener("click", function () {
            const nowSaved = SWB.toggleWishlist(product.id);
            const span = wishBtn.querySelector("span");
            if (span) span.textContent = nowSaved ? "Saved" : "Save";
        });

        // Render reviews
        function renderReviews() {
            const list = document.getElementById("pdp-reviews-list");
            const combined = getSavedReviews(product.id).concat(defaultReviews);
            list.innerHTML = "";
            combined.forEach(function (rev) {
                const card = document.createElement("article");
                card.className = "pdp-review-item";
                card.innerHTML = `
                    <div class="pdp-review-head">
                        <strong class="pdp-review-author"></strong>
                        <span class="pdp-stars">${renderStars(rev.rating)}</span>
                    </div>
                    <p class="pdp-review-comment"></p>
                    <span class="pdp-review-date">${rev.date}</span>
                `;
                card.querySelector(".pdp-review-author").textContent = rev.author;
                card.querySelector(".pdp-review-comment").textContent = rev.comment;
                list.appendChild(card);
            });
        }
        renderReviews();

        document.getElementById("pdp-review-form").addEventListener("submit", function (e) {
            e.preventDefault();
            const fd = new FormData(e.target);
            const author = String(fd.get("author") || "").trim();
            const comment = String(fd.get("comment") || "").trim();
            const rating = Number(fd.get("rating") || 5);
            if (!author || !comment) return;
            saveReview(product.id, {
                author: author,
                rating: rating,
                date: "Just now",
                comment: comment
            });
            e.target.reset();
            renderReviews();
            SWB.showToast("Thanks! Your review has been added.");
        });

        // Render related products
        const relatedGrid = document.getElementById("pdp-related-grid");
        related.forEach(function (item) {
            relatedGrid.appendChild(SWB.createProductCard(item, { showStockBar: false }));
        });
    }

    document.addEventListener("DOMContentLoaded", function () {
        SWB.initSharedHeader();
        SWB.initSharedFooter();

        const searchForm = document.getElementById("pdp-search-form");
        const searchInput = document.getElementById("pdp-search-input");
        if (searchForm && searchInput) {
            searchForm.addEventListener("submit", function (e) {
                e.preventDefault();
                const q = searchInput.value.trim();
                window.location.href = q ? `index.html?q=${encodeURIComponent(q)}` : "index.html";
            });
        }

        renderProductPage(getSelectedProduct());
    });
})();
