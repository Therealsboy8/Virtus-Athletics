class o{constructor(){this.domain=void 0,this.storefrontAccessToken=void 0,this.apiVersion="2024-01",this.cart=this.loadCart(),this.client=null,this.initializeClient()}initializeClient(){if(!this.domain||!this.storefrontAccessToken){console.warn("Shopify credentials not found. Using demo mode.");return}this.client={domain:this.domain,token:this.storefrontAccessToken}}async graphqlRequest(t,i={}){if(!this.client)return console.warn("Shopify client not initialized"),null;const e=`https://${this.domain}/api/${this.apiVersion}/graphql.json`;try{const n=await(await fetch(e,{method:"POST",headers:{"Content-Type":"application/json","X-Shopify-Storefront-Access-Token":this.storefrontAccessToken},body:JSON.stringify({query:t,variables:i})})).json();return n.errors?(console.error("GraphQL errors:",n.errors),null):n.data}catch(r){return console.error("Shopify API error:",r),null}}async getAllProducts(t=50){const e=await this.graphqlRequest(`
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
        `,{limit:t});return!e||!e.products?[]:e.products.edges.map(r=>this.formatProduct(r.node))}async getProductsByCollection(t,i=50){const r=await this.graphqlRequest(`
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
        `,{handle:t,limit:i});return!r||!r.collectionByHandle?[]:r.collectionByHandle.products.edges.map(n=>this.formatProduct(n.node))}formatProduct(t){const i=t.images.edges.map(n=>n.node.url),e=t.variants.edges.map(n=>n.node),r=parseFloat(t.priceRange.minVariantPrice.amount);return{id:t.id,shopifyId:t.id,name:t.title,description:t.description,handle:t.handle,price:r,category:this.mapProductType(t.productType,t.tags),image:i[0]||"https://via.placeholder.com/400x400?text=No+Image",images:i,variants:e,tags:t.tags,productType:t.productType,featured:t.tags.includes("featured")}}mapProductType(t,i){const e=t.toLowerCase();return e.includes("apparel")||e.includes("clothing")||e.includes("shirt")||e.includes("short")?"apparel":e.includes("equipment")||e.includes("training")||e.includes("band")||e.includes("ring")?"equipment":"accessories"}async createCheckout(){const t=`
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
        `,i=this.cart.items.map(r=>({variantId:r.variantId,quantity:r.quantity})),e=await this.graphqlRequest(t,{input:{lineItems:i}});return e&&e.checkoutCreate?e.checkoutCreate.checkout:null}async addToCheckout(t,i){const r=await this.graphqlRequest(`
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
        `,{checkoutId:t,lineItems:i});return r?r.checkoutLineItemsAdd.checkout:null}loadCart(){const t=localStorage.getItem("virtus_cart");return t?JSON.parse(t):{items:[],checkoutId:null}}saveCart(){localStorage.setItem("virtus_cart",JSON.stringify(this.cart)),this.updateCartUI()}addToCart(t,i=null,e=1){var a;const r=i||t.variants&&((a=t.variants[0])==null?void 0:a.id);if(!r)return console.error("No variant available for product"),!1;const n=this.cart.items.findIndex(s=>s.variantId===r);return n>-1?this.cart.items[n].quantity+=e:this.cart.items.push({productId:t.shopifyId||t.id,variantId:r,name:t.name,price:t.price,image:t.image,quantity:e}),this.saveCart(),!0}removeFromCart(t){this.cart.items=this.cart.items.filter(i=>i.variantId!==t),this.saveCart()}updateQuantity(t,i){const e=this.cart.items.find(r=>r.variantId===t);e&&(i<=0?this.removeFromCart(t):(e.quantity=i,this.saveCart()))}getCartTotal(){return this.cart.items.reduce((t,i)=>t+i.price*i.quantity,0)}getCartCount(){return this.cart.items.reduce((t,i)=>t+i.quantity,0)}clearCart(){this.cart={items:[],checkoutId:null},this.saveCart()}updateCartUI(){const t=document.querySelectorAll(".cart-count"),i=this.getCartCount();t.forEach(e=>{e.textContent=i,e.style.display=i>0?"flex":"none"})}async proceedToCheckout(){if(this.cart.items.length===0)return null;const t=await this.createCheckout();return t&&t.webUrl?(this.cart.checkoutId=t.id,this.saveCart(),t.webUrl):null}}window.shopifyIntegration=new o;
