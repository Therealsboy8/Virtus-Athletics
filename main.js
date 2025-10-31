// Virtus Athletics - Main JavaScript File

// Product Data
const products = [
    {
        id: 1,
        name: "Virtus Training Shirt",
        price: 49,
        category: "apparel",
        image: "resources/product-shirt.jpg",
        description: "Premium moisture-wicking fabric with athletic fit. Perfect for intense training sessions.",
        sizes: ["S", "M", "L", "XL"],
        colors: ["Black", "Slate Gray"],
        featured: true
    },
    {
        id: 2,
        name: "Resistance Band Set",
        price: 79,
        category: "equipment",
        image: "resources/product-bands.jpg",
        description: "Professional-grade resistance bands with reinforced handles and multiple resistance levels.",
        resistance: ["Light", "Medium", "Heavy", "Extra Heavy"],
        featured: true
    },
    {
        id: 3,
        name: "Wooden Gym Rings",
        price: 89,
        category: "equipment",
        image: "resources/product-rings.jpg",
        description: "Premium birch wood gymnastic rings with adjustable straps for all training levels.",
        material: "Birch Wood",
        straps: "15ft Adjustable",
        featured: true
    },
    {
        id: 4,
        name: "Virtus Training Shorts",
        price: 59,
        category: "apparel",
        image: "resources/product-shorts.jpg",
        description: "Lightweight performance shorts with compression liner and moisture-wicking technology.",
        sizes: ["S", "M", "L", "XL"],
        colors: ["Black", "Slate Gray"],
        featured: true
    },
    {
        id: 5,
        name: "Virtus Performance Hoodie",
        price: 89,
        category: "apparel",
        image: "resources/product-hoodie.jpg",
        description: "Premium thermal regulation hoodie with modern athletic fit and premium materials.",
        sizes: ["S", "M", "L", "XL"],
        colors: ["Black", "Charcoal"],
        featured: true
    },
    {
        id: 6,
        name: "Premium Wrist Wraps",
        price: 29,
        category: "accessories",
        image: "https://kimi-web-img.moonshot.cn/img/www.usa-iron.com/d013a9f9a5fc0050e6fcf31953c3db583ce6eac3.jpg",
        description: "Professional-grade wrist wraps for maximum support during heavy lifts.",
        sizes: ["18\"", "24\"", "30\""],
        colors: ["Black", "Iron Bronze"]
    },
    {
        id: 7,
        name: "Liquid Chalk",
        price: 19,
        category: "accessories",
        image: "https://kimi-web-img.moonshot.cn/img/www.performbetter.com/ddc31204311458b09723af984df264fd679eef87.jpg",
        description: "Premium liquid chalk for enhanced grip during calisthenics and weight training.",
        volume: "250ml",
        type: "Liquid Chalk"
    },
    {
        id: 8,
        name: "Parallette Bars",
        price: 129,
        category: "equipment",
        image: "https://kimi-web-img.moonshot.cn/img/images.squarespace-cdn.com/11c4e6fa35eb9a3c30080f7c461797d7496477b1.jpg",
        description: "Professional parallette bars for advanced calisthenics and bodyweight training.",
        height: "30cm",
        material: "Steel & Wood",
        weight_capacity: "200kg"
    },
    {
        id: 9,
        name: "Speed Rope Pro",
        price: 39,
        category: "equipment",
        image: "https://kimi-web-img.moonshot.cn/img/hips.hearstapps.com/3f0019ee894a9ec51f0f5a5cb21810c470392ba5.png",
        description: "Professional speed rope with ball bearing system for cardio and conditioning.",
        length: "Adjustable",
        handles: "Aluminum",
        cable: "Steel"
    },
    {
        id: 10,
        name: "Compression Leggings",
        price: 69,
        category: "apparel",
        image: "https://kimi-web-img.moonshot.cn/img/cdn.shopify.com/37b4fd80eb8218dbf951567bc77727186ab59468.png",
        description: "Premium compression leggings for enhanced performance and recovery.",
        sizes: ["S", "M", "L", "XL"],
        colors: ["Black", "Slate Gray"],
        compression: "Graduated"
    },
    {
        id: 11,
        name: "Training Tank Top",
        price: 39,
        category: "apparel",
        image: "https://kimi-web-img.moonshot.cn/img/assets.roguefitness.com/d8c541022e2032378d4b828f7df35d8deba76f0d.png",
        description: "Lightweight training tank top with moisture-wicking technology.",
        sizes: ["S", "M", "L", "XL"],
        colors: ["Black", "White", "Slate Gray"]
    },
    {
        id: 12,
        name: "Gym Bag Pro",
        price: 79,
        category: "accessories",
        image: "https://kimi-web-img.moonshot.cn/img/images.squarespace-cdn.com/90b3eaa481af1ac1af42826dd83093781929c9b5.jpg",
        description: "Premium gym bag with multiple compartments and durable construction.",
        capacity: "40L",
        material: "Water-resistant",
        compartments: "Shoe compartment"
    },
    {
        id: 13,
        name: "Performance Socks (3-pack)",
        price: 24,
        category: "apparel",
        image: "https://kimi-web-img.moonshot.cn/img/cdn.runrepeat.com/87273df04490a7598b8d998007807106eed0f28b.jpg",
        description: "Premium performance socks with arch support and moisture-wicking fabric.",
        sizes: ["S", "M", "L", "XL"],
        colors: ["Black", "White"],
        pack: "3 pairs"
    },
    {
        id: 14,
        name: "Water Bottle Pro",
        price: 34,
        category: "accessories",
        image: "https://kimi-web-img.moonshot.cn/img/hips.hearstapps.com/b350417eb5cf32dddeac46b2e27141b3b98ae76b.jpg",
        description: "Insulated stainless steel water bottle with leak-proof design.",
        capacity: "750ml",
        material: "Stainless Steel",
        insulation: "Double-wall"
    },
    {
        id: 15,
        name: "Training Shoes Elite",
        price: 149,
        category: "apparel",
        image: "https://kimi-web-img.moonshot.cn/img/d1nymbkeomeoqg.cloudfront.net/3d72a6386d2a9933fc16a07ec6baf93b9fba4808.jpg",
        description: "Premium training shoes designed for calisthenics and functional fitness.",
        sizes: ["7", "8", "9", "10", "11", "12", "13"],
        colors: ["Black", "Slate Gray"],
        features: ["Breathable", "Supportive", "Durable"]
    },
    {
        id: 16,
        name: "Foam Roller Pro",
        price: 49,
        category: "equipment",
        image: "https://kimi-web-img.moonshot.cn/img/tallslimtees.com/9e3be1a69b81dd0ddd67656b84e2d33e8df52765.jpg",
        description: "High-density foam roller for muscle recovery and mobility work.",
        length: "60cm",
        density: "High",
        material: "EVA Foam"
    },
    {
        id: 17,
        name: "Pull-up Bar Doorway",
        price: 59,
        category: "equipment",
        image: "https://kimi-web-img.moonshot.cn/img/image.made-in-china.com/c3a051d20c60852272e6d4a8bcf87801bbd10764.webp",
        description: "Heavy-duty doorway pull-up bar with multiple grip positions.",
        max_weight: "150kg",
        grips: "Multiple",
        installation: "No screws"
    },
    {
        id: 18,
        name: "Athletic Beanie",
        price: 24,
        category: "apparel",
        image: "https://kimi-web-img.moonshot.cn/img/yorkbarbell.com/13a64e2c2b9a7fde8348f873f58f1fd10c54195e.jpg",
        description: "Premium knit beanie with moisture-wicking properties.",
        sizes: ["One Size"],
        colors: ["Black", "Slate Gray", "Iron Bronze"],
        material: "Merino Wool Blend"
    }
];

