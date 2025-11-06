import"./modulepreload-polyfill-B5Qt9EMX.js";import"./shopify-0dN3W67C.js";function o(){const e=document.getElementById("cartItems"),n=document.getElementById("emptyCart"),a=document.getElementById("cartContent"),d=document.getElementById("subtotal"),c=document.getElementById("total"),s=window.shopifyIntegration.cart;if(s.items.length===0){n.classList.remove("hidden"),a.classList.add("hidden");return}n.classList.add("hidden"),a.classList.remove("hidden"),e.innerHTML=s.items.map(t=>`
                <div class="cart-item rounded-xl p-4 flex gap-4">
                    <img src="${t.image}" alt="${t.name}" class="w-24 h-24 object-cover rounded-lg">
                    <div class="flex-1">
                        <h3 class="font-bold text-lg mb-2">${t.name}</h3>
                        <p class="text-yellow-600 font-semibold mb-2">$${t.price.toFixed(2)}</p>
                        <div class="flex items-center space-x-4">
                            <div class="flex items-center space-x-2">
                                <button onclick="updateQuantity('${t.variantId}', ${t.quantity-1})" class="bg-gray-800 hover:bg-gray-700 px-3 py-1 rounded">-</button>
                                <span class="px-4">${t.quantity}</span>
                                <button onclick="updateQuantity('${t.variantId}', ${t.quantity+1})" class="bg-gray-800 hover:bg-gray-700 px-3 py-1 rounded">+</button>
                            </div>
                            <button onclick="removeItem('${t.variantId}')" class="text-red-500 hover:text-red-400 text-sm">Remove</button>
                        </div>
                    </div>
                    <div class="text-right">
                        <p class="font-bold text-lg">$${(t.price*t.quantity).toFixed(2)}</p>
                    </div>
                </div>
            `).join("");const i=window.shopifyIntegration.getCartTotal();d.textContent=`$${i.toFixed(2)}`,c.textContent=`$${i.toFixed(2)}`}window.updateQuantity=function(e,n){window.shopifyIntegration.updateQuantity(e,n),o()};window.removeItem=function(e){window.shopifyIntegration.removeFromCart(e),o()};document.getElementById("checkoutBtn").addEventListener("click",async function(){this.disabled=!0,this.textContent="Processing...";const e=await window.shopifyIntegration.proceedToCheckout();e?window.location.href=e:(alert("Unable to proceed to checkout. Please try again."),this.disabled=!1,this.textContent="Proceed to Checkout")});o();
