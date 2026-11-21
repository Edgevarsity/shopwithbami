/* ==========================================================
   shopwithbami — Shared Catalog, Cart, Wishlist & UI Helpers
   ========================================================== */

(function (window) {
    "use strict";

    const STORAGE_KEYS = {
        CART: "shopwithbami_cart",
        WISHLIST: "shopwithbami_wishlist",
        USER: "shopwithbami_user",
        ORDERS: "shopwithbami_orders",
        REVIEWS: "shopwithbami_reviews",
        FLASH_END: "shopwithbami_flash_end"
    };

    const FREE_DELIVERY_THRESHOLD = 100000;
    const STANDARD_DELIVERY_FEE = 3500;
    const PROMO_CODES = {
        BAMI10: { discountRate: 0.10, label: "10% off your order" },
        WELCOME5: { discountRate: 0.05, label: "5% welcome discount" }
    };

    const productImages = {
        tv: "https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?auto=format&fit=crop&w=500&q=80",
        phone: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=500&q=80",
        watch: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=500&q=80",
        headphones: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=500&q=80",
        shoes: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=500&q=80",
        laptop: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=500&q=80",
        camera: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=500&q=80",
        kitchen: "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=500&q=80",
        chair: "https://images.unsplash.com/photo-1503602642458-232111445657?auto=format&fit=crop&w=500&q=80",
        shirt: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=500&q=80",
        trousers: "https://images.unsplash.com/photo-1542272604-787c3835535d?auto=format&fit=crop&w=500&q=80",
        bag: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=500&q=80",
        speaker: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?auto=format&fit=crop&w=500&q=80",
        toy: "https://images.unsplash.com/photo-1558060370-d644479cb6f7?auto=format&fit=crop&w=500&q=80",
        fridge: "https://images.unsplash.com/photo-1571175443880-49e1d25b2bc5?auto=format&fit=crop&w=500&q=80",
        perfume: "https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&w=500&q=80",
        blender: "https://images.unsplash.com/photo-1570222094114-d054a817e56b?auto=format&fit=crop&w=500&q=80",
        game: "https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?auto=format&fit=crop&w=500&q=80",
        ac: "Assets/deals-of-the-day-hisense.jpg",
        power: "https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?auto=format&fit=crop&w=500&q=80",
        keyboard: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=500&q=80",
        mouse: "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?auto=format&fit=crop&w=500&q=80",
        drink: "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&w=500&q=80",
        scale: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=500&q=80"
    };

    const CATEGORY_META = {
        "Official Store": { icon: "fa-bag-shopping", keywords: ["samsung", "hikers", "hisense", "asus", "hp", "lg", "tcl", "oraimo", "nivea"] },
        "Appliances": { icon: "fa-house-user", keywords: ["air conditioner", "ac", "refrigerator", "fridge", "blender", "microwave", "rice cooker", "sandwich"] },
        "Phones & Tablets": { icon: "fa-mobile", keywords: ["phone", "smartphone", "galaxy", "power bank", "charger", "earbuds", "case", "tripod", "screen protector", "cable", "adapter"] },
        "Health and Beauty": { icon: "fa-prescription-bottle-medical", keywords: ["perfume", "fragrance", "body mist", "fitness", "scale", "relaxation", "nivea"] },
        "Home & Office": { icon: "fa-briefcase", keywords: ["chair", "kitchen", "pot", "pan", "knife", "storage", "cooking", "microwave"] },
        "Electronics": { icon: "fa-microchip", keywords: ["tv", "television", "speaker", "headphones", "camera", "watch", "earbuds"] },
        "Fashion": { icon: "fa-shirt", keywords: ["shirt", "trouser", "chino", "jeans", "cargo", "sneakers", "shoes", "bag", "backpack", "handbag", "outfit", "polo", "trainers"] },
        "Supermarket": { icon: "fa-apple-whole", keywords: ["gin", "vodka", "whisky", "wine", "champagne", "rum", "liqueur", "spirits", "tonic", "perfume"] },
        "Computing": { icon: "fa-display", keywords: ["laptop", "webcam", "mouse", "keyboard", "headset", "computer", "hp", "dell", "lenovo", "asus"] },
        "Baby products": { icon: "fa-baby", keywords: ["kids", "toy", "blocks", "teddy", "children", "cartoon", "drawing", "alphabet"] },
        "Gaming": { icon: "fa-gamepad", keywords: ["gaming", "console", "playstation", "xbox", "controller", "headset", "rgb", "microphone"] },
        "Other categories": { icon: "fa-ellipsis", keywords: [] }
    };

    const rawSections = [
        {
            id: "flash-sales",
            title: "Flash Sales",
            category: "Electronics",
            isFlash: true,
            products: [
                ["watch", "Samsung Galaxy Watch 6 44mm Bluetooth", 4.6, 210000, 260000, 8],
                ["headphones", "Oraimo Wireless Bluetooth Headphones", 4.4, 18500, 25000, 14],
                ["phone", "Samsung Galaxy A15 128GB Dual SIM", 4.5, 225000, 280000, 5],
                ["shoes", "Breathable Running Sports Sneakers", 4.3, 18500, 25000, 11],
                ["tv", "Mi+ 32 Inch HD Digital Satellite LED TV", 4.2, 84999, 108596, 6],
                ["laptop", "ASUS Vivobook 14 Intel Core i5 Laptop", 4.6, 569100, 680000, 3],
                ["ac", "Hisense 1.5HP Split Air Conditioner", 4.6, 322462, 438205, 4],
                ["blender", "Binatone 1.5L Electric Kitchen Blender", 4.3, 24500, 32000, 19],
                ["speaker", "JBL-Style Portable Bluetooth Speaker", 4.4, 19500, 27000, 9],
                ["power", "Oraimo 20000mAh Fast Charging Power Bank", 4.5, 22000, 29000, 7]
            ]
        },
        {
            id: "top-sellers",
            title: "Top Sellers",
            subtitle: "Up to 50% off",
            category: "Electronics",
            products: [
                ["tv", "Mi+ 32 Inch HD Digital LED TV", 4.0, 86999, 108596],
                ["headphones", "Wireless Bluetooth Headphones", 4.3, 18500, 25000],
                ["fridge", "Hisense Single Door Refrigerator", 4.2, 178020, 235437],
                ["watch", "Smart Watch Bluetooth Call Edition", 4.1, 25500, 35000],
                ["phone", "Samsung Galaxy A15 128GB", 4.5, 235000, 280000],
                ["shoes", "Men's Running Sports Sneakers", 4.2, 15999, 22000],
                ["blender", "Binatone Electric Blender", 4.3, 24500, 32000],
                ["laptop", "HP 15 Intel Core Laptop", 4.4, 520000, 600000],
                ["speaker", "Portable Wireless Bluetooth Speaker", 4.3, 19500, 27000],
                ["bag", "Casual Everyday Backpack", 4.1, 12500, 17000],
                ["perfume", "Luxury Men's Eau De Parfum", 4.5, 9500, 14000],
                ["power", "20000mAh Fast Charging Power Bank", 4.4, 22000, 29000]
            ]
        },
        {
            id: "sponsored-products",
            title: "Sponsored Products",
            category: "Phones & Tablets",
            products: [
                ["phone", "Infinix Hot 40i 128GB Smartphone", 4.2, 185000, 220000],
                ["speaker", "Portable Bass Bluetooth Speaker", 4.4, 22000, 30000],
                ["watch", "Digital Smart Watch AMOLED", 4.0, 19999, 28000],
                ["headphones", "Wireless Stereo Over-Ear Headphones", 4.3, 15500, 22000],
                ["laptop", "Lenovo IdeaPad Slim 3 Laptop", 4.4, 490000, 570000],
                ["shoes", "Unisex Street Fashion Sneakers", 4.1, 17000, 23000],
                ["tv", "TCL 43 Inch Smart Android TV", 4.5, 285000, 350000],
                ["blender", "Portable Rechargeable USB Blender", 4.2, 14500, 19000],
                ["bag", "Women's Structured Fashion Handbag", 4.3, 13500, 18000],
                ["camera", "HD Digital Mirrorless Camera", 4.4, 135000, 175000],
                ["power", "Universal 65W Fast Charging Adapter", 4.2, 5500, 8000],
                ["perfume", "Unisex Long Lasting Perfume 100ml", 4.3, 11000, 15000]
            ]
        },
        {
            id: "brand-festival",
            title: "Brand Festival deals",
            subtitle: "Up to 70% off",
            category: "Official Store",
            products: [
                ["phone", "Xiaomi Redmi 13C 128GB Smartphone", 4.4, 245000, 310000],
                ["watch", "Bluetooth Smart Watch Sport", 4.2, 29999, 40000],
                ["headphones", "Active Noise Cancelling Headphones", 4.1, 17500, 25000],
                ["speaker", "Portable Party Sound Speaker", 4.3, 21000, 28000],
                ["tv", "Samsung 43 Inch Crystal UHD TV", 4.5, 420000, 510000],
                ["laptop", "HP Pavilion 15 Core i5 Laptop", 4.4, 650000, 780000],
                ["fridge", "Hisense Double Door Refrigerator", 4.5, 320000, 400000],
                ["shoes", "Pro Cushion Running Shoes", 4.3, 28000, 36000],
                ["blender", "Kenwood Multi-Purpose Blender", 4.4, 35000, 45000],
                ["bag", "Premium Leather Tote Handbag", 4.2, 25000, 33000],
                ["power", "Oraimo Traveler 20000mAh Power Bank", 4.5, 24000, 32000],
                ["perfume", "Signature Reserve Eau De Parfum", 4.3, 12500, 17000]
            ]
        },
        {
            id: "top-selling-items",
            title: "Top selling items",
            category: "Electronics",
            products: [
                ["tv", "Royal 32 Inch Smart Android TV", 3.9, 129999, 245556],
                ["shoes", "Casual Sports Sneakers", 4.2, 18500, 25000],
                ["perfume", "Long Lasting Citrus Fragrance", 4.4, 8500, 12000],
                ["phone", "Tecno Spark 20 128GB Mobile Phone", 4.3, 165000, 200000],
                ["watch", "Men's Stainless Steel Wristwatch", 4.2, 14000, 19000],
                ["headphones", "Noise Reduction Bluetooth Headphones", 4.5, 22000, 30000],
                ["fridge", "Nexus Compact Single Door Refrigerator", 4.1, 145000, 185000],
                ["blender", "Heavy Duty Electric Food Blender", 4.3, 19500, 26000],
                ["bag", "Waterproof Travel Laptop Backpack", 4.4, 16500, 22000],
                ["speaker", "Rechargeable Home Soundbar Speaker", 4.2, 28000, 37000],
                ["power", "Solar Rechargeable 30000mAh Power Bank", 4.3, 26000, 35000],
                ["toy", "Kids Educational Building Blocks", 4.5, 9500, 13000]
            ]
        },
        {
            id: "samsung-official-store",
            title: "Samsung Official Store",
            category: "Official Store",
            products: [
                ["phone", "Samsung Galaxy A55 5G 256GB", 4.5, 450000, 520000],
                ["tv", "Samsung 50 Inch Smart LED Television", 4.4, 650000, 800000],
                ["watch", "Samsung Galaxy Watch 5 44mm", 4.3, 185000, 220000],
                ["headphones", "Samsung Galaxy Buds 2 Wireless Earbuds", 4.2, 85000, 100000],
                ["phone", "Samsung Galaxy A05 64GB", 4.3, 145000, 175000],
                ["phone", "Samsung Galaxy A25 5G 128GB", 4.5, 320000, 380000],
                ["phone", "Samsung Galaxy S24 Ultra 256GB", 4.7, 1450000, 1650000],
                ["tv", "Samsung 55 Inch Crystal UHD 4K TV", 4.6, 780000, 920000],
                ["watch", "Samsung Galaxy Watch 6 Classic", 4.4, 210000, 250000],
                ["headphones", "Samsung Galaxy Buds FE Graphite", 4.3, 95000, 115000],
                ["phone", "Samsung Galaxy A35 5G 256GB", 4.5, 390000, 450000],
                ["tv", "Samsung 32 Inch HD Smart TV", 4.2, 245000, 290000]
            ]
        },
        {
            id: "everyday-essentials",
            title: "Everyday Essentials",
            category: "Home & Office",
            products: [
                ["phone", "Redmi A3 128GB Dual SIM Smartphone", 4.2, 185000, 230000],
                ["headphones", "Foldable Wireless Bluetooth Headphones", 4.3, 18500, 25000],
                ["watch", "Waterproof Digital Smart Watch", 4.1, 22000, 30000],
                ["speaker", "Compact Portable Bluetooth Speaker", 4.4, 20000, 28000],
                ["blender", "2-in-1 Electric Kitchen Blender", 4.3, 19000, 25000],
                ["bag", "Anti-Theft Casual Everyday Backpack", 4.2, 14500, 19000],
                ["shoes", "Unisex Lightweight Casual Sneakers", 4.4, 18000, 24000],
                ["power", "Universal Fast USB-C Phone Charger", 4.1, 4500, 6000],
                ["perfume", "Fresh Everyday Eau De Toilette", 4.3, 9000, 12000],
                ["toy", "Kids STEM Learning Toy Set", 4.2, 11000, 15000],
                ["chair", "Modern Ergonomic Home Office Chair", 4.3, 55000, 70000],
                ["laptop", "Lenovo 14 Inch Student Everyday Laptop", 4.2, 420000, 490000]
            ]
        },
        {
            id: "deals-on-air-conditioners",
            title: "Deals On Air Conditioners",
            category: "Appliances",
            products: [
                ["ac", "Royal 1HP Inverter Air Conditioner", 4.4, 294644, 436010],
                ["ac", "Nexus 1HP Split Air Conditioner", 4.3, 255650, 344450],
                ["ac", "Hisense 1HP Split Air Conditioner", 4.6, 289990, 438205],
                ["ac", "Haier Thermocool 1HP Air Conditioner", 4.3, 336090, 504519],
                ["ac", "LG 1.5HP Split Air Conditioner", 4.5, 425000, 520000],
                ["ac", "Midea 1HP Energy Saving AC", 4.4, 310000, 390000],
                ["ac", "Panasonic 1.5HP Split Air Conditioner", 4.5, 455000, 560000],
                ["ac", "Hisense 1.5HP Inverter Split AC", 4.6, 385000, 470000],
                ["ac", "LG Dual Inverter 1.5HP Split AC", 4.7, 590000, 720000],
                ["ac", "Nexus 1.5HP Copper Coil Split AC", 4.2, 345000, 420000],
                ["ac", "Royal 2HP Split Air Conditioner", 4.3, 510000, 620000],
                ["ac", "Haier Thermocool 2HP Inverter AC", 4.5, 625000, 750000]
            ]
        },
        {
            id: "smart-tvs-deals",
            title: "Smart TVs deals",
            category: "Electronics",
            products: [
                ["tv", "Royal 50 Inch QLED Google TV", 4.4, 339999, 563333],
                ["tv", "TCL 43 Inch QLED Google Smart TV", 4.4, 285556, 371222],
                ["tv", "Hikers 43 Inch Smart Frameless TV", 4.1, 187666, 288000],
                ["tv", "Hisense 55 Inch UHD 4K Smart TV", 4.5, 513999, 750000],
                ["tv", "Samsung 43 Inch Crystal UHD TV", 4.5, 420000, 510000],
                ["tv", "LG 55 Inch 4K UHD Smart TV", 4.6, 590000, 720000],
                ["tv", "TCL 32 Inch Android Smart TV", 4.2, 165000, 210000],
                ["tv", "Hisense 43 Inch Full HD Smart TV", 4.4, 290000, 350000],
                ["tv", "Samsung 50 Inch Crystal UHD TV", 4.5, 560000, 670000],
                ["tv", "LG 43 Inch Full HD Television", 4.3, 325000, 390000],
                ["tv", "TCL 55 Inch QLED Google TV", 4.6, 520000, 650000],
                ["tv", "Royal 43 Inch Android Smart TV", 4.1, 230000, 295000]
            ]
        },
        {
            id: "kitchen-and-dining-deals",
            title: "Kitchen And Dining deals",
            category: "Home & Office",
            products: [
                ["blender", "Electric Kitchen Blender 1.5L", 4.1, 18500, 25000],
                ["kitchen", "12-Piece Kitchen Cooking Utensil Set", 4.3, 28000, 38000],
                ["blender", "Multi-Function Food Processor", 4.2, 35000, 45000],
                ["kitchen", "Airtight Kitchen Storage Canisters", 4.0, 9500, 13000],
                ["kitchen", "Stainless Steel Cooking Pot Set", 4.5, 32000, 42000],
                ["blender", "Binatone Table Blender with Mill", 4.3, 25000, 33000],
                ["kitchen", "Non-Stick Granite Frying Pan", 4.2, 12500, 17000],
                ["kitchen", "Electric Rice Cooker 2.2L", 4.4, 28500, 36000],
                ["kitchen", "6-Piece Chef Kitchen Knife Set", 4.1, 8500, 12000],
                ["kitchen", "Hisense Microwave Oven 20L", 4.4, 85000, 110000],
                ["blender", "Rechargeable Portable Smoothie Blender", 4.2, 15000, 20000],
                ["kitchen", "4-Slice Electric Sandwich Maker", 4.3, 22000, 29000]
            ]
        },
        {
            id: "health-and-relaxation-deals",
            title: "Health and Relaxation deals",
            category: "Health and Beauty",
            products: [
                ["watch", "Digital Fitness & Heart Rate Watch", 4.1, 22000, 30000],
                ["speaker", "Portable Ambient Relaxation Speaker", 4.3, 18000, 24000],
                ["chair", "Comfortable Cushioned Home Chair", 4.2, 45000, 60000],
                ["perfume", "Botanical Fresh Eau De Parfum", 4.4, 8500, 12000],
                ["chair", "Ergonomic Mesh Office Chair", 4.5, 75000, 95000],
                ["watch", "Smart Fitness Activity Tracker", 4.3, 18500, 25000],
                ["scale", "Digital Smart Body Weight Scale", 4.2, 12000, 16000],
                ["chair", "Adjustable Lumbar Study Chair", 4.4, 48000, 65000],
                ["speaker", "Wireless Home Audio Speaker", 4.3, 24000, 32000],
                ["perfume", "Refreshing Floral Body Mist 250ml", 4.1, 6500, 9000],
                ["watch", "Water Resistant Sports Fitness Watch", 4.4, 26000, 35000],
                ["chair", "Modern Reclining Lounge Chair", 4.5, 95000, 120000]
            ]
        },
        {
            id: "mens-clothing",
            title: "Men's Clothing - Trouser & Chinos",
            category: "Fashion",
            products: [
                ["shirt", "Men's Casual Cotton Crew T-Shirt", 4.2, 7500, 10000],
                ["shirt", "Men's Smart Casual Oxford Shirt", 4.1, 12000, 16000],
                ["trousers", "Men's Casual Slim Chino Trousers", 4.3, 15000, 20000],
                ["shoes", "Men's Low-Top Casual Sneakers", 4.2, 18500, 25000],
                ["trousers", "Men's Slim Fit Stretch Jeans", 4.4, 16000, 22000],
                ["trousers", "Men's Formal Tailored Office Trousers", 4.3, 18000, 24000],
                ["shirt", "Men's Short Sleeve Pique Polo Shirt", 4.2, 9500, 13000],
                ["shoes", "Men's Classic Leather Formal Shoes", 4.5, 28000, 36000],
                ["trousers", "Men's Multi-Pocket Cargo Pants", 4.3, 17000, 23000],
                ["shirt", "Men's Long Sleeve Button-Down Shirt", 4.1, 13500, 18000],
                ["shoes", "Men's Mesh Running Trainers", 4.4, 22000, 29000],
                ["shirt", "Men's Two-Piece Casual Co-ord Set", 4.3, 25000, 33000]
            ]
        },
        {
            id: "hikers-official-store",
            title: "Hikers Official Store",
            category: "Official Store",
            products: [
                ["tv", "Hikers 32 Inch Smart HD TV", 4.1, 102246, 171000],
                ["tv", "Hikers 43 Inch Smart Frameless TV", 4.1, 187666, 288000],
                ["tv", "Hikers 32 Inch Digital LED TV", 3.9, 95000, 129600],
                ["tv", "Hikers 40 Inch Smart LED Television", 4.0, 135000, 180000],
                ["tv", "Hikers 50 Inch Smart Android TV", 4.3, 285000, 360000],
                ["tv", "Hikers 40 Inch Full HD Television", 4.2, 165000, 220000],
                ["tv", "Hikers 55 Inch UHD 4K Smart TV", 4.4, 350000, 450000],
                ["tv", "Hikers 24 Inch LED Television", 3.9, 75000, 99000],
                ["tv", "Hikers 43 Inch Google TV Frameless", 4.2, 210000, 275000],
                ["tv", "Hikers 32 Inch Frameless Android TV", 4.0, 110000, 145000],
                ["tv", "Hikers 50 Inch 4K UHD Google TV", 4.3, 295000, 380000],
                ["tv", "Hikers 65 Inch Smart 4K Television", 4.5, 520000, 650000]
            ]
        },
        {
            id: "beyond-the-brand",
            title: "Beyond The Brand",
            category: "Fashion",
            products: [
                ["shoes", "Everyday Athletic Sports Sneakers", 4.3, 18500, 25000],
                ["watch", "Modern Minimalist Digital Watch", 4.1, 22000, 30000],
                ["bag", "Everyday Carry-On Travel Backpack", 4.4, 16000, 22000],
                ["headphones", "Foldable Wireless Stereo Headphones", 4.2, 15500, 22000],
                ["shirt", "Unisex Heavyweight Cotton T-Shirt", 4.3, 8000, 11000],
                ["perfume", "Premium Unisex Woody Fragrance", 4.4, 12000, 16000],
                ["bag", "Women's Quilted Shoulder Bag", 4.2, 19000, 25000],
                ["shoes", "Classic Everyday Canvas Shoes", 4.1, 14000, 19000],
                ["watch", "Classic Leather Strap Analog Watch", 4.3, 17000, 23000],
                ["headphones", "Wireless Noise Cancelling Earbuds", 4.5, 21000, 28000],
                ["bag", "Large Weekend Travel Duffel Bag", 4.4, 23000, 30000],
                ["shoes", "Lightweight Slip-On Walking Sneakers", 4.3, 20000, 27000]
            ]
        },
        {
            id: "computing-deals",
            title: "Computing Deals",
            category: "Computing",
            products: [
                ["laptop", "ASUS Vivobook 15 Core i5 Laptop", 4.4, 450000, 550000],
                ["camera", "Canon EOS Digital SLR Camera", 4.2, 225000, 280000],
                ["laptop", "HP Stream 14 Everyday Laptop", 4.1, 380000, 450000],
                ["headphones", "USB-C Office Computer Headset", 4.2, 18500, 25000],
                ["laptop", "HP 250 G9 Core i5 16GB RAM Laptop", 4.5, 580000, 680000],
                ["laptop", "Lenovo ThinkPad Business Laptop", 4.4, 490000, 570000],
                ["camera", "1080P Full HD USB Streaming Webcam", 4.3, 22000, 29000],
                ["mouse", "Ergonomic Wireless Computer Mouse", 4.2, 7500, 10000],
                ["laptop", "Dell Latitude Core i7 Ultrabook", 4.5, 620000, 750000],
                ["headphones", "Surround USB Gaming Headset", 4.4, 24000, 32000],
                ["keyboard", "RGB Mechanical Gaming Keyboard", 4.5, 35000, 45000],
                ["camera", "Portable Clip-On Laptop Webcam", 4.1, 15000, 20000]
            ]
        },
        {
            id: "mobile-accessories-deals",
            title: "Mobile Accessories deals",
            category: "Phones & Tablets",
            products: [
                ["headphones", "Wireless Bluetooth 5.3 Earbuds", 4.3, 12500, 18000],
                ["phone", "Shockproof Phone Protective Case", 4.1, 3500, 5000],
                ["power", "20000mAh Slim Portable Power Bank", 4.2, 15000, 20000],
                ["speaker", "Splashproof Bluetooth Mini Speaker", 4.4, 20000, 28000],
                ["power", "33W Fast Charging USB-C Adapter", 4.3, 6500, 9000],
                ["phone", "9H Tempered Glass Screen Protector", 4.2, 2500, 4000],
                ["power", "10000mAh Compact Pocket Power Bank", 4.4, 13500, 18000],
                ["headphones", "Low-Latency Wireless Gaming Earbuds", 4.3, 16000, 22000],
                ["phone", "Universal Car & Desk Phone Holder", 4.1, 4500, 6500],
                ["power", "Braided 3-in-1 Fast Charging Cable", 4.2, 3000, 4500],
                ["speaker", "Mini Portable Bluetooth Speaker", 4.3, 14000, 19000],
                ["phone", "Adjustable Phone Tripod & Ring Stand", 4.4, 9500, 13000]
            ]
        },
        {
            id: "kids-play-nest",
            title: "Kids Play Nest (Toys)",
            subtitle: "Kids Corner",
            category: "Baby products",
            products: [
                ["toy", "120-Piece Building Blocks Toy Set", 4.4, 12000, 16000],
                ["toy", "Kids Interactive Educational Toy", 4.2, 8500, 12000],
                ["toy", "Colourful Magnetic Toy Building Set", 4.3, 15000, 20000],
                ["bag", "Kids Durable School Backpack", 4.1, 9500, 13000],
                ["toy", "Remote Control High-Speed Racing Car", 4.5, 18000, 25000],
                ["toy", "Kids Art Drawing and Painting Kit", 4.3, 7500, 10000],
                ["toy", "Educational Alphabet Learning Board", 4.4, 6500, 9000],
                ["toy", "Children's Pretend Toy Kitchen Set", 4.2, 22000, 30000],
                ["toy", "Kids Indoor Basketball Hoop Set", 4.3, 16000, 22000],
                ["toy", "Colourful Building Blocks 100pcs", 4.5, 14000, 19000],
                ["toy", "Soft Plush Cuddly Teddy Bear", 4.4, 8000, 11000],
                ["bag", "Kids Cartoon Print School Bag", 4.2, 11000, 15000]
            ]
        },
        {
            id: "hot-deals-right-now",
            title: "Hot deals right now",
            subtitle: "Pay On Delivery",
            category: "Official Store",
            products: [
                ["phone", "Infinix Note 30 128GB Smartphone", 4.3, 185000, 230000],
                ["tv", "32 Inch Frameless LED Television", 4.1, 95000, 125000],
                ["shoes", "Lightweight Casual Sports Sneakers", 4.2, 18500, 25000],
                ["watch", "Smart Watch with Health Monitor", 4.1, 22000, 30000],
                ["headphones", "True Wireless Bluetooth Earbuds", 4.4, 12500, 18000],
                ["laptop", "ASUS 14 Inch Student Everyday Laptop", 4.3, 420000, 500000],
                ["blender", "4-Speed Electric Kitchen Blender", 4.2, 18000, 25000],
                ["speaker", "Rechargeable Outdoor Bluetooth Speaker", 4.4, 20000, 28000],
                ["bag", "Urban Fashion Travel Backpack", 4.3, 14000, 19000],
                ["power", "22.5W Fast Charging Power Bank", 4.5, 22000, 29000],
                ["perfume", "Long Lasting Men's Oud Perfume", 4.4, 9000, 13000],
                ["fridge", "Compact Single Door Mini Refrigerator", 4.2, 155000, 195000]
            ]
        },
        {
            id: "premium-bar",
            title: "Premium Bar - Gin & Vodka",
            subtitle: "18+ (Drink Responsibly)",
            category: "Supermarket",
            products: [
                ["drink", "London Dry Botanical Gin 75cl", 4.6, 18500, 23000],
                ["drink", "Triple Distilled Classic Vodka 75cl", 4.5, 16500, 21000],
                ["drink", "Spiced Pink Berry Infused Gin 70cl", 4.4, 19800, 25000],
                ["drink", "Small Batch Craft Citrus Gin 70cl", 4.7, 29500, 36000],
                ["drink", "Ultra Smooth French Grain Vodka 75cl", 4.7, 42000, 52000],
                ["drink", "Premium Cocktail Mixer Tonic Pack (6x)", 4.3, 6500, 8500],
                ["drink", "Reserve Botanical Dry Gin 1L", 4.6, 26000, 33000],
                ["drink", "Artisan Vodka & Cocktail Shaker Gift Set", 4.5, 34500, 44000]
            ]
        },
        {
            id: "games-and-consoles",
            title: "Games & Consoles",
            category: "Gaming",
            products: [
                ["game", "Next-Gen Slim Gaming Console 1TB", 4.5, 350000, 420000],
                ["game", "Dual-Vibration Wireless Game Controller", 4.3, 35000, 45000],
                ["headphones", "Pro 7.1 Surround Gaming Headset", 4.4, 25000, 35000],
                ["game", "Console Cooling Stand & Charging Dock", 4.2, 18000, 24000],
                ["game", "PlayStation 5 Slim 1TB Console", 4.8, 850000, 950000],
                ["game", "Xbox Wireless Controller Carbon Black", 4.6, 95000, 115000],
                ["mouse", "Ergonomic Gaming Mouse RGB 12000DPI", 4.4, 18000, 24000],
                ["keyboard", "Compact 60% Mechanical Gaming Keyboard", 4.5, 35000, 45000],
                ["headphones", "Surround Sound Esports Gaming Headset", 4.5, 32000, 42000],
                ["game", "PlayStation 5 DualSense Wireless Controller", 4.7, 105000, 125000],
                ["game", "Extended Gaming Mouse Pad XL", 4.3, 8500, 12000],
                ["game", "USB Condenser RGB Gaming Microphone", 4.4, 28000, 36000]
            ]
        }
    ];

    function slugify(str) {
        return String(str)
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/^-+|-+$/g, "");
    }

    function formatNaira(amount) {
        const num = Math.round(Number(amount) || 0);
        return "₦ " + num.toLocaleString("en-NG");
    }

    function calcDiscount(price, originalPrice) {
        if (!originalPrice || originalPrice <= price) return 0;
        return Math.round(((originalPrice - price) / originalPrice) * 100);
    }

    function inferBrand(name) {
        const known = [
            "Samsung", "Hisense", "Hikers", "Binatone", "Kenwood", "Oraimo",
            "Infinix", "Xiaomi", "Redmi", "Tecno", "HP", "Lenovo", "Dell",
            "ASUS", "TCL", "Royal", "Nexus", "Haier Thermocool", "LG",
            "Midea", "Panasonic", "PlayStation", "Xbox", "Canon", "Mi+", "Nivea"
        ];
        for (const brand of known) {
            if (name.toLowerCase().includes(brand.toLowerCase())) {
                return brand;
            }
        }
        return "shopwithbami Select";
    }

    function buildSpecs(product) {
        const type = product.imageKey;
        const base = [
            ["Brand", product.brand],
            ["Category", product.category],
            ["SKU", product.sku],
            ["Warranty", "12 Months Official Warranty"],
            ["Delivery", "Express & Standard Delivery Nationwide"]
        ];
        if (type === "tv") {
            base.push(["Display", "LED / High-Definition Panel"], ["Connectivity", "HDMI, USB, AV, Audio Out"]);
        } else if (type === "phone") {
            base.push(["Network", "4G LTE / Dual SIM"], ["Battery", "5000mAh Fast Charging"]);
        } else if (type === "laptop") {
            base.push(["Memory", "8GB - 16GB RAM / SSD Storage"], ["OS", "Windows 11 Home"]);
        } else if (type === "ac") {
            base.push(["Cooling", "Fast Cooling / Low Noise"], ["Energy", "Energy Saving Compressor"]);
        } else if (type === "shoes" || type === "shirt" || type === "trousers") {
            base.push(["Material", "Breathable Everyday Fabric"], ["Care", "Easy Wash & Durable Finish"]);
        }
        return base;
    }

    function buildDescription(product) {
        return `Upgrade your everyday setup with the ${product.name} from ${product.brand}. Carefully curated on shopwithbami for dependable performance, clean design, and strong everyday value. Backed by verified seller protection, 7-day easy returns, and Pay on Delivery on eligible orders across Nigeria.`;
    }

    function createFallbackSvg(label) {
        const safe = (label || "Product").slice(0, 22).replace(/[<>&"']/g, "");
        const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="400" viewBox="0 0 400 400"><rect width="400" height="400" fill="#f3effc"/><circle cx="200" cy="170" r="64" fill="#ddd6fe"/><rect x="166" y="142" width="68" height="58" rx="12" fill="#6d28d9"/><path d="M183 145c0-15 34-15 34 0" fill="none" stroke="#4c1d95" stroke-width="6" stroke-linecap="round"/><text x="200" y="275" text-anchor="middle" fill="#4c1d95" font-family="Arial,sans-serif" font-size="18" font-weight="700">${safe}</text><text x="200" y="302" text-anchor="middle" fill="#7c3aed" font-family="Arial,sans-serif" font-size="13">shopwithbami</text></svg>`;
        return "data:image/svg+xml;charset=utf-8," + encodeURIComponent(svg);
    }

    // Build normalized catalog
    const sections = [];
    const productsById = new Map();
    const allProducts = [];
    let skuCounter = 1001;

    rawSections.forEach(function (sec) {
        const secProducts = sec.products.map(function (row, idx) {
            const imageKey = row[0];
            const name = row[1];
            const rating = Number(row[2]);
            const price = Number(row[3]);
            const originalPrice = Number(row[4]);
            const stockLeft = row[5] != null ? row[5] : null;
            const discountPercent = calcDiscount(price, originalPrice);
            const id = sec.id + "-" + (idx + 1) + "-" + slugify(name).slice(0, 32);
            const brand = inferBrand(name);
            const reviewCount = 18 + ((skuCounter * 13) % 190);
            const product = {
                id: id,
                sku: "SWB-" + skuCounter++,
                sectionId: sec.id,
                sectionTitle: sec.title,
                category: sec.category,
                isFlash: Boolean(sec.isFlash),
                stockLeft: stockLeft,
                imageKey: imageKey,
                image: productImages[imageKey] || createFallbackSvg(name),
                name: name,
                brand: brand,
                rating: rating.toFixed(1),
                ratingNum: rating,
                reviewCount: reviewCount,
                price: price,
                originalPrice: originalPrice,
                priceFormatted: formatNaira(price),
                originalPriceFormatted: formatNaira(originalPrice),
                discountPercent: discountPercent,
                percentOff: "-" + discountPercent + "%"
            };
            product.description = buildDescription(product);
            product.specs = buildSpecs(product);
            productsById.set(id, product);
            allProducts.push(product);
            return product;
        });

        sections.push({
            id: sec.id,
            title: sec.title,
            subtitle: sec.subtitle || "",
            category: sec.category,
            isFlash: Boolean(sec.isFlash),
            products: secProducts
        });
    });

    /* ---------- Storage Helpers ---------- */

    function readJSON(key, fallback) {
        try {
            const raw = window.localStorage.getItem(key);
            return raw ? JSON.parse(raw) : fallback;
        } catch (e) {
            return fallback;
        }
    }

    function writeJSON(key, value) {
        try {
            window.localStorage.setItem(key, JSON.stringify(value));
        } catch (e) {
            // Ignore storage quota errors in private mode
        }
    }

    /* ---------- Cart State ---------- */

    function getCart() {
        const items = readJSON(STORAGE_KEYS.CART, []);
        return Array.isArray(items) ? items : [];
    }

    function saveCart(items) {
        writeJSON(STORAGE_KEYS.CART, items);
        updateCartBadges();
        renderCartDrawer();
        window.dispatchEvent(new CustomEvent("swb:cart-updated", { detail: items }));
    }

    function addToCart(productId, qty) {
        const product = productsById.get(productId);
        if (!product) return false;
        const quantity = Math.max(1, Number(qty) || 1);
        const cart = getCart();
        const existing = cart.find(function (item) { return item.id === productId; });
        if (existing) {
            existing.qty = Math.min(20, existing.qty + quantity);
        } else {
            cart.push({
                id: product.id,
                name: product.name,
                price: product.price,
                originalPrice: product.originalPrice,
                image: product.image,
                brand: product.brand,
                qty: Math.min(20, quantity)
            });
        }
        saveCart(cart);
        showToast(`Added "${product.name}" to your cart`);
        return true;
    }

    function updateCartQty(productId, delta) {
        let cart = getCart();
        const item = cart.find(function (entry) { return entry.id === productId; });
        if (!item) return;
        item.qty += delta;
        if (item.qty <= 0) {
            cart = cart.filter(function (entry) { return entry.id !== productId; });
        } else {
            item.qty = Math.min(20, item.qty);
        }
        saveCart(cart);
    }

    function removeFromCart(productId) {
        const cart = getCart().filter(function (entry) { return entry.id !== productId; });
        saveCart(cart);
    }

    function clearCart() {
        saveCart([]);
    }

    function getCartCount() {
        return getCart().reduce(function (sum, item) { return sum + (item.qty || 1); }, 0);
    }

    function getCartSubtotal() {
        return getCart().reduce(function (sum, item) { return sum + (item.price * (item.qty || 1)); }, 0);
    }

    /* ---------- Wishlist State ---------- */

    function getWishlist() {
        const list = readJSON(STORAGE_KEYS.WISHLIST, []);
        return Array.isArray(list) ? list : [];
    }

    function isWishlisted(productId) {
        return getWishlist().includes(productId);
    }

    function toggleWishlist(productId) {
        const product = productsById.get(productId);
        if (!product) return false;
        let list = getWishlist();
        let added = false;
        if (list.includes(productId)) {
            list = list.filter(function (id) { return id !== productId; });
            showToast(`Removed "${product.name}" from Saved Items`);
        } else {
            list.unshift(productId);
            added = true;
            showToast(`Saved "${product.name}" to your wishlist`);
        }
        writeJSON(STORAGE_KEYS.WISHLIST, list);
        document.querySelectorAll(`[data-wishlist-id="${productId}"]`).forEach(function (btn) {
            btn.classList.toggle("is-saved", added);
            btn.setAttribute("aria-pressed", String(added));
            const icon = btn.querySelector("i");
            if (icon) {
                icon.className = added ? "fa-solid fa-heart" : "fa-regular fa-heart";
            }
        });
        window.dispatchEvent(new CustomEvent("swb:wishlist-updated", { detail: list }));
        return added;
    }

    /* ---------- User & Orders State ---------- */

    function getUser() {
        return readJSON(STORAGE_KEYS.USER, null);
    }

    function setUser(userObj) {
        writeJSON(STORAGE_KEYS.USER, userObj);
        refreshAccountUI();
    }

    function signOutUser() {
        try {
            window.localStorage.removeItem(STORAGE_KEYS.USER);
        } catch (e) {}
        refreshAccountUI();
        showToast("Signed out of your shopwithbami account");
    }

    function getOrders() {
        const orders = readJSON(STORAGE_KEYS.ORDERS, []);
        return Array.isArray(orders) ? orders : [];
    }

    function addOrder(order) {
        const orders = getOrders();
        orders.unshift(order);
        writeJSON(STORAGE_KEYS.ORDERS, orders);
    }

    /* ---------- Toast Notification ---------- */

    let toastTimer = null;

    function showToast(message) {
        let container = document.getElementById("swb-toast");
        if (!container) {
            container = document.createElement("div");
            container.id = "swb-toast";
            container.className = "swb-toast";
            container.setAttribute("role", "status");
            container.setAttribute("aria-live", "polite");
            document.body.appendChild(container);
        }
        container.innerHTML = `<i class="fa-solid fa-circle-check"></i><span></span>`;
        container.querySelector("span").textContent = message;
        container.classList.add("is-visible");
        clearTimeout(toastTimer);
        toastTimer = setTimeout(function () {
            container.classList.remove("is-visible");
        }, 2800);
    }

    /* ---------- Reusable Product Card Builder ---------- */

    function createProductCard(product, options) {
        const opts = options || {};
        const showStockBar = opts.showStockBar != null ? opts.showStockBar : product.isFlash;

        const card = document.createElement("article");
        card.className = "product-card";
        card.dataset.productId = product.id;

        const saved = isWishlisted(product.id);

        const imageLink = document.createElement("a");
        imageLink.href = "product.html?id=" + encodeURIComponent(product.id);
        imageLink.className = "product-card-link";
        imageLink.setAttribute("aria-label", product.name);

        const imageWrapper = document.createElement("div");
        imageWrapper.className = "product-image-wrapper";

        const img = document.createElement("img");
        img.src = product.image;
        img.alt = product.name;
        img.loading = "lazy";
        img.onerror = function () {
            this.onerror = null;
            this.src = createFallbackSvg(product.name);
        };

        const discount = document.createElement("span");
        discount.className = "product-discount-badge";
        discount.textContent = product.percentOff;

        imageWrapper.appendChild(img);
        if (product.discountPercent > 0) {
            imageWrapper.appendChild(discount);
        }

        const wishlistBtn = document.createElement("button");
        wishlistBtn.type = "button";
        wishlistBtn.className = "product-wishlist-btn" + (saved ? " is-saved" : "");
        wishlistBtn.dataset.wishlistId = product.id;
        wishlistBtn.setAttribute("aria-label", "Save " + product.name);
        wishlistBtn.setAttribute("aria-pressed", String(saved));
        wishlistBtn.innerHTML = `<i class="${saved ? "fa-solid" : "fa-regular"} fa-heart"></i>`;
        wishlistBtn.addEventListener("click", function (e) {
            e.preventDefault();
            e.stopPropagation();
            toggleWishlist(product.id);
        });

        const nameEl = document.createElement("p");
        nameEl.className = "product-name";
        nameEl.textContent = product.name;

        const ratingEl = document.createElement("div");
        ratingEl.className = "product-rating";
        ratingEl.innerHTML = `<i class="fa-solid fa-star"></i><span>${product.rating}</span><span class="product-review-count">(${product.reviewCount})</span>`;

        const priceEl = document.createElement("p");
        priceEl.className = "product-price";
        priceEl.textContent = product.priceFormatted;

        const oldPriceEl = document.createElement("p");
        oldPriceEl.className = "product-old-price";
        oldPriceEl.textContent = product.originalPriceFormatted;

        imageLink.appendChild(imageWrapper);
        imageLink.appendChild(nameEl);
        imageLink.appendChild(ratingEl);
        imageLink.appendChild(priceEl);
        imageLink.appendChild(oldPriceEl);

        if (showStockBar) {
            const left = product.stockLeft || 9;
            const stockPct = Math.max(18, Math.min(92, Math.round(100 - left * 3.5)));
            const stockLabel = document.createElement("div");
            stockLabel.className = "product-stock-label";
            stockLabel.textContent = left <= 5 ? `Only ${left} items left` : `${left} items left`;

            const stockBar = document.createElement("div");
            stockBar.className = "product-stock-bar";
            const stockFill = document.createElement("div");
            stockFill.style.width = stockPct + "%";
            stockBar.appendChild(stockFill);

            imageLink.appendChild(stockLabel);
            imageLink.appendChild(stockBar);
        }

        const addBtn = document.createElement("button");
        addBtn.type = "button";
        addBtn.className = "product-add-btn";
        addBtn.innerHTML = `<i class="fa-solid fa-cart-plus"></i> Add to Cart`;
        addBtn.addEventListener("click", function (e) {
            e.preventDefault();
            e.stopPropagation();
            addToCart(product.id, 1);
            addBtn.classList.add("is-added");
            addBtn.innerHTML = `<i class="fa-solid fa-check"></i> Added`;
            setTimeout(function () {
                addBtn.classList.remove("is-added");
                addBtn.innerHTML = `<i class="fa-solid fa-cart-plus"></i> Add to Cart`;
            }, 950);
        });

        card.appendChild(wishlistBtn);
        card.appendChild(imageLink);
        card.appendChild(addBtn);

        return card;
    }

    /* ---------- Cart Drawer & Checkout Modal ---------- */

    let activePromo = null;

    function ensureOverlays() {
        if (!document.getElementById("swb-cart-drawer")) {
            const drawerMarkup = `
                <div class="swb-backdrop" id="swb-cart-backdrop" hidden></div>
                <aside class="swb-drawer" id="swb-cart-drawer" aria-label="Shopping cart" aria-hidden="true">
                    <div class="swb-drawer-header">
                        <h3><i class="fa-solid fa-cart-shopping"></i> Your Cart (<span id="swb-drawer-count">0</span>)</h3>
                        <button type="button" class="swb-icon-close" id="swb-cart-close" aria-label="Close cart">
                            <i class="fa-solid fa-xmark"></i>
                        </button>
                    </div>
                    <div class="swb-free-shipping-bar" id="swb-free-shipping-bar"></div>
                    <div class="swb-drawer-body" id="swb-cart-items"></div>
                    <div class="swb-drawer-footer" id="swb-cart-footer">
                        <form class="swb-promo-form" id="swb-promo-form">
                            <input type="text" id="swb-promo-input" placeholder="Promo code (try BAMI10)" aria-label="Promo code">
                            <button type="submit">Apply</button>
                        </form>
                        <div class="swb-promo-feedback" id="swb-promo-feedback"></div>
                        <div class="swb-cart-summary" id="swb-cart-summary"></div>
                        <button type="button" class="swb-checkout-btn" id="swb-open-checkout">Proceed to Checkout</button>
                        <button type="button" class="swb-clear-cart-btn" id="swb-clear-cart">Clear Cart</button>
                    </div>
                </aside>
            `;
            const wrapper = document.createElement("div");
            wrapper.innerHTML = drawerMarkup;
            while (wrapper.firstElementChild) {
                document.body.appendChild(wrapper.firstElementChild);
            }

            document.getElementById("swb-cart-close").addEventListener("click", closeCartDrawer);
            document.getElementById("swb-cart-backdrop").addEventListener("click", closeCartDrawer);
            document.getElementById("swb-clear-cart").addEventListener("click", function () {
                if (getCart().length === 0) return;
                clearCart();
                activePromo = null;
                showToast("Cart cleared");
            });
            document.getElementById("swb-promo-form").addEventListener("submit", function (e) {
                e.preventDefault();
                const input = document.getElementById("swb-promo-input");
                const feedback = document.getElementById("swb-promo-feedback");
                const code = (input.value || "").trim().toUpperCase();
                if (!code) {
                    activePromo = null;
                    feedback.textContent = "";
                    renderCartDrawer();
                    return;
                }
                if (PROMO_CODES[code]) {
                    activePromo = { code: code, rate: PROMO_CODES[code].discountRate, label: PROMO_CODES[code].label };
                    feedback.className = "swb-promo-feedback is-success";
                    feedback.textContent = `${code} applied — ${activePromo.label}`;
                    renderCartDrawer();
                } else {
                    activePromo = null;
                    feedback.className = "swb-promo-feedback is-error";
                    feedback.textContent = "Invalid code. Try BAMI10 or WELCOME5.";
                    renderCartDrawer();
                }
            });
            document.getElementById("swb-open-checkout").addEventListener("click", openCheckoutModal);
        }

        if (!document.getElementById("swb-modal-backdrop")) {
            const modalMarkup = `
                <div class="swb-modal-backdrop" id="swb-modal-backdrop" hidden>
                    <div class="swb-modal" id="swb-modal" role="dialog" aria-modal="true" aria-labelledby="swb-modal-title">
                        <div class="swb-modal-header">
                            <h3 id="swb-modal-title">shopwithbami</h3>
                            <button type="button" class="swb-icon-close" id="swb-modal-close" aria-label="Close dialog">
                                <i class="fa-solid fa-xmark"></i>
                            </button>
                        </div>
                        <div class="swb-modal-body" id="swb-modal-body"></div>
                    </div>
                </div>
            `;
            const wrapper = document.createElement("div");
            wrapper.innerHTML = modalMarkup;
            document.body.appendChild(wrapper.firstElementChild);

            document.getElementById("swb-modal-close").addEventListener("click", closeModal);
            document.getElementById("swb-modal-backdrop").addEventListener("click", function (e) {
                if (e.target.id === "swb-modal-backdrop") closeModal();
            });
        }
    }

    function updateCartBadges() {
        const count = getCartCount();
        document.querySelectorAll(".cart-count-badge").forEach(function (badge) {
            badge.textContent = count > 99 ? "99+" : String(count);
            badge.hidden = count === 0;
        });
    }

    function renderCartDrawer() {
        const itemsEl = document.getElementById("swb-cart-items");
        const countEl = document.getElementById("swb-drawer-count");
        const summaryEl = document.getElementById("swb-cart-summary");
        const footerEl = document.getElementById("swb-cart-footer");
        const shippingBar = document.getElementById("swb-free-shipping-bar");
        if (!itemsEl) return;

        const cart = getCart();
        const count = getCartCount();
        const subtotal = getCartSubtotal();
        countEl.textContent = String(count);

        if (cart.length === 0) {
            shippingBar.hidden = true;
            footerEl.hidden = true;
            itemsEl.innerHTML = `
                <div class="swb-empty-state">
                    <i class="fa-solid fa-cart-shopping"></i>
                    <h4>Your cart is empty</h4>
                    <p>Browse our deals and add items to your cart to get started.</p>
                    <button type="button" class="swb-primary-btn" id="swb-start-shopping">Start Shopping</button>
                </div>
            `;
            const startBtn = document.getElementById("swb-start-shopping");
            if (startBtn) startBtn.addEventListener("click", closeCartDrawer);
            return;
        }

        shippingBar.hidden = false;
        footerEl.hidden = false;

        const remaining = FREE_DELIVERY_THRESHOLD - subtotal;
        if (remaining <= 0) {
            shippingBar.className = "swb-free-shipping-bar is-unlocked";
            shippingBar.innerHTML = `<i class="fa-solid fa-truck-fast"></i> You unlocked <strong>FREE Express Delivery!</strong>`;
        } else {
            shippingBar.className = "swb-free-shipping-bar";
            shippingBar.innerHTML = `<i class="fa-solid fa-truck"></i> Add <strong>${formatNaira(remaining)}</strong> more for FREE delivery`;
        }

        itemsEl.innerHTML = "";
        cart.forEach(function (item) {
            const row = document.createElement("div");
            row.className = "swb-cart-item";
            row.innerHTML = `
                <a href="product.html?id=${encodeURIComponent(item.id)}" class="swb-cart-thumb">
                    <img src="${item.image}" alt="${item.name.replace(/"/g, "&quot;")}">
                </a>
                <div class="swb-cart-info">
                    <a href="product.html?id=${encodeURIComponent(item.id)}" class="swb-cart-name"></a>
                    <div class="swb-cart-price">${formatNaira(item.price)}</div>
                    <div class="swb-cart-controls">
                        <div class="swb-qty-control">
                            <button type="button" class="swb-qty-dec" aria-label="Decrease quantity">&minus;</button>
                            <span>${item.qty}</span>
                            <button type="button" class="swb-qty-inc" aria-label="Increase quantity">+</button>
                        </div>
                        <button type="button" class="swb-remove-item" aria-label="Remove item">
                            <i class="fa-regular fa-trash-can"></i> Remove
                        </button>
                    </div>
                </div>
            `;
            row.querySelector(".swb-cart-name").textContent = item.name;
            const img = row.querySelector("img");
            img.onerror = function () {
                this.onerror = null;
                this.src = createFallbackSvg(item.name);
            };
            row.querySelector(".swb-qty-dec").addEventListener("click", function () { updateCartQty(item.id, -1); });
            row.querySelector(".swb-qty-inc").addEventListener("click", function () { updateCartQty(item.id, 1); });
            row.querySelector(".swb-remove-item").addEventListener("click", function () { removeFromCart(item.id); });
            itemsEl.appendChild(row);
        });

        const delivery = subtotal >= FREE_DELIVERY_THRESHOLD ? 0 : STANDARD_DELIVERY_FEE;
        const discount = activePromo ? Math.round(subtotal * activePromo.rate) : 0;
        const total = Math.max(0, subtotal - discount + delivery);

        summaryEl.innerHTML = `
            <div class="swb-summary-row"><span>Subtotal</span><span>${formatNaira(subtotal)}</span></div>
            ${discount > 0 ? `<div class="swb-summary-row is-discount"><span>Promo (${activePromo.code})</span><span>-${formatNaira(discount)}</span></div>` : ""}
            <div class="swb-summary-row"><span>Delivery</span><span>${delivery === 0 ? "FREE" : formatNaira(delivery)}</span></div>
            <div class="swb-summary-row is-total"><span>Total</span><span>${formatNaira(total)}</span></div>
        `;
    }

    function openCartDrawer() {
        ensureOverlays();
        renderCartDrawer();
        const drawer = document.getElementById("swb-cart-drawer");
        const backdrop = document.getElementById("swb-cart-backdrop");
        backdrop.hidden = false;
        drawer.classList.add("is-open");
        drawer.setAttribute("aria-hidden", "false");
        document.body.style.overflow = "hidden";
    }

    function closeCartDrawer() {
        const drawer = document.getElementById("swb-cart-drawer");
        const backdrop = document.getElementById("swb-cart-backdrop");
        if (!drawer || !backdrop) return;
        drawer.classList.remove("is-open");
        drawer.setAttribute("aria-hidden", "true");
        backdrop.hidden = true;
        document.body.style.overflow = "";
    }

    function openModal(title, htmlContent) {
        ensureOverlays();
        document.getElementById("swb-modal-title").textContent = title;
        const body = document.getElementById("swb-modal-body");
        body.innerHTML = htmlContent;
        document.getElementById("swb-modal-backdrop").hidden = false;
        document.body.style.overflow = "hidden";
        return body;
    }

    function closeModal() {
        const backdrop = document.getElementById("swb-modal-backdrop");
        if (backdrop) backdrop.hidden = true;
        document.body.style.overflow = "";
    }

    function openCheckoutModal() {
        const cart = getCart();
        if (cart.length === 0) return;
        closeCartDrawer();

        const user = getUser();
        const subtotal = getCartSubtotal();
        const delivery = subtotal >= FREE_DELIVERY_THRESHOLD ? 0 : STANDARD_DELIVERY_FEE;
        const discount = activePromo ? Math.round(subtotal * activePromo.rate) : 0;
        const total = Math.max(0, subtotal - discount + delivery);

        const body = openModal("Demo Checkout", `
            <form class="swb-checkout-form" id="swb-checkout-form">
                <p class="swb-demo-banner"><i class="fa-solid fa-circle-info"></i> Demo storefront checkout — no real payment is processed.</p>
                <div class="swb-form-grid">
                    <label>Full Name
                        <input type="text" name="fullName" required value="${user && user.name ? user.name.replace(/"/g, "&quot;") : ""}" placeholder="e.g. Tunde Adebayo">
                    </label>
                    <label>Phone Number
                        <input type="tel" name="phone" required value="${user && user.contact && !user.contact.includes("@") ? user.contact.replace(/"/g, "&quot;") : ""}" placeholder="e.g. 0803 123 4567">
                    </label>
                </div>
                <label>Delivery Address
                    <input type="text" name="address" required placeholder="Street address, area, and landmark">
                </label>
                <div class="swb-form-grid">
                    <label>State
                        <select name="state" required>
                            <option value="Lagos">Lagos</option>
                            <option value="Abuja (FCT)">Abuja (FCT)</option>
                            <option value="Rivers">Rivers</option>
                            <option value="Oyo">Oyo</option>
                            <option value="Ogun">Ogun</option>
                            <option value="Kano">Kano</option>
                            <option value="Enugu">Enugu</option>
                        </select>
                    </label>
                    <label>Payment Method
                        <select name="payment" required>
                            <option value="Pay on Delivery">Pay on Delivery</option>
                            <option value="Card (Visa / Mastercard / Verve)">Card (Visa / Mastercard / Verve)</option>
                            <option value="Bank Transfer">Bank Transfer</option>
                        </select>
                    </label>
                </div>
                <div class="swb-checkout-totals">
                    <div><span>Items (${getCartCount()})</span><span>${formatNaira(subtotal)}</span></div>
                    ${discount > 0 ? `<div class="is-discount"><span>Promo (${activePromo.code})</span><span>-${formatNaira(discount)}</span></div>` : ""}
                    <div><span>Delivery</span><span>${delivery === 0 ? "FREE" : formatNaira(delivery)}</span></div>
                    <div class="is-total"><span>Total to Pay</span><span>${formatNaira(total)}</span></div>
                </div>
                <button type="submit" class="swb-primary-btn swb-full-btn">Place Demo Order (${formatNaira(total)})</button>
            </form>
        `);

        body.querySelector("#swb-checkout-form").addEventListener("submit", function (e) {
            e.preventDefault();
            const fd = new FormData(e.target);
            const orderId = "SWB-" + Math.floor(100000 + Math.random() * 900000);
            const order = {
                id: orderId,
                date: new Date().toLocaleDateString("en-NG", { year: "numeric", month: "short", day: "numeric" }),
                customer: fd.get("fullName"),
                address: `${fd.get("address")}, ${fd.get("state")}`,
                payment: fd.get("payment"),
                items: cart.slice(),
                total: total,
                status: "Confirmed"
            };
            addOrder(order);
            clearCart();
            activePromo = null;

            body.innerHTML = `
                <div class="swb-order-success">
                    <div class="swb-success-icon"><i class="fa-solid fa-circle-check"></i></div>
                    <h4>Order Confirmed!</h4>
                    <p>Thank you, <strong>${order.customer}</strong>. Your demo order <strong>${order.id}</strong> has been placed.</p>
                    <div class="swb-order-meta">
                        <div><span>Delivery to:</span><strong>${order.address}</strong></div>
                        <div><span>Payment:</span><strong>${order.payment}</strong></div>
                        <div><span>Total:</span><strong>${formatNaira(order.total)}</strong></div>
                    </div>
                    <div class="swb-modal-actions">
                        <button type="button" class="swb-primary-btn" id="swb-view-orders-after">View My Orders</button>
                        <button type="button" class="swb-secondary-btn" id="swb-continue-after">Continue Shopping</button>
                    </div>
                </div>
            `;
            body.querySelector("#swb-view-orders-after").addEventListener("click", openOrdersModal);
            body.querySelector("#swb-continue-after").addEventListener("click", closeModal);
        });
    }

    function openWishlistModal() {
        const ids = getWishlist();
        const items = ids.map(function (id) { return productsById.get(id); }).filter(Boolean);
        if (items.length === 0) {
            const body = openModal("Saved Items", `
                <div class="swb-empty-state">
                    <i class="fa-regular fa-heart"></i>
                    <h4>No saved items yet</h4>
                    <p>Tap the heart icon on any product to save it for later.</p>
                    <button type="button" class="swb-primary-btn" id="swb-close-wish">Explore Deals</button>
                </div>
            `);
            body.querySelector("#swb-close-wish").addEventListener("click", closeModal);
            return;
        }

        const body = openModal(`Saved Items (${items.length})`, `<div class="swb-saved-list" id="swb-saved-list"></div>`);
        const listEl = body.querySelector("#swb-saved-list");
        items.forEach(function (p) {
            const row = document.createElement("div");
            row.className = "swb-cart-item";
            row.innerHTML = `
                <a href="product.html?id=${encodeURIComponent(p.id)}" class="swb-cart-thumb">
                    <img src="${p.image}" alt="">
                </a>
                <div class="swb-cart-info">
                    <a href="product.html?id=${encodeURIComponent(p.id)}" class="swb-cart-name"></a>
                    <div class="swb-cart-price">${p.priceFormatted}</div>
                    <div class="swb-cart-controls">
                        <button type="button" class="swb-primary-btn swb-sm-btn swb-move-cart">Add to Cart</button>
                        <button type="button" class="swb-remove-item">Remove</button>
                    </div>
                </div>
            `;
            row.querySelector("img").alt = p.name;
            row.querySelector(".swb-cart-name").textContent = p.name;
            row.querySelector(".swb-move-cart").addEventListener("click", function () {
                addToCart(p.id, 1);
            });
            row.querySelector(".swb-remove-item").addEventListener("click", function () {
                toggleWishlist(p.id);
                openWishlistModal();
            });
            listEl.appendChild(row);
        });
    }

    function openOrdersModal() {
        const orders = getOrders();
        if (orders.length === 0) {
            const body = openModal("My Orders", `
                <div class="swb-empty-state">
                    <i class="fa-solid fa-box-open"></i>
                    <h4>No orders placed yet</h4>
                    <p>Items you check out in this demo storefront will appear here.</p>
                    <button type="button" class="swb-primary-btn" id="swb-close-orders">Browse Products</button>
                </div>
            `);
            body.querySelector("#swb-close-orders").addEventListener("click", closeModal);
            return;
        }

        const html = orders.map(function (o) {
            const count = o.items.reduce(function (s, i) { return s + (i.qty || 1); }, 0);
            return `
                <div class="swb-order-card">
                    <div class="swb-order-card-top">
                        <strong>${o.id}</strong>
                        <span class="swb-status-pill">${o.status}</span>
                    </div>
                    <p class="swb-order-sub">${o.date} &bull; ${count} item${count === 1 ? "" : "s"} &bull; ${o.payment}</p>
                    <p class="swb-order-sub">Deliver to: ${o.address}</p>
                    <div class="swb-order-total">Total: <strong>${formatNaira(o.total)}</strong></div>
                </div>
            `;
        }).join("");

        openModal(`My Orders (${orders.length})`, `<div class="swb-orders-list">${html}</div>`);
    }

    function openInfoModal(title, description, bullets) {
        const listHtml = bullets && bullets.length
            ? `<ul class="swb-info-list">${bullets.map(function (b) { return `<li>${b}</li>`; }).join("")}</ul>`
            : "";
        const body = openModal(title, `
            <p class="swb-info-text">${description}</p>
            ${listHtml}
            <button type="button" class="swb-primary-btn" id="swb-info-ok">Got it</button>
        `);
        body.querySelector("#swb-info-ok").addEventListener("click", closeModal);
    }

    /* ---------- Shared Navbar Wiring (Account, Help, Cart) ---------- */

    function refreshAccountUI() {
        const user = getUser();
        const label = document.getElementById("nav-account-label");
        const menu = document.getElementById("nav-account-menu");
        if (!label || !menu) return;

        if (user && user.name) {
            const firstName = user.name.trim().split(/\s+/)[0];
            label.textContent = "Hi, " + firstName;
            menu.innerHTML = `
                <div class="swb-dropdown-user">
                    <strong>${user.name}</strong>
                    <span>${user.contact || ""}</span>
                </div>
                <button type="button" class="swb-dropdown-item" data-action="orders"><i class="fa-solid fa-box"></i> My Orders</button>
                <button type="button" class="swb-dropdown-item" data-action="wishlist"><i class="fa-regular fa-heart"></i> Saved Items</button>
                <div class="swb-dropdown-divider"></div>
                <button type="button" class="swb-dropdown-item is-danger" data-action="signout"><i class="fa-solid fa-right-from-bracket"></i> Sign Out</button>
            `;
        } else {
            label.textContent = "Account";
            menu.innerHTML = `
                <a href="accountcreation.html" class="swb-dropdown-cta">Sign In / Create Account</a>
                <div class="swb-dropdown-divider"></div>
                <button type="button" class="swb-dropdown-item" data-action="orders"><i class="fa-solid fa-box"></i> My Orders</button>
                <button type="button" class="swb-dropdown-item" data-action="wishlist"><i class="fa-regular fa-heart"></i> Saved Items</button>
            `;
        }

        menu.querySelectorAll("[data-action]").forEach(function (btn) {
            btn.addEventListener("click", function () {
                closeAllDropdowns();
                const action = btn.dataset.action;
                if (action === "orders") openOrdersModal();
                else if (action === "wishlist") openWishlistModal();
                else if (action === "signout") signOutUser();
            });
        });
    }

    function closeAllDropdowns() {
        document.querySelectorAll(".swb-dropdown.is-open").forEach(function (dd) {
            dd.classList.remove("is-open");
            const trigger = dd.querySelector("[aria-expanded]");
            if (trigger) trigger.setAttribute("aria-expanded", "false");
        });
    }

    function initSharedHeader() {
        ensureOverlays();
        updateCartBadges();
        refreshAccountUI();

        document.querySelectorAll(".swb-dropdown").forEach(function (dropdown) {
            const trigger = dropdown.querySelector(".topbar-button");
            if (!trigger) return;
            trigger.addEventListener("click", function (e) {
                e.stopPropagation();
                const isOpen = dropdown.classList.contains("is-open");
                closeAllDropdowns();
                if (!isOpen) {
                    dropdown.classList.add("is-open");
                    trigger.setAttribute("aria-expanded", "true");
                }
            });
        });

        const helpMenu = document.getElementById("nav-help-menu");
        if (helpMenu) {
            helpMenu.querySelectorAll("[data-help]").forEach(function (btn) {
                btn.addEventListener("click", function () {
                    closeAllDropdowns();
                    const topic = btn.dataset.help;
                    if (topic === "track") {
                        openOrdersModal();
                    } else if (topic === "returns") {
                        openInfoModal(
                            "Easy 7-Day Returns",
                            "Shop with confidence on shopwithbami. Eligible items can be returned within 7 days of delivery.",
                            [
                                "Keep original packaging and tags intact.",
                                "Instant refund to your wallet or original payment method.",
                                "Free pickup for defective or wrong items."
                            ]
                        );
                    } else if (topic === "contact") {
                        openInfoModal(
                            "Contact shopwithbami Support",
                            "Our customer support team is available Monday to Saturday, 8:00 AM – 8:00 PM WAT.",
                            [
                                "Call to Order & Support: 0201 888 1106",
                                "Email: support@shopwithbami.demo",
                                "Live Order Tracking available inside My Orders"
                            ]
                        );
                    } else {
                        openInfoModal(
                            "Help Center",
                            "Need help shopping on shopwithbami? Here are quick answers to common questions:",
                            [
                                "Free Express Delivery on orders of ₦ 100,000 and above.",
                                "Use promo code BAMI10 at cart for 10% off your order.",
                                "Pay on Delivery available in Lagos, Abuja, Port Harcourt & more."
                            ]
                        );
                    }
                });
            });
        }

        const cartBtn = document.getElementById("nav-cart-btn");
        if (cartBtn) {
            cartBtn.addEventListener("click", function () {
                closeAllDropdowns();
                openCartDrawer();
            });
        }

        document.addEventListener("click", function (e) {
            if (!e.target.closest(".swb-dropdown")) {
                closeAllDropdowns();
            }
        });

        document.addEventListener("keydown", function (e) {
            if (e.key === "Escape") {
                closeAllDropdowns();
                closeCartDrawer();
                closeModal();
            }
        });
    }

    function initSharedFooter() {
        const newsletterForm = document.querySelector(".newsletter-form");
        if (newsletterForm) {
            const container = newsletterForm.closest(".newsletter-content");
            const checkbox = container ? container.querySelector('input[type="checkbox"]') : null;
            const input = newsletterForm.querySelector('input[type="email"]');

            let msg = container ? container.querySelector(".newsletter-feedback") : null;
            if (container && !msg) {
                msg = document.createElement("p");
                msg.className = "newsletter-feedback";
                container.appendChild(msg);
            }

            newsletterForm.addEventListener("submit", function (e) {
                e.preventDefault();
                const email = (input ? input.value : "").trim();
                const validEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
                if (!validEmail) {
                    if (msg) {
                        msg.className = "newsletter-feedback is-error";
                        msg.textContent = "Please enter a valid email address.";
                    }
                    if (input) input.focus();
                    return;
                }
                if (checkbox && !checkbox.checked) {
                    if (msg) {
                        msg.className = "newsletter-feedback is-error";
                        msg.textContent = "Please agree to shopwithbami's Privacy and Cookie Policy first.";
                    }
                    checkbox.focus();
                    return;
                }
                if (msg) {
                    msg.className = "newsletter-feedback is-success";
                    msg.textContent = `Thanks for subscribing! Exclusive offers will be sent to ${email}.`;
                }
                if (input) input.value = "";
                showToast("Subscribed to shopwithbami newsletter!");
            });
        }

        document.querySelectorAll(".site-footer a[data-info]").forEach(function (link) {
            link.addEventListener("click", function (e) {
                e.preventDefault();
                const title = link.dataset.info || link.textContent.trim();
                openInfoModal(
                    title,
                    `This is the ${title} information view for the shopwithbami independent demo storefront.`,
                    [
                        "Fast nationwide delivery with live order updates.",
                        "Secure demo checkout with Pay on Delivery and Card options.",
                        "Support line: 0201 888 1106 (Mon – Sat, 8am – 8pm)."
                    ]
                );
            });
        });
    }

    /* ---------- Search & Filtering ---------- */

    function searchCatalog(query, category) {
        const q = (query || "").trim().toLowerCase();
        const cat = (category || "").trim();
        const seen = new Set();

        return allProducts.filter(function (p) {
            // Avoid showing exact duplicate product names in unified search/category grids
            const dedupeKey = p.name.toLowerCase();
            if (seen.has(dedupeKey)) return false;

            let matchesCategory = true;
            if (cat && cat !== "All" && cat !== "Other categories") {
                const meta = CATEGORY_META[cat];
                const direct = p.category.toLowerCase() === cat.toLowerCase();
                const kwMatch = meta && meta.keywords.some(function (kw) {
                    return p.name.toLowerCase().includes(kw) || p.sectionTitle.toLowerCase().includes(kw);
                });
                matchesCategory = direct || Boolean(kwMatch);
            }

            let matchesQuery = true;
            if (q) {
                const haystack = `${p.name} ${p.brand} ${p.category} ${p.sectionTitle}`.toLowerCase();
                matchesQuery = q.split(/\s+/).every(function (term) {
                    return haystack.includes(term);
                });
            }

            if (matchesCategory && matchesQuery) {
                seen.add(dedupeKey);
                return true;
            }
            return false;
        });
    }

    function getRelatedProducts(product, limit) {
        const max = limit || 6;
        const pool = allProducts.filter(function (p) {
            return p.id !== product.id && p.name !== product.name &&
                (p.category === product.category || p.sectionId === product.sectionId);
        });
        const unique = [];
        const seen = new Set();
        for (const item of pool) {
            if (seen.has(item.name)) continue;
            seen.add(item.name);
            unique.push(item);
            if (unique.length >= max) break;
        }
        return unique;
    }

    window.SWB = {
        STORAGE_KEYS: STORAGE_KEYS,
        sections: sections,
        allProducts: allProducts,
        getProductById: function (id) { return productsById.get(id) || null; },
        getSectionById: function (id) { return sections.find(function (s) { return s.id === id; }) || null; },
        getSectionByTitle: function (title) {
            const target = (title || "").trim().toLowerCase();
            return sections.find(function (s) { return s.title.toLowerCase() === target; }) || null;
        },
        searchCatalog: searchCatalog,
        getRelatedProducts: getRelatedProducts,
        formatNaira: formatNaira,
        createFallbackSvg: createFallbackSvg,
        createProductCard: createProductCard,
        getCart: getCart,
        addToCart: addToCart,
        updateCartQty: updateCartQty,
        removeFromCart: removeFromCart,
        clearCart: clearCart,
        getCartCount: getCartCount,
        getWishlist: getWishlist,
        isWishlisted: isWishlisted,
        toggleWishlist: toggleWishlist,
        getUser: getUser,
        setUser: setUser,
        signOutUser: signOutUser,
        getOrders: getOrders,
        openCartDrawer: openCartDrawer,
        closeCartDrawer: closeCartDrawer,
        openCheckoutModal: openCheckoutModal,
        openWishlistModal: openWishlistModal,
        openOrdersModal: openOrdersModal,
        openInfoModal: openInfoModal,
        closeModal: closeModal,
        showToast: showToast,
        initSharedHeader: initSharedHeader,
        initSharedFooter: initSharedFooter
    };
})(window);