// Global variables
let filteredProducts = [...products];
let currentPage = 1;
const productsPerPage = 9;

// DOM Content Loaded Event
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

// Initialize Application
function initializeApp() {
    // Initialize based on current page
    const currentPage = getCurrentPage();
    
    // Common initialization
    initializeScrollAnimations();
    initializeNavigation();
    
    // Page-specific initialization
    switch(currentPage) {
        case 'index':
            initializeHomePage();
            break;
        case 'shop':
            initializeShopPage();
            break;
        case 'community':
            initializeCommunityPage();
            break;
    }
}

// Get Current Page
function getCurrentPage() {
    const path = window.location.pathname;
    if (path.includes('shop.html')) return 'shop';
    if (path.includes('community.html')) return 'community';
    return 'index';
}

// Initialize Scroll Animations
function initializeScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
            }
        });
    }, observerOptions);
    
    // Observe all reveal elements
    document.querySelectorAll('.reveal').forEach(el => {
        observer.observe(el);
    });
}

// Initialize Navigation
function initializeNavigation() {
    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// Initialize Home Page
function initializeHomePage() {
    // Initialize typewriter effect
    if (document.getElementById('typed-tagline')) {
        new Typed('#typed-tagline', {
            strings: ['Earn Your Virtus.', 'Elite Is Earned.', 'Discipline Over Everything.'],
            typeSpeed: 80,
            backSpeed: 50,
            backDelay: 2000,
            loop: true,
            showCursor: true,
            cursorChar: '|'
        });
    }
    
    // Initialize product hover effects
    initializeProductHovers();
    
    // Initialize newsletter form
    initializeNewsletterForm();
}

// Initialize Shop Page
function initializeShopPage() {
    // Initialize product grid
    renderProducts();
    
    // Initialize filters
    initializeFilters();
    
    // Initialize search
    initializeSearch();
    
    // Initialize quick view modal
    initializeQuickView();
    
    // Initialize load more functionality
    initializeLoadMore();
}

// Initialize Community Page
function initializeCommunityPage() {
    // Initialize progress chart
    initializeProgressChart();
    
    // Initialize challenge calendar
    initializeChallengeCalendar();
    
    // Initialize challenge buttons
    initializeChallengeButtons();
}

// Product Grid Functions
function renderProducts() {
    const grid = document.getElementById('productsGrid');
    if (!grid) return;
    
    const startIndex = (currentPage - 1) * productsPerPage;
    const endIndex = startIndex + productsPerPage;
    const productsToShow = filteredProducts.slice(startIndex, endIndex);
    
    if (currentPage === 1) {
        grid.innerHTML = '';
    }
    
    productsToShow.forEach((product, index) => {
        const productCard = createProductCard(product, index);
        grid.appendChild(productCard);
    });
    
    // Update product count
    const productCount = document.getElementById('productCount');
    if (productCount) {
        productCount.textContent = filteredProducts.length;
    }
    
    // Animate new products
    anime({
        targets: '.product-card',
        opacity: [0, 1],
        translateY: [30, 0],
        delay: anime.stagger(100),
        duration: 600,
        easing: 'easeOutQuad'
    });
}

function createProductCard(product, index) {
    const card = document.createElement('div');
    card.className = 'product-card rounded-xl p-6 reveal';
    card.style.transitionDelay = `${index * 0.1}s`;
    
    card.innerHTML = `
        <div class="relative overflow-hidden rounded-lg mb-4">
            <img src="${product.image}" alt="${product.name}" class="w-full h-64 object-cover transition-transform duration-300 hover:scale-110">
            ${product.featured ? '<div class="absolute top-2 right-2 bg-yellow-600 text-white px-2 py-1 rounded text-xs font-semibold">FEATURED</div>' : ''}
        </div>
        <h3 class="text-xl font-bold mb-2">${product.name}</h3>
        <p class="text-gray-400 mb-4">${product.description}</p>
        <div class="flex justify-between items-center">
            <span class="text-2xl font-bold text-yellow-600">$${product.price}</span>
            <div class="flex space-x-2">
                <button onclick="quickView(${product.id})" class="text-gray-400 hover:text-yellow-600 transition-colors">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                    </svg>
                </button>
                <button onclick="addToCart(${product.id})" class="btn-primary px-4 py-2 rounded text-sm">Add to Cart</button>
            </div>
        </div>
    `;
    
    return card;
}

// Filter Functions
function initializeFilters() {
    // Category filters
    document.querySelectorAll('[data-filter]').forEach(btn => {
        btn.addEventListener('click', function() {
            // Update active state
            document.querySelectorAll('[data-filter]').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            // Filter products
            const filter = this.dataset.filter;
            if (filter === 'all') {
                filteredProducts = [...products];
            } else {
                filteredProducts = products.filter(product => product.category === filter);
            }
            
            currentPage = 1;
            renderProducts();
        });
    });
    
    // Price filters
    document.querySelectorAll('[data-price]').forEach(btn => {
        btn.addEventListener('click', function() {
            const priceRange = this.dataset.price;
            
            filteredProducts = products.filter(product => {
                if (priceRange === '0-50') return product.price < 50;
                if (priceRange === '50-100') return product.price >= 50 && product.price <= 100;
                if (priceRange === '100-200') return product.price >= 100 && product.price <= 200;
                if (priceRange === '200+') return product.price >= 200;
                return true;
            });
            
            currentPage = 1;
            renderProducts();
        });
    });
    
    // Sort functionality
    const sortSelect = document.getElementById('sortSelect');
    if (sortSelect) {
        sortSelect.addEventListener('change', function() {
            const sortBy = this.value;
            
            filteredProducts.sort((a, b) => {
                switch(sortBy) {
                    case 'price-low':
                        return a.price - b.price;
                    case 'price-high':
                        return b.price - a.price;
                    case 'newest':
                        return b.id - a.id;
                    default:
                        return b.featured - a.featured;
                }
            });
            
            currentPage = 1;
            renderProducts();
        });
    }
    
    // Clear filters
    const clearFilters = document.getElementById('clearFilters');
    if (clearFilters) {
        clearFilters.addEventListener('click', function() {
            filteredProducts = [...products];
            currentPage = 1;
            
            // Reset filter buttons
            document.querySelectorAll('.filter-btn').forEach(btn => {
                btn.classList.remove('active');
            });
            document.querySelector('[data-filter="all"]')?.classList.add('active');
            
            // Reset sort
            if (sortSelect) sortSelect.value = 'featured';
            
            renderProducts();
        });
    }
}

// Search Functions
function initializeSearch() {
    const searchInput = document.getElementById('searchInput');
    if (!searchInput) return;
    
    let searchTimeout;
    
    searchInput.addEventListener('input', function() {
        clearTimeout(searchTimeout);
        searchTimeout = setTimeout(() => {
            const query = this.value.toLowerCase().trim();
            
            if (query === '') {
                filteredProducts = [...products];
            } else {
                filteredProducts = products.filter(product => 
                    product.name.toLowerCase().includes(query) ||
                    product.description.toLowerCase().includes(query) ||
                    product.category.toLowerCase().includes(query)
                );
            }
            
            currentPage = 1;
            renderProducts();
        }, 300);
    });
}

// Quick View Functions
function initializeQuickView() {
    const modal = document.getElementById('quickViewModal');
    const closeBtn = document.getElementById('closeModal');
    
    if (closeBtn) {
        closeBtn.addEventListener('click', () => {
            modal.classList.remove('active');
        });
    }
    
    if (modal) {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.classList.remove('active');
            }
        });
    }
}

function quickView(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;
    
    const modal = document.getElementById('quickViewModal');
    const modalImage = document.getElementById('modalImage');
    const modalTitle = document.getElementById('modalTitle');
    const modalDescription = document.getElementById('modalDescription');
    const modalPrice = document.getElementById('modalPrice');
    
    if (modalImage) modalImage.src = product.image;
    if (modalTitle) modalTitle.textContent = product.name;
    if (modalDescription) modalDescription.textContent = product.description;
    if (modalPrice) modalPrice.textContent = `$${product.price}`;
    
    modal.classList.add('active');
}

// Load More Functions
function initializeLoadMore() {
    const loadMoreBtn = document.getElementById('loadMore');
    if (!loadMoreBtn) return;
    
    loadMoreBtn.addEventListener('click', function() {
        currentPage++;
        renderProducts();
        
        // Hide button if no more products
        if (currentPage * productsPerPage >= filteredProducts.length) {
            this.style.display = 'none';
        }
    });
}

// Product Hover Effects
function initializeProductHovers() {
    document.querySelectorAll('.product-card').forEach(card => {
        card.addEventListener('mouseenter', function() {
            anime({
                targets: this,
                rotateX: 5,
                rotateY: 5,
                scale: 1.02,
                duration: 300,
                easing: 'easeOutQuad'
            });
        });
        
        card.addEventListener('mouseleave', function() {
            anime({
                targets: this,
                rotateX: 0,
                rotateY: 0,
                scale: 1,
                duration: 300,
                easing: 'easeOutQuad'
            });
        });
    });
}

