document.addEventListener('DOMContentLoaded', () => {

    const productData = [
        { id: 'deal001', category: 'deals', name: 'Night For 2', description: 'Deal includes: 2x 105oz Popcorn (choose flavor) + 1x 42oz Drink (choose type).', basePrice: 2.99, image: 'images/deal_night.jpg', hasSizeSelection: false, hasQuantitySelection: false, hasPopcornChoice: true, hasDrinkChoice: true, popcornCount: 2, popcornSize: '105oz', drinkCount: 1, drinkSize: '42oz' },
        { id: 'deal002', category: 'deals', name: 'Solo Watcher', description: 'Deal includes: 1x 105oz Popcorn (choose flavor) + 1x 30oz Drink (choose type).', basePrice: 1.99, image: 'images/deal_solo.jpg', hasSizeSelection: false, hasQuantitySelection: false, hasPopcornChoice: true, hasDrinkChoice: true, popcornCount: 1, popcornSize: '105oz', drinkCount: 1, drinkSize: '30oz' },
        { id: 'deal003', category: 'deals', name: 'Seasoned Popcorn Maker', description: 'Deal includes: 1x Popcorn Kernel Kit + 1x Seasoning Sampler.', basePrice: 1.49, image: 'images/deal_diy.jpg', hasSizeSelection: false, hasQuantitySelection: true, hasPopcornChoice: false, hasDrinkChoice: false },
        { id: 'pop001', category: 'popcorn', name: 'Buttery Classic', description: 'Warm, buttery, and irresistible.', basePrice: 0.99, image: 'images/product_popcorn1.jpg', hasSizeSelection: true, hasQuantitySelection: true },
        { id: 'pop002', category: 'popcorn', name: 'Caramel Bliss', description: 'Sweet, crunchy caramel coating.', basePrice: 0.99, image: 'images/product_popcorn2.jpg', hasSizeSelection: true, hasQuantitySelection: true },
        { id: 'pop003', category: 'popcorn', name: 'Spicy Chili', description: 'Popcorn with a kick!', basePrice: 0.99, image: 'images/product_popcorn3.jpg', hasSizeSelection: true, hasQuantitySelection: true },
        { id: 'pop004', category: 'popcorn', name: 'Cheesy Cheddar', description: 'Savory cheddar cheese flavor.', basePrice: 0.99, image: 'images/product_popcorn4.jpg', hasSizeSelection: true, hasQuantitySelection: true },
        { id: 'drk001', category: 'drinks', name: 'Coca-Cola', description: 'The standard bubbly refreshment.', basePrice: 0.75, image: 'images/product_drink1.jpg', hasSizeSelection: true, hasQuantitySelection: true },
        { id: 'drk002', category: 'drinks', name: 'Lipton Iced Tea', description: 'Refreshing classic iced tea.', basePrice: 0.75, image: 'images/product_drink2.jpg', hasSizeSelection: true, hasQuantitySelection: true },
        { id: 'drk003', category: 'drinks', name: 'Tropicana Twister', description: 'Freshly squeezed Vitamin C.', basePrice: 0.75, image: 'images/product_drink3.jpg', hasSizeSelection: true, hasQuantitySelection: true },
        { id: 'drk004', category: 'drinks', name: 'Aquafina', description: 'Pure and simple hydration.', basePrice: 0.75, image: 'images/product_drink4.jpg', hasSizeSelection: true, hasQuantitySelection: true },
        { id: 'diy001', category: 'diy', name: 'Popcorn Kernel Kit', description: 'Everything you need to pop at home.', basePrice: 0.99, image: 'images/product_diy1.jpg', hasSizeSelection: false, hasQuantitySelection: true },
        { id: 'diy002', category: 'diy', name: 'Seasoning Sampler', description: 'Variety pack of popcorn seasonings.', basePrice: 0.99, image: 'images/product_diy2.jpg', hasSizeSelection: false, hasQuantitySelection: true },
    ];

    const cartItemsDetailedList = document.getElementById('cart-items-detailed-list');
    const cartDetailedEmptyMessage = document.getElementById('cart-detailed-empty-message');
    const cartTotalPriceDetailed = document.getElementById('cart-total-price-detailed');
    const suggestionsList = document.getElementById('suggestions-list');
    const checkoutBtnDetailed = document.getElementById('checkout-btn-detailed');

    const CART_KEY = 'shoppingCart';

    function getCart() {
        const cartJson = localStorage.getItem(CART_KEY);
        try { return cartJson ? JSON.parse(cartJson) : {}; }
        catch (e) { console.error("Error parsing cart JSON", e); return {}; }
    }

    function saveCart(cart) {
        localStorage.setItem(CART_KEY, JSON.stringify(cart));
    }

    function formatPrice(price) {
        const numericPrice = Number(price);
        if (isNaN(numericPrice)) {
             // console.warn("formatPrice received non-numeric value:", price);
            return "$NaN"; // Or return a default like "$0.00"
        }
        return `$${numericPrice.toFixed(2)}`;
    }

    function getProductById(id) {
        return productData.find(product => product.id === id) || null;
    }

    function updateCartTotalDetailed() {
        const cart = getCart();
        let total = 0;
        for (const cartItemId in cart) {
            const item = cart[cartItemId];
            const price = Number(item.pricePerItem) || 0;
            const quantity = Number(item.quantity) || 0;
            total += price * quantity;
        }
        if (cartTotalPriceDetailed) {
            cartTotalPriceDetailed.textContent = formatPrice(total);
        }
    }

    function renderDetailedCart() {
        if (!cartItemsDetailedList || !cartDetailedEmptyMessage) {
            console.error("Cart list or empty message element not found");
            return;
        };

        const cart = getCart();
        cartItemsDetailedList.innerHTML = '';
        const cartItemIds = Object.keys(cart);

        if (cartItemIds.length === 0) {
            cartDetailedEmptyMessage.style.display = 'block';
        } else {
            cartDetailedEmptyMessage.style.display = 'none';
            cartItemIds.forEach(cartItemId => {
                const item = cart[cartItemId];
                const product = getProductById(item.id);
                if (!product) {
                    console.warn(`Product ID ${item.id} not found for cart item ${cartItemId}. Skipping render.`);
                    return;
                }

                const itemElement = document.createElement('div');
                itemElement.className = 'cart-item-detailed';
                itemElement.dataset.id = cartItemId;

                let customization = '';
                if (item.size && !item.isDealComponent) {
                    customization = `Size: ${item.size}`;
                } else if (item.popcornChoice || item.drinkChoice) {
                     customization = [item.popcornChoice, item.drinkChoice].filter(Boolean).join(', ');
                }

                const pricePerItem = Number(item.pricePerItem) || 0;
                const quantity = Number(item.quantity) || 0;
                const itemTotalPrice = pricePerItem * quantity;

                itemElement.innerHTML = `
                    <img src="${item.image || product.image}" alt="${item.name}" class="cart-item-image">
                    <div class="cart-item-info">
                        <span class="cart-item-name">${item.name}</span>
                        ${customization ? `<span class="cart-item-customization">${customization}</span>` : ''}
                        <span class="cart-item-price-each">(${formatPrice(pricePerItem)} / item)</span>
                    </div>
                    <div class="cart-item-quantity">
                        <button class="quantity-btn-cart minus" data-id="${cartItemId}" type="button" ${quantity <= 1 ? 'disabled' : ''}>-</button>
                        <input type="number" class="quantity-input-cart" value="${quantity}" min="1" data-id="${cartItemId}" aria-label="Item Quantity">
                        <button class="quantity-btn-cart plus" data-id="${cartItemId}" type="button">+</button>
                    </div>
                    <div class="cart-item-total-price">
                        ${formatPrice(itemTotalPrice)}
                    </div>
                    <button class="cart-item-delete-detailed" data-id="${cartItemId}" type="button">&times;</button>
                `;
                cartItemsDetailedList.appendChild(itemElement);
            });
        }
        updateCartTotalDetailed();
    }

    function updateCartItemQuantity(cartItemId, newValue) {
        const cart = getCart();
        if (cart[cartItemId]) {
            const qty = Math.max(1, parseInt(newValue, 10) || 1);
            cart[cartItemId].quantity = qty;
            saveCart(cart);
            renderDetailedCart();
        } else {
            console.warn("Attempted to update quantity for non-existent cart item:", cartItemId);
        }
    }

    function increaseQuantity(cartItemId) {
        const cart = getCart();
        if (cart[cartItemId]) {
            cart[cartItemId].quantity++;
            saveCart(cart);
            renderDetailedCart();
        } else {
            console.warn("Attempted to increase quantity for non-existent cart item:", cartItemId);
        }
    }

    function decreaseQuantity(cartItemId) {
        const cart = getCart();
        if (cart[cartItemId]) {
            cart[cartItemId].quantity--;
            if (cart[cartItemId].quantity <= 0) {
                delete cart[cartItemId];
            }
            saveCart(cart);
            renderDetailedCart();
        } else {
            console.warn("Attempted to decrease quantity for non-existent cart item:", cartItemId);
        }
    }

    function removeFromCartAndRender(cartItemId) {
        const cart = getCart();
        if (cart[cartItemId]) {
            delete cart[cartItemId];
            saveCart(cart);
            renderDetailedCart();
        } else {
             console.warn("Attempted to remove non-existent cart item:", cartItemId);
        }
    }

    function renderSuggestions() {
        if (!suggestionsList) {
            console.error("Suggestion list element not found in cart.html");
            return;
        }
        if (typeof productData === 'undefined' || !productData || productData.length === 0) {
             console.error("productData is missing or empty in cart.js!");
             suggestionsList.innerHTML = '<p>Error loading suggestions.</p>';
             return;
        }

        const cart = getCart();
        const cartProductIds = Object.values(cart).map(item => item.id);

        const potentialSuggestions = productData.filter(p =>
            p.category !== 'deals' && !cartProductIds.includes(p.id)
        );

        potentialSuggestions.sort(() => 0.5 - Math.random());

        const suggestions = potentialSuggestions.slice(0, 3);

        suggestionsList.innerHTML = '';
        if (suggestions.length > 0) {
            suggestions.forEach(product => {
                const suggestionElement = document.createElement('div');
                suggestionElement.className = 'suggestion-item';
                suggestionElement.innerHTML = `
                    <img src="${product.image}" alt="${product.name}">
                    <span class="suggestion-name">${product.name}</span>
                    <a href="catalogue.html#category-${product.category}" class="button suggestion-add-btn">View</a>
                `;
                suggestionsList.appendChild(suggestionElement);
            });
        } else {
            suggestionsList.innerHTML = '<p>No suggestions right now!</p>';
        }
    }

    cartItemsDetailedList?.addEventListener('click', (e) => {
        const target = e.target;
        const cartItem = target.closest('.cart-item-detailed');
        if (!cartItem) return;
        const cartItemId = cartItem.dataset.id;
        if (!cartItemId) return;

        if (target.classList.contains('cart-item-delete-detailed')) {
            removeFromCartAndRender(cartItemId);
        } else if (target.classList.contains('quantity-btn-cart')) {
            if (target.classList.contains('plus')) {
                increaseQuantity(cartItemId);
            } else if (target.classList.contains('minus')) {
                decreaseQuantity(cartItemId);
            }
        }
    });

    cartItemsDetailedList?.addEventListener('change', (e) => {
        const target = e.target;
        const cartItem = target.closest('.cart-item-detailed');
        if (!cartItem) return;
        const cartItemId = cartItem.dataset.id;

        if (target.classList.contains('quantity-input-cart')) {
             if (!cartItemId) return;
            updateCartItemQuantity(cartItemId, target.value);
        }
    });

    checkoutBtnDetailed?.addEventListener('click', () => {
        const cart = getCart();
        if (Object.keys(cart).length === 0) {
            alert("Your cart is empty!");
            return;
        }
        const totalText = cartTotalPriceDetailed ? cartTotalPriceDetailed.textContent : '$?.??';
        alert(`Proceeding to checkout simulation. Total: ${totalText}`);
    });

    if (typeof productData !== 'undefined' && productData.length > 0) {
        renderDetailedCart();
        renderSuggestions();
    } else {
        console.error("Cannot render page: productData is missing!");
         if(cartItemsDetailedList) cartItemsDetailedList.innerHTML = '<p style="color: red;">Error loading product data. Cannot display cart.</p>';
         if(suggestionsList) suggestionsList.innerHTML = '<p style="color: red;">Error loading product data. Cannot display suggestions.</p>';
    }

});