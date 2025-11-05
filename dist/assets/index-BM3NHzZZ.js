import{createClient as m}from"https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm";(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const r of document.querySelectorAll('link[rel="modulepreload"]'))i(r);new MutationObserver(r=>{for(const a of r)if(a.type==="childList")for(const o of a.addedNodes)o.tagName==="LINK"&&o.rel==="modulepreload"&&i(o)}).observe(document,{childList:!0,subtree:!0});function t(r){const a={};return r.integrity&&(a.integrity=r.integrity),r.referrerPolicy&&(a.referrerPolicy=r.referrerPolicy),r.crossOrigin==="use-credentials"?a.credentials="include":r.crossOrigin==="anonymous"?a.credentials="omit":a.credentials="same-origin",a}function i(r){if(r.ep)return;r.ep=!0;const a=t(r);fetch(r.href,a)}})();class y{constructor(){this.domain=void 0,this.storefrontAccessToken=void 0,this.apiVersion="2024-01",this.cart=this.loadCart(),this.client=null,this.initializeClient()}initializeClient(){if(!this.domain||!this.storefrontAccessToken){console.warn("Shopify credentials not found. Using demo mode.");return}this.client={domain:this.domain,token:this.storefrontAccessToken}}async graphqlRequest(e,t={}){if(!this.client)return console.warn("Shopify client not initialized"),null;const i=`https://${this.domain}/api/${this.apiVersion}/graphql.json`;try{const a=await(await fetch(i,{method:"POST",headers:{"Content-Type":"application/json","X-Shopify-Storefront-Access-Token":this.storefrontAccessToken},body:JSON.stringify({query:e,variables:t})})).json();return a.errors?(console.error("GraphQL errors:",a.errors),null):a.data}catch(r){return console.error("Shopify API error:",r),null}}async getAllProducts(e=50){const i=await this.graphqlRequest(`
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
        `,{limit:e});return!i||!i.products?[]:i.products.edges.map(r=>this.formatProduct(r.node))}async getProductsByCollection(e,t=50){const r=await this.graphqlRequest(`
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
        `,{handle:e,limit:t});return!r||!r.collectionByHandle?[]:r.collectionByHandle.products.edges.map(a=>this.formatProduct(a.node))}formatProduct(e){const t=e.images.edges.map(a=>a.node.url),i=e.variants.edges.map(a=>a.node),r=parseFloat(e.priceRange.minVariantPrice.amount);return{id:e.id,shopifyId:e.id,name:e.title,description:e.description,handle:e.handle,price:r,category:this.mapProductType(e.productType,e.tags),image:t[0]||"https://via.placeholder.com/400x400?text=No+Image",images:t,variants:i,tags:e.tags,productType:e.productType,featured:e.tags.includes("featured")}}mapProductType(e,t){const i=e.toLowerCase();return i.includes("apparel")||i.includes("clothing")||i.includes("shirt")||i.includes("short")?"apparel":i.includes("equipment")||i.includes("training")||i.includes("band")||i.includes("ring")?"equipment":"accessories"}async createCheckout(){const e=`
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
        `,t=this.cart.items.map(r=>({variantId:r.variantId,quantity:r.quantity})),i=await this.graphqlRequest(e,{input:{lineItems:t}});return i&&i.checkoutCreate?i.checkoutCreate.checkout:null}async addToCheckout(e,t){const r=await this.graphqlRequest(`
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
        `,{checkoutId:e,lineItems:t});return r?r.checkoutLineItemsAdd.checkout:null}loadCart(){const e=localStorage.getItem("virtus_cart");return e?JSON.parse(e):{items:[],checkoutId:null}}saveCart(){localStorage.setItem("virtus_cart",JSON.stringify(this.cart)),this.updateCartUI()}addToCart(e,t=null,i=1){var o;const r=t||e.variants&&((o=e.variants[0])==null?void 0:o.id);if(!r)return console.error("No variant available for product"),!1;const a=this.cart.items.findIndex(u=>u.variantId===r);return a>-1?this.cart.items[a].quantity+=i:this.cart.items.push({productId:e.shopifyId||e.id,variantId:r,name:e.name,price:e.price,image:e.image,quantity:i}),this.saveCart(),!0}removeFromCart(e){this.cart.items=this.cart.items.filter(t=>t.variantId!==e),this.saveCart()}updateQuantity(e,t){const i=this.cart.items.find(r=>r.variantId===e);i&&(t<=0?this.removeFromCart(e):(i.quantity=t,this.saveCart()))}getCartTotal(){return this.cart.items.reduce((e,t)=>e+t.price*t.quantity,0)}getCartCount(){return this.cart.items.reduce((e,t)=>e+t.quantity,0)}clearCart(){this.cart={items:[],checkoutId:null},this.saveCart()}updateCartUI(){const e=document.querySelectorAll(".cart-count"),t=this.getCartCount();e.forEach(i=>{i.textContent=t,i.style.display=t>0?"flex":"none"})}async proceedToCheckout(){if(this.cart.items.length===0)return null;const e=await this.createCheckout();return e&&e.webUrl?(this.cart.checkoutId=e.id,this.saveCart(),e.webUrl):null}}window.shopifyIntegration=new y;class g{constructor(){this.supabase=null,this.currentUser=null,this.participant=null,this.initialize()}initialize(){const e="https://dfyolvdpzomufcvqxufd.supabase.co",t="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRmeW9sdmRwem9tdWZjdnF4dWZkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjIzNTk1ODYsImV4cCI6MjA3NzkzNTU4Nn0._swW6Z0-Wqi9VlcCvfSFAu6E-SvSyLkxSAHeaDXELxI";this.supabase=m(e,t),this.setupAuthListener(),this.checkUser()}setupAuthListener(){this.supabase&&this.supabase.auth.onAuthStateChange((e,t)=>{e==="SIGNED_IN"?(this.currentUser=(t==null?void 0:t.user)||null,this.loadParticipantData()):e==="SIGNED_OUT"&&(this.currentUser=null,this.participant=null,this.updateAuthUI())})}async checkUser(){if(!this.supabase)return;const{data:{session:e}}=await this.supabase.auth.getSession();e&&(this.currentUser=e.user,await this.loadParticipantData()),this.updateAuthUI()}async signUp(e,t){if(!this.supabase)return{error:"Supabase not initialized"};const{data:i,error:r}=await this.supabase.auth.signUp({email:e,password:t});return!r&&i.user&&(this.currentUser=i.user),{data:i,error:r}}async signIn(e,t){if(!this.supabase)return{error:"Supabase not initialized"};const{data:i,error:r}=await this.supabase.auth.signInWithPassword({email:e,password:t});return!r&&i.user&&(this.currentUser=i.user,await this.loadParticipantData()),{data:i,error:r}}async signOut(){this.supabase&&(await this.supabase.auth.signOut(),this.currentUser=null,this.participant=null,this.updateAuthUI())}async loadParticipantData(){if(!this.supabase||!this.currentUser)return;const{data:e,error:t}=await this.supabase.from("challenge_participants").select("*").eq("user_id",this.currentUser.id).maybeSingle();e&&(this.participant=e),this.updateAuthUI()}async joinChallenge(){if(!this.supabase||!this.currentUser)return{error:"Must be logged in to join challenge"};if(this.participant)return{error:"Already joined challenge"};const{data:e,error:t}=await this.supabase.from("challenge_participants").insert([{user_id:this.currentUser.id,email:this.currentUser.email,started_at:new Date().toISOString(),current_day:1,completed:!1}]).select().single();return t||(this.participant=e,await this.initializeProgress()),{data:e,error:t}}async initializeProgress(){if(!this.supabase||!this.participant)return;const e=Array.from({length:30},(t,i)=>({participant_id:this.participant.id,day_number:i+1,completed:!1}));await this.supabase.from("challenge_progress").insert(e)}async getProgress(){if(!this.supabase||!this.participant)return[];const{data:e,error:t}=await this.supabase.from("challenge_progress").select("*").eq("participant_id",this.participant.id).order("day_number");return e||[]}async completeDay(e,t=""){if(!this.supabase||!this.participant)return{error:"Not authorized"};const{data:i,error:r}=await this.supabase.from("challenge_progress").update({completed:!0,completed_at:new Date().toISOString(),notes:t}).eq("participant_id",this.participant.id).eq("day_number",e).select().single();return r||await this.updateCurrentDay(),{data:i,error:r}}async updateCurrentDay(){if(!this.supabase||!this.participant)return;const t=(await this.getProgress()).filter(r=>r.completed).length,i=Math.min(t+1,30);await this.supabase.from("challenge_participants").update({current_day:i,completed:t===30}).eq("id",this.participant.id),this.participant.current_day=i,this.participant.completed=t===30}async getWorkouts(){if(!this.supabase)return[];const{data:e,error:t}=await this.supabase.from("challenge_workouts").select("*").order("day_number");return e||[]}async getWorkout(e){if(!this.supabase)return null;const{data:t,error:i}=await this.supabase.from("challenge_workouts").select("*").eq("day_number",e).maybeSingle();return t}updateAuthUI(){const e=document.querySelectorAll(".auth-required"),t=document.querySelectorAll(".guest-only"),i=document.querySelectorAll(".user-info");this.currentUser?(e.forEach(r=>r.style.display="block"),t.forEach(r=>r.style.display="none"),i.forEach(r=>{r.textContent=this.currentUser.email,r.style.display="block"})):(e.forEach(r=>r.style.display="none"),t.forEach(r=>r.style.display="block"),i.forEach(r=>r.style.display="none"))}isAuthenticated(){return!!this.currentUser}hasJoinedChallenge(){return!!this.participant}}window.supabaseService=new g;let s=[],c=1;const p=9;document.addEventListener("DOMContentLoaded",function(){f()});function f(){const n=v();switch(b(),w(),n){case"index":I();break;case"shop":k();break;case"community":D();break}}function v(){const n=window.location.pathname;return n.includes("shop.html")?"shop":n.includes("community.html")?"community":"index"}function b(){const n={threshold:.1,rootMargin:"0px 0px -50px 0px"},e=new IntersectionObserver(t=>{t.forEach(i=>{i.isIntersecting&&i.target.classList.add("active")})},n);document.querySelectorAll(".reveal").forEach(t=>{e.observe(t)})}function w(){document.querySelectorAll('a[href^="#"]').forEach(n=>{n.addEventListener("click",function(e){e.preventDefault();const t=document.querySelector(this.getAttribute("href"));t&&t.scrollIntoView({behavior:"smooth",block:"start"})})})}function I(){document.getElementById("typed-tagline")&&new Typed("#typed-tagline",{strings:["Earn Your Virtus.","Elite Is Earned.","Discipline Over Everything."],typeSpeed:80,backSpeed:50,backDelay:2e3,loop:!0,showCursor:!0,cursorChar:"|"}),q(),T(),C()}async function C(){try{const n=await window.shopifyIntegration.getAllProducts(6);if(n&&n.length>0){const e=document.querySelector("#home .grid");e&&(e.innerHTML=n.slice(0,6).map((t,i)=>x(t,i)).join(""))}}catch(n){console.error("Error loading featured products:",n)}}function x(n,e){var t;return`
        <div class="product-card rounded-xl p-6 reveal stagger-delay-${e%6+1}">
            <img src="${n.image}" alt="${n.name}" class="w-full h-64 object-cover rounded-lg mb-4">
            <h3 class="text-xl font-bold mb-2">${n.name}</h3>
            <p class="text-gray-400 mb-4">${n.description.substring(0,80)}...</p>
            <div class="flex justify-between items-center">
                <span class="text-2xl font-bold text-yellow-600">$${n.price.toFixed(2)}</span>
                <button onclick="window.addToCart('${n.shopifyId}', '${(t=n.variants[0])==null?void 0:t.id}')" class="btn-primary px-4 py-2 rounded text-sm">Add to Cart</button>
            </div>
        </div>
    `}async function k(){await d(),l(),E(),L(),A(),P()}async function d(){try{const n=await window.shopifyIntegration.getAllProducts(50);n&&n.length>0&&(s=n)}catch(n){console.error("Error loading products:",n)}}function l(){const n=document.getElementById("productsGrid");if(!n)return;const e=(c-1)*p,t=e+p,i=s.slice(e,t);c===1&&(n.innerHTML=""),i.forEach((a,o)=>{const u=S(a,o);n.appendChild(u)});const r=document.getElementById("productCount");r&&(r.textContent=s.length),typeof anime<"u"&&anime({targets:".product-card",opacity:[0,1],translateY:[30,0],delay:anime.stagger(100),duration:600,easing:"easeOutQuad"})}function S(n,e){const t=document.createElement("div");t.className="product-card rounded-xl p-6 reveal",t.style.transitionDelay=`${e*.1}s`;const i=n.variants&&n.variants[0];return t.innerHTML=`
        <div class="relative overflow-hidden rounded-lg mb-4">
            <img src="${n.image}" alt="${n.name}" class="w-full h-64 object-cover transition-transform duration-300 hover:scale-110">
            ${n.featured?'<div class="absolute top-2 right-2 bg-yellow-600 text-white px-2 py-1 rounded text-xs font-semibold">FEATURED</div>':""}
        </div>
        <h3 class="text-xl font-bold mb-2">${n.name}</h3>
        <p class="text-gray-400 mb-4">${n.description.substring(0,100)}...</p>
        <div class="flex justify-between items-center">
            <span class="text-2xl font-bold text-yellow-600">$${n.price.toFixed(2)}</span>
            <div class="flex space-x-2">
                <button onclick="window.quickView('${n.shopifyId}')" class="text-gray-400 hover:text-yellow-600 transition-colors">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                    </svg>
                </button>
                <button onclick="window.addToCart('${n.shopifyId}', '${i==null?void 0:i.id}')" class="btn-primary px-4 py-2 rounded text-sm">Add to Cart</button>
            </div>
        </div>
    `,t}function E(){document.querySelectorAll("[data-filter]").forEach(t=>{t.addEventListener("click",function(){document.querySelectorAll("[data-filter]").forEach(r=>r.classList.remove("active")),this.classList.add("active");const i=this.dataset.filter;i==="all"?d().then(()=>{c=1,l()}):(s=s.filter(r=>r.category===i),c=1,l())})}),document.querySelectorAll("[data-price]").forEach(t=>{t.addEventListener("click",async function(){await d();const i=this.dataset.price;s=s.filter(r=>i==="0-50"?r.price<50:i==="50-100"?r.price>=50&&r.price<=100:i==="100-200"?r.price>=100&&r.price<=200:i==="200+"?r.price>=200:!0),c=1,l()})});const n=document.getElementById("sortSelect");n&&n.addEventListener("change",function(){const t=this.value;s.sort((i,r)=>{switch(t){case"price-low":return i.price-r.price;case"price-high":return r.price-i.price;case"newest":return r.id-i.id;default:return r.featured-i.featured}}),c=1,l()});const e=document.getElementById("clearFilters");e&&e.addEventListener("click",async function(){var t;await d(),c=1,document.querySelectorAll(".filter-btn").forEach(i=>{i.classList.remove("active")}),(t=document.querySelector('[data-filter="all"]'))==null||t.classList.add("active"),n&&(n.value="featured"),l()})}function L(){const n=document.getElementById("searchInput");if(!n)return;let e;n.addEventListener("input",async function(){clearTimeout(e),e=setTimeout(async()=>{const t=this.value.toLowerCase().trim();await d(),t!==""&&(s=s.filter(i=>i.name.toLowerCase().includes(t)||i.description.toLowerCase().includes(t)||i.category.toLowerCase().includes(t))),c=1,l()},300)})}function A(){const n=document.getElementById("quickViewModal"),e=document.getElementById("closeModal");e&&e.addEventListener("click",()=>{n.classList.remove("active")}),n&&n.addEventListener("click",t=>{t.target===n&&n.classList.remove("active")})}window.quickView=async function(n){const e=s.find(u=>u.shopifyId===n);if(!e)return;const t=document.getElementById("quickViewModal"),i=document.getElementById("modalImage"),r=document.getElementById("modalTitle"),a=document.getElementById("modalDescription"),o=document.getElementById("modalPrice");i&&(i.src=e.image),r&&(r.textContent=e.name),a&&(a.textContent=e.description),o&&(o.textContent=`$${e.price.toFixed(2)}`),t.classList.add("active")};function P(){const n=document.getElementById("loadMore");n&&n.addEventListener("click",function(){c++,l(),c*p>=s.length&&(this.style.display="none")})}function q(){document.querySelectorAll(".product-card").forEach(n=>{typeof anime>"u"||(n.addEventListener("mouseenter",function(){anime({targets:this,rotateX:5,rotateY:5,scale:1.02,duration:300,easing:"easeOutQuad"})}),n.addEventListener("mouseleave",function(){anime({targets:this,rotateX:0,rotateY:0,scale:1,duration:300,easing:"easeOutQuad"})}))})}function T(){document.querySelectorAll('input[type="email"]').forEach(e=>{const t=e.nextElementSibling;t&&t.tagName==="BUTTON"&&t.addEventListener("click",function(i){i.preventDefault();const r=e.value.trim();r&&U(r)?(h("Welcome to Virtus! Check your email for your 10% discount code.","success"),e.value=""):h("Please enter a valid email address.","error")})})}function D(){B()}function B(){const n=document.getElementById("progressChart");if(!n||typeof echarts>"u")return;const e=echarts.init(n),t={backgroundColor:"transparent",title:{text:"Strength Progress Over Time",textStyle:{color:"#ffffff",fontSize:18}},tooltip:{trigger:"axis",backgroundColor:"#1A1A1A",borderColor:"#8B6914",textStyle:{color:"#ffffff"}},legend:{data:["Push-ups","Pull-ups","Plank Hold (seconds)"],textStyle:{color:"#ffffff"}},grid:{left:"3%",right:"4%",bottom:"3%",containLabel:!0},xAxis:{type:"category",boundaryGap:!1,data:["Day 1","Day 5","Day 10","Day 15","Day 20","Day 25","Day 30"],axisLine:{lineStyle:{color:"#2D2D2D"}},axisLabel:{color:"#9CA3AF"}},yAxis:{type:"value",axisLine:{lineStyle:{color:"#2D2D2D"}},axisLabel:{color:"#9CA3AF"},splitLine:{lineStyle:{color:"#2D2D2D"}}},series:[{name:"Push-ups",type:"line",data:[25,32,38,45,52,58,65],lineStyle:{color:"#8B6914"},itemStyle:{color:"#8B6914"},areaStyle:{color:{type:"linear",x:0,y:0,x2:0,y2:1,colorStops:[{offset:0,color:"rgba(139, 105, 20, 0.3)"},{offset:1,color:"rgba(139, 105, 20, 0.1)"}]}}},{name:"Pull-ups",type:"line",data:[8,10,12,15,18,20,22],lineStyle:{color:"#A0781A"},itemStyle:{color:"#A0781A"}},{name:"Plank Hold (seconds)",type:"line",data:[45,75,120,150,180,210,240],lineStyle:{color:"#B8860B"},itemStyle:{color:"#B8860B"}}]};e.setOption(t),window.addEventListener("resize",()=>{e.resize()})}function U(n){return/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(n)}function h(n,e="info"){const t=document.createElement("div");switch(t.className="fixed top-20 right-4 z-50 p-4 rounded-lg shadow-lg max-w-sm transform translate-x-full transition-transform duration-300",e){case"success":t.classList.add("bg-green-600","text-white");break;case"error":t.classList.add("bg-red-600","text-white");break;case"info":default:t.classList.add("bg-yellow-600","text-white");break}t.innerHTML=`
        <div class="flex items-center justify-between">
            <p class="text-sm">${n}</p>
            <button onclick="this.parentElement.parentElement.remove()" class="ml-4 text-white hover:text-gray-200">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
            </button>
        </div>
    `,document.body.appendChild(t),setTimeout(()=>{t.classList.remove("translate-x-full")},100),setTimeout(()=>{t.classList.add("translate-x-full"),setTimeout(()=>{t.remove()},300)},5e3)}window.addToCart=function(n,e){const t=s.find(r=>r.shopifyId===n);if(!t){h("Product not found","error");return}window.shopifyIntegration.addToCart(t,e,1)?h("Product added to cart!","success"):h("Error adding product to cart","error")};document.addEventListener("click",function(n){if(n.target.matches('.nav-link[href^="#"]')){n.preventDefault();const e=document.querySelector(n.target.getAttribute("href"));e&&e.scrollIntoView({behavior:"smooth",block:"start"})}});window.addEventListener("resize",function(){const n=document.getElementById("progressChart");n&&typeof echarts<"u"&&echarts.getInstanceByDom(n)&&echarts.getInstanceByDom(n).resize()});document.readyState==="loading"?document.addEventListener("DOMContentLoaded",f):f();