// Newsletter Form
function initializeNewsletterForm() {
    const newsletterForm = document.querySelector('input[type="email"]');
    if (!newsletterForm) return;
    
    const joinBtn = newsletterForm.nextElementSibling;
    if (joinBtn) {
        joinBtn.addEventListener('click', function(e) {
            e.preventDefault();
            const email = newsletterForm.value.trim();
            
            if (email && isValidEmail(email)) {
                showNotification('Welcome to Virtus! Check your email for your 10% discount code.', 'success');
                newsletterForm.value = '';
            } else {
                showNotification('Please enter a valid email address.', 'error');
            }
        });
    }
}

// Progress Chart for Community Page
function initializeProgressChart() {
    const chartElement = document.getElementById('progressChart');
    if (!chartElement) return;
    
    const chart = echarts.init(chartElement);
    
    const option = {
        backgroundColor: 'transparent',
        title: {
            text: 'Strength Progress Over Time',
            textStyle: {
                color: '#ffffff',
                fontSize: 18
            }
        },
        tooltip: {
            trigger: 'axis',
            backgroundColor: '#1A1A1A',
            borderColor: '#8B6914',
            textStyle: {
                color: '#ffffff'
            }
        },
        legend: {
            data: ['Push-ups', 'Pull-ups', 'Plank Hold (seconds)'],
            textStyle: {
                color: '#ffffff'
            }
        },
        grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
        },
        xAxis: {
            type: 'category',
            boundaryGap: false,
            data: ['Day 1', 'Day 5', 'Day 10', 'Day 15', 'Day 20', 'Day 25', 'Day 30'],
            axisLine: {
                lineStyle: {
                    color: '#2D2D2D'
                }
            },
            axisLabel: {
                color: '#9CA3AF'
            }
        },
        yAxis: {
            type: 'value',
            axisLine: {
                lineStyle: {
                    color: '#2D2D2D'
                }
            },
            axisLabel: {
                color: '#9CA3AF'
            },
            splitLine: {
                lineStyle: {
                    color: '#2D2D2D'
                }
            }
        },
        series: [
            {
                name: 'Push-ups',
                type: 'line',
                data: [25, 32, 38, 45, 52, 58, 65],
                lineStyle: {
                    color: '#8B6914'
                },
                itemStyle: {
                    color: '#8B6914'
                },
                areaStyle: {
                    color: {
                        type: 'linear',
                        x: 0,
                        y: 0,
                        x2: 0,
                        y2: 1,
                        colorStops: [{
                            offset: 0, color: 'rgba(139, 105, 20, 0.3)'
                        }, {
                            offset: 1, color: 'rgba(139, 105, 20, 0.1)'
                        }]
                    }
                }
            },
            {
                name: 'Pull-ups',
                type: 'line',
                data: [8, 10, 12, 15, 18, 20, 22],
                lineStyle: {
                    color: '#A0781A'
                },
                itemStyle: {
                    color: '#A0781A'
                }
            },
            {
                name: 'Plank Hold (seconds)',
                type: 'line',
                data: [45, 75, 120, 150, 180, 210, 240],
                lineStyle: {
                    color: '#B8860B'
                },
                itemStyle: {
                    color: '#B8860B'
                }
            }
        ]
    };
    
    chart.setOption(option);
    
    // Make chart responsive
    window.addEventListener('resize', () => {
        chart.resize();
    });
}

// Challenge Calendar Functions
function initializeChallengeCalendar() {
    document.querySelectorAll('.challenge-day').forEach(day => {
        day.addEventListener('click', function() {
            const dayNumber = this.querySelector('.font-bold').textContent;
            showDayDetails(dayNumber);
        });
    });
}

function showDayDetails(dayNumber) {
    // Sample workout data
    const workouts = {
        '1': { name: 'Foundation Day', exercises: ['20 push-ups', '10 squats', '30-second plank', '5 pull-ups'] },
        '15': { name: 'Strength Test', exercises: ['Max push-ups in 2 min', 'Max pull-ups', '3-minute plank', '50 burpees'] },
        '30': { name: 'Final Challenge', exercises: ['Max push-ups in 2 min', 'Max pull-ups to failure', '5-minute plank', '100 burpees for time'] }
    };
    
    const workout = workouts[dayNumber] || { name: `Day ${dayNumber} Workout`, exercises: ['Rest day or light activity'] };
    
    showNotification(`Day ${dayNumber}: ${workout.name}\n${workout.exercises.join('\n')}`, 'info');
}

// Challenge Buttons
function initializeChallengeButtons() {
    const startChallengeBtn = document.getElementById('startChallenge');
    const joinChallengeBtn = document.getElementById('joinChallenge');
    
    if (startChallengeBtn) {
        startChallengeBtn.addEventListener('click', function() {
            showNotification('Welcome to the Virtus 30-Day Challenge! Your journey starts now.', 'success');
            // Scroll to challenge section
            document.querySelector('#challengeSection')?.scrollIntoView({ behavior: 'smooth' });
        });
    }
    
    if (joinChallengeBtn) {
        joinChallengeBtn.addEventListener('click', function() {
            showNotification('Congratulations! You\'ve joined the Virtus 30-Day Challenge.', 'success');
        });
    }
}

