import './shopify.js';
import './supabase-client.js';

let filteredProducts = [];
let currentPage = 1;
const productsPerPage = 9;

document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

function initializeApp() {
    const currentPageName = getCurrentPage();

    initializeScrollAnimations();
    initializeNavigation();

    switch(currentPageName) {
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

function getCurrentPage() {
    const path = window.location.pathname;
    if (path.includes('shop.html')) return 'shop';
    if (path.includes('community.html')) return 'community';
    return 'index';
}

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

    document.querySelectorAll('.reveal').forEach(el => {
        observer.observe(el);
    });
}

function initializeNavigation() {
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

function initializeHomePage() {
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

    initializeProductHovers();
    initializeNewsletterForm();
    loadFeaturedProducts();
}

async function loadFeaturedProducts() {
    try {
        const products = await window.shopifyIntegration.getAllProducts(6);

        if (products && products.length > 0) {
            const productsSection = document.querySelector('#home .grid');
            if (productsSection) {
                productsSection.innerHTML = products.slice(0, 6).map((product, index) =>
                    createProductCardHTML(product, index)
                ).join('');
            }
        }
    } catch (error) {
        console.error('Error loading featured products:', error);
    }
}

function createProductCardHTML(product, index) {
    return `
        <div class="product-card rounded-xl p-6 reveal stagger-delay-${(index % 6) + 1}">
            <img src="${product.image}" alt="${product.name}" class="w-full h-64 object-cover rounded-lg mb-4">
            <h3 class="text-xl font-bold mb-2">${product.name}</h3>
            <p class="text-gray-400 mb-4">${product.description.substring(0, 80)}...</p>
            <div class="flex justify-between items-center">
                <span class="text-2xl font-bold text-yellow-600">$${product.price.toFixed(2)}</span>
                <button onclick="window.addToCart('${product.shopifyId}', '${product.variants[0]?.id}')" class="btn-primary px-4 py-2 rounded text-sm">Add to Cart</button>
            </div>
        </div>
    `;
}

async function initializeShopPage() {
    await loadAllProducts();
    renderProducts();
    initializeFilters();
    initializeSearch();
    initializeQuickView();
    initializeLoadMore();
}

async function loadAllProducts() {
    try {
        const products = await window.shopifyIntegration.getAllProducts(50);
        if (products && products.length > 0) {
            filteredProducts = products;
        }
    } catch (error) {
        console.error('Error loading products:', error);
    }
}

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

    const productCount = document.getElementById('productCount');
    if (productCount) {
        productCount.textContent = filteredProducts.length;
    }

    if (typeof anime !== 'undefined') {
        anime({
            targets: '.product-card',
            opacity: [0, 1],
            translateY: [30, 0],
            delay: anime.stagger(100),
            duration: 600,
            easing: 'easeOutQuad'
        });
    }
}

function createProductCard(product, index) {
    const card = document.createElement('div');
    card.className = 'product-card rounded-xl p-6 reveal';
    card.style.transitionDelay = `${index * 0.1}s`;

    const defaultVariant = product.variants && product.variants[0];

    card.innerHTML = `
        <div class="relative overflow-hidden rounded-lg mb-4">
            <img src="${product.image}" alt="${product.name}" class="w-full h-64 object-cover transition-transform duration-300 hover:scale-110">
            ${product.featured ? '<div class="absolute top-2 right-2 bg-yellow-600 text-white px-2 py-1 rounded text-xs font-semibold">FEATURED</div>' : ''}
        </div>
        <h3 class="text-xl font-bold mb-2">${product.name}</h3>
        <p class="text-gray-400 mb-4">${product.description.substring(0, 100)}...</p>
        <div class="flex justify-between items-center">
            <span class="text-2xl font-bold text-yellow-600">$${product.price.toFixed(2)}</span>
            <div class="flex space-x-2">
                <button onclick="window.quickView('${product.shopifyId}')" class="text-gray-400 hover:text-yellow-600 transition-colors">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                    </svg>
                </button>
                <button onclick="window.addToCart('${product.shopifyId}', '${defaultVariant?.id}')" class="btn-primary px-4 py-2 rounded text-sm">Add to Cart</button>
            </div>
        </div>
    `;

    return card;
}

function initializeFilters() {
    document.querySelectorAll('[data-filter]').forEach(btn => {
        btn.addEventListener('click', function() {
            document.querySelectorAll('[data-filter]').forEach(b => b.classList.remove('active'));
            this.classList.add('active');

            const filter = this.dataset.filter;
            if (filter === 'all') {
                loadAllProducts().then(() => {
                    currentPage = 1;
                    renderProducts();
                });
            } else {
                filteredProducts = filteredProducts.filter(product => product.category === filter);
                currentPage = 1;
                renderProducts();
            }
        });
    });

    document.querySelectorAll('[data-price]').forEach(btn => {
        btn.addEventListener('click', async function() {
            await loadAllProducts();

            const priceRange = this.dataset.price;

            filteredProducts = filteredProducts.filter(product => {
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

    const clearFilters = document.getElementById('clearFilters');
    if (clearFilters) {
        clearFilters.addEventListener('click', async function() {
            await loadAllProducts();
            currentPage = 1;

            document.querySelectorAll('.filter-btn').forEach(btn => {
                btn.classList.remove('active');
            });
            document.querySelector('[data-filter="all"]')?.classList.add('active');

            if (sortSelect) sortSelect.value = 'featured';

            renderProducts();
        });
    }
}

function initializeSearch() {
    const searchInput = document.getElementById('searchInput');
    if (!searchInput) return;

    let searchTimeout;

    searchInput.addEventListener('input', async function() {
        clearTimeout(searchTimeout);
        searchTimeout = setTimeout(async () => {
            const query = this.value.toLowerCase().trim();

            await loadAllProducts();

            if (query !== '') {
                filteredProducts = filteredProducts.filter(product =>
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

window.quickView = async function(productId) {
    const product = filteredProducts.find(p => p.shopifyId === productId);
    if (!product) return;

    const modal = document.getElementById('quickViewModal');
    const modalImage = document.getElementById('modalImage');
    const modalTitle = document.getElementById('modalTitle');
    const modalDescription = document.getElementById('modalDescription');
    const modalPrice = document.getElementById('modalPrice');

    if (modalImage) modalImage.src = product.image;
    if (modalTitle) modalTitle.textContent = product.name;
    if (modalDescription) modalDescription.textContent = product.description;
    if (modalPrice) modalPrice.textContent = `$${product.price.toFixed(2)}`;

    modal.classList.add('active');
};

function initializeLoadMore() {
    const loadMoreBtn = document.getElementById('loadMore');
    if (!loadMoreBtn) return;

    loadMoreBtn.addEventListener('click', function() {
        currentPage++;
        renderProducts();

        if (currentPage * productsPerPage >= filteredProducts.length) {
            this.style.display = 'none';
        }
    });
}

function initializeProductHovers() {
    document.querySelectorAll('.product-card').forEach(card => {
        if (typeof anime === 'undefined') return;

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

function initializeNewsletterForm() {
    const newsletterInputs = document.querySelectorAll('input[type="email"]');

    newsletterInputs.forEach(newsletterForm => {
        const joinBtn = newsletterForm.nextElementSibling;
        if (joinBtn && joinBtn.tagName === 'BUTTON') {
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
    });
}

function initializeCommunityPage() {
    initializeProgressChart();
}

function initializeProgressChart() {
    const chartElement = document.getElementById('progressChart');
    if (!chartElement || typeof echarts === 'undefined') return;

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

    window.addEventListener('resize', () => {
        chart.resize();
    });
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `fixed top-20 right-4 z-50 p-4 rounded-lg shadow-lg max-w-sm transform translate-x-full transition-transform duration-300`;

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

    setTimeout(() => {
        notification.classList.remove('translate-x-full');
    }, 100);

    setTimeout(() => {
        notification.classList.add('translate-x-full');
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 5000);
}

window.addToCart = function(productId, variantId) {
    const product = filteredProducts.find(p => p.shopifyId === productId);

    if (!product) {
        showNotification('Product not found', 'error');
        return;
    }

    const success = window.shopifyIntegration.addToCart(product, variantId, 1);

    if (success) {
        showNotification('Product added to cart!', 'success');
    } else {
        showNotification('Error adding product to cart', 'error');
    }
};

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

window.addEventListener('resize', function() {
    const chartElement = document.getElementById('progressChart');
    if (chartElement && typeof echarts !== 'undefined' && echarts.getInstanceByDom(chartElement)) {
        echarts.getInstanceByDom(chartElement).resize();
    }
});

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeApp);
} else {
    initializeApp();
}
