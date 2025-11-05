// Shopify Storefront Integration
class ShopifyIntegration {
    constructor() {
        this.domain = import.meta.env.VITE_SHOPIFY_DOMAIN;
        this.storefrontAccessToken = import.meta.env.VITE_SHOPIFY_STOREFRONT_ACCESS_TOKEN;
        this.apiVersion = '2024-01';
        this.cart = this.loadCart();
        this.client = null;
        this.initializeClient();
    }

    initializeClient() {
        if (!this.domain || !this.storefrontAccessToken) {
            console.warn('Shopify credentials not found. Using demo mode.');
            return;
        }

        this.client = {
            domain: this.domain,
            token: this.storefrontAccessToken
        };
    }

    async graphqlRequest(query, variables = {}) {
        if (!this.client) {
            console.warn('Shopify client not initialized');
            return null;
        }

        const url = `https://${this.domain}/api/${this.apiVersion}/graphql.json`;

        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Shopify-Storefront-Access-Token': this.storefrontAccessToken
                },
                body: JSON.stringify({ query, variables })
            });

            const result = await response.json();

            if (result.errors) {
                console.error('GraphQL errors:', result.errors);
                return null;
            }

            return result.data;
        } catch (error) {
            console.error('Shopify API error:', error);
            return null;
        }
    }

    async getAllProducts(limit = 50) {
        const query = `
            query GetProducts($limit: Int!) {
                products(first: $limit) {
                    edges {
                        node {
                            id
                            title
                            description
                            handle
                            productType
                            tags
                            priceRange {
                                minVariantPrice {
                                    amount
                                    currencyCode
                                }
                            }
                            images(first: 5) {
                                edges {
                                    node {
                                        url
                                        altText
                                    }
                                }
                            }
                            variants(first: 10) {
                                edges {
                                    node {
                                        id
                                        title
                                        priceV2 {
                                            amount
                                            currencyCode
                                        }
                                        availableForSale
                                        selectedOptions {
                                            name
                                            value
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        `;

        const data = await this.graphqlRequest(query, { limit });

        if (!data || !data.products) {
            return [];
        }

        return data.products.edges.map(edge => this.formatProduct(edge.node));
    }

    async getProductsByCollection(collectionHandle, limit = 50) {
        const query = `
            query GetCollectionProducts($handle: String!, $limit: Int!) {
                collectionByHandle(handle: $handle) {
                    products(first: $limit) {
                        edges {
                            node {
                                id
                                title
                                description
                                handle
                                productType
                                tags
                                priceRange {
                                    minVariantPrice {
                                        amount
                                        currencyCode
                                    }
                                }
                                images(first: 5) {
                                    edges {
                                        node {
                                            url
                                            altText
                                        }
                                    }
                                }
                                variants(first: 10) {
                                    edges {
                                        node {
                                            id
                                            title
                                            priceV2 {
                                                amount
                                                currencyCode
                                            }
                                            availableForSale
                                            selectedOptions {
                                                name
                                                value
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        `;

        const data = await this.graphqlRequest(query, { handle: collectionHandle, limit });

        if (!data || !data.collectionByHandle) {
            return [];
        }

        return data.collectionByHandle.products.edges.map(edge => this.formatProduct(edge.node));
    }

    formatProduct(product) {
        const images = product.images.edges.map(edge => edge.node.url);
        const variants = product.variants.edges.map(edge => edge.node);
        const minPrice = parseFloat(product.priceRange.minVariantPrice.amount);

        return {
            id: product.id,
            shopifyId: product.id,
            name: product.title,
            description: product.description,
            handle: product.handle,
            price: minPrice,
            category: this.mapProductType(product.productType, product.tags),
            image: images[0] || 'https://via.placeholder.com/400x400?text=No+Image',
            images: images,
            variants: variants,
            tags: product.tags,
            productType: product.productType,
            featured: product.tags.includes('featured')
        };
    }

    mapProductType(productType, tags) {
        const type = productType.toLowerCase();
        if (type.includes('apparel') || type.includes('clothing') || type.includes('shirt') || type.includes('short')) {
            return 'apparel';
        }
        if (type.includes('equipment') || type.includes('training') || type.includes('band') || type.includes('ring')) {
            return 'equipment';
        }
        return 'accessories';
    }

    async createCheckout() {
        const query = `
            mutation checkoutCreate($input: CheckoutCreateInput!) {
                checkoutCreate(input: $input) {
                    checkout {
                        id
                        webUrl
                        lineItems(first: 50) {
                            edges {
                                node {
                                    id
                                    title
                                    quantity
                                    variant {
                                        id
                                        title
                                        priceV2 {
                                            amount
                                            currencyCode
                                        }
                                        image {
                                            url
                                        }
                                    }
                                }
                            }
                        }
                        subtotalPriceV2 {
                            amount
                            currencyCode
                        }
                        totalTaxV2 {
                            amount
                            currencyCode
                        }
                        totalPriceV2 {
                            amount
                            currencyCode
                        }
                    }
                    checkoutUserErrors {
                        field
                        message
                    }
                }
            }
        `;

        const lineItems = this.cart.items.map(item => ({
            variantId: item.variantId,
            quantity: item.quantity
        }));

        const data = await this.graphqlRequest(query, {
            input: { lineItems }
        });

        if (data && data.checkoutCreate) {
            return data.checkoutCreate.checkout;
        }

        return null;
    }

    async addToCheckout(checkoutId, lineItems) {
        const query = `
            mutation checkoutLineItemsAdd($checkoutId: ID!, $lineItems: [CheckoutLineItemInput!]!) {
                checkoutLineItemsAdd(checkoutId: $checkoutId, lineItems: $lineItems) {
                    checkout {
                        id
                        webUrl
                        lineItems(first: 50) {
                            edges {
                                node {
                                    id
                                    title
                                    quantity
                                }
                            }
                        }
                    }
                    checkoutUserErrors {
                        field
                        message
                    }
                }
            }
        `;

        const data = await this.graphqlRequest(query, { checkoutId, lineItems });
        return data ? data.checkoutLineItemsAdd.checkout : null;
    }

    loadCart() {
        const savedCart = localStorage.getItem('virtus_cart');
        if (savedCart) {
            return JSON.parse(savedCart);
        }
        return { items: [], checkoutId: null };
    }

    saveCart() {
        localStorage.setItem('virtus_cart', JSON.stringify(this.cart));
        this.updateCartUI();
    }

    addToCart(product, variantId = null, quantity = 1) {
        const variant = variantId || (product.variants && product.variants[0]?.id);

        if (!variant) {
            console.error('No variant available for product');
            return false;
        }

        const existingItemIndex = this.cart.items.findIndex(item => item.variantId === variant);

        if (existingItemIndex > -1) {
            this.cart.items[existingItemIndex].quantity += quantity;
        } else {
            this.cart.items.push({
                productId: product.shopifyId || product.id,
                variantId: variant,
                name: product.name,
                price: product.price,
                image: product.image,
                quantity: quantity
            });
        }

        this.saveCart();
        return true;
    }

    removeFromCart(variantId) {
        this.cart.items = this.cart.items.filter(item => item.variantId !== variantId);
        this.saveCart();
    }

    updateQuantity(variantId, quantity) {
        const item = this.cart.items.find(item => item.variantId === variantId);
        if (item) {
            if (quantity <= 0) {
                this.removeFromCart(variantId);
            } else {
                item.quantity = quantity;
                this.saveCart();
            }
        }
    }

    getCartTotal() {
        return this.cart.items.reduce((total, item) => {
            return total + (item.price * item.quantity);
        }, 0);
    }

    getCartCount() {
        return this.cart.items.reduce((count, item) => count + item.quantity, 0);
    }

    clearCart() {
        this.cart = { items: [], checkoutId: null };
        this.saveCart();
    }

    updateCartUI() {
        const cartCountElements = document.querySelectorAll('.cart-count');
        const count = this.getCartCount();

        cartCountElements.forEach(el => {
            el.textContent = count;
            el.style.display = count > 0 ? 'flex' : 'none';
        });
    }

    async proceedToCheckout() {
        if (this.cart.items.length === 0) {
            return null;
        }

        const checkout = await this.createCheckout();

        if (checkout && checkout.webUrl) {
            this.cart.checkoutId = checkout.id;
            this.saveCart();
            return checkout.webUrl;
        }

        return null;
    }
}

window.shopifyIntegration = new ShopifyIntegration();