// Utility Functions
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `fixed top-20 right-4 z-50 p-4 rounded-lg shadow-lg max-w-sm transform translate-x-full transition-transform duration-300`;
    
    // Set colors based on type
    switch(type) {
        case 'success':
            notification.classList.add('bg-green-600', 'text-white');
            break;
        case 'error':
            notification.classList.add('bg-red-600', 'text-white');
            break;
        case 'info':
        default:
            notification.classList.add('bg-yellow-600', 'text-white');
            break;
    }
    
    notification.innerHTML = `
        <div class="flex items-center justify-between">
            <p class="text-sm">${message}</p>
            <button onclick="this.parentElement.parentElement.remove()" class="ml-4 text-white hover:text-gray-200">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
            </button>
        </div>
    `;
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.classList.remove('translate-x-full');
    }, 100);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        notification.classList.add('translate-x-full');
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 5000);
}

function addToCart(productId) {
    showNotification('Product added to cart!', 'success');
    // Here you would typically add the product to cart state
    console.log('Added product to cart:', productId);
}

// Smooth scroll for navigation links
document.addEventListener('click', function(e) {
    if (e.target.matches('.nav-link[href^="#"]')) {
        e.preventDefault();
        const target = document.querySelector(e.target.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    }
});

// Handle window resize for responsive charts
window.addEventListener('resize', function() {
    // Reinitialize chart if it exists
    const chartElement = document.getElementById('progressChart');
    if (chartElement && echarts.getInstanceByDom(chartElement)) {
        echarts.getInstanceByDom(chartElement).resize();
    }
});

// Initialize everything when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeApp);
} else {
    initializeApp();
}