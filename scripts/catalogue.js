document.addEventListener('DOMContentLoaded', () => {

    const productData = [
        { id: 'deal001', category: 'deals', name: 'Night For 2', description: 'Deal includes: 2x 105oz Popcorn (choose flavor) + 1x 42oz Drink (choose type).', basePrice: 2.99, image: 'images/deal_night.jpg', hasSizeSelection: false, hasQuantitySelection: false, hasPopcornChoice: true, hasDrinkChoice: true, popcornCount: 2, popcornSize: '105oz', drinkCount: 1, drinkSize: '42oz' },
        { id: 'deal002', category: 'deals', name: 'Solo Watcher', description: 'Deal includes: 1x 105oz Popcorn (choose flavor) + 1x 30oz Drink (choose type).', basePrice: 1.99, image: 'images/deal_solo.jpg', hasSizeSelection: false, hasQuantitySelection: false, hasPopcornChoice: true, hasDrinkChoice: true, popcornCount: 1, popcornSize: '105oz', drinkCount: 1, drinkSize: '30oz' },
        { id: 'deal003', category: 'deals', name: 'Seasoned Popcorn Maker', description: 'Deal includes: 1x Popcorn Kernel Kit + 1x Seasoning Sampler.', basePrice: 1.49, image: 'images/deal_diy.jpg', hasSizeSelection: false, hasQuantitySelection: true, hasPopcornChoice: false, hasDrinkChoice: false },

        { id: 'pop001', category: 'popcorn', name: 'Buttery Classic', description: 'Warm, buttery, and irresistible.', basePrice: 0.99, image: 'images/product_popcorn1.jpg', hasSizeSelection: true, hasQuantitySelection: true, detailPage: 'products_A.html' },
        { id: 'pop002', category: 'popcorn', name: 'Caramel Bliss', description: 'Sweet, crunchy caramel coating.', basePrice: 0.99, image: 'images/product_popcorn2.jpg', hasSizeSelection: true, hasQuantitySelection: true, detailPage: 'products_A.html' },
        { id: 'pop003', category: 'popcorn', name: 'Spicy Chili', description: 'Popcorn with a kick!', basePrice: 0.99, image: 'images/product_popcorn3.jpg', hasSizeSelection: true, hasQuantitySelection: true, detailPage: 'products_A.html' },
        { id: 'pop004', category: 'popcorn', name: 'Cheesy Cheddar', description: 'Savory cheddar cheese flavor.', basePrice: 0.99, image: 'images/product_popcorn4.jpg', hasSizeSelection: true, hasQuantitySelection: true, detailPage: 'products_A.html' },

        { id: 'drk001', category: 'drinks', name: 'Coca-Cola', description: 'The standard bubbly refreshment.', basePrice: 0.75, image: 'images/product_drink1.jpg', hasSizeSelection: true, hasQuantitySelection: true },
        { id: 'drk002', category: 'drinks', name: 'Lipton Iced Tea', description: 'Refreshing classic iced tea.', basePrice: 0.75, image: 'images/product_drink2.jpg', hasSizeSelection: true, hasQuantitySelection: true },
        { id: 'drk003', category: 'drinks', name: 'Tropicana Twister', description: 'Freshly squeezed (not really) Vitamin C.', basePrice: 0.75, image: 'images/product_drink3.jpg', hasSizeSelection: true, hasQuantitySelection: true },
        { id: 'drk004', category: 'drinks', name: 'Aquafina', description: 'Pure and simple hydration.', basePrice: 0.75, image: 'images/product_drink4.jpg', hasSizeSelection: true, hasQuantitySelection: true },

        { id: 'diy001', category: 'diy', name: 'Popcorn Kernel Kit', description: 'The start of your popping journey.', basePrice: 0.99, image: 'images/product_diy1.jpg', hasSizeSelection: false, hasQuantitySelection: true, detailPage: 'products_B.html' },
        { id: 'diy002', category: 'diy', name: 'Seasoning Sampler', description: 'Variety pack of popcorn seasonings, provided by our partner, Kernels Seasons!', basePrice: 0.99, image: 'images/product_diy2.jpg', hasSizeSelection: false, hasQuantitySelection: true, detailPage: 'products_C.html' },
    ];

    const productListContainer = document.getElementById('product-list');
    const cartItemsList = document.getElementById('cart-items-list');
    const cartEmptyMessage = document.getElementById('cart-empty-message');
    const cartTotalPrice = document.getElementById('cart-total-price');
    const productNav = document.getElementById('product-nav');
    const modal = document.getElementById('product-detail-modal');
    const modalOverlay = document.getElementById('modal-overlay');
    const modalCloseBtn = document.getElementById('modal-close-btn');
    const modalProductImage = document.getElementById('modal-product-image');
    const modalProductName = document.getElementById('modal-product-name');
    const modalProductDescription = document.getElementById('modal-product-description');
    const modalOptionsForm = document.getElementById('modal-options-form');
    const modalSizeOptions = modal?.querySelectorAll('input[name="size"]');
    const modalQuantityInput = document.getElementById('modal-quantity');
    const modalQtyMinus = document.getElementById('modal-qty-minus');
    const modalQtyPlus = document.getElementById('modal-qty-plus');
    const modalCurrentPrice = document.getElementById('modal-current-price');
    const modalAddToCartBtn = document.getElementById('modal-add-to-cart-btn');
    const modalSizeOptionsContainer = document.querySelector('.size-options');
    const modalQuantityPicker = document.querySelector('.quantity-picker');
    const modalDealPopcornChoice = document.getElementById('modal-deal-popcorn-choice');
    const modalDealDrinkChoice = document.getElementById('modal-deal-drink-choice');
    const modalDetailLinkContainer = document.getElementById('modal-detail-link-container');

    const CART_KEY = 'shoppingCart';

    function getProductById(id) {
        return productData.find(product => product.id === id);
    }

    function formatPrice(price) {
        return `$${price.toFixed(2)}`;
    }

    function renderProducts() {
        if (!productListContainer) return;

        const productsByCategory = productData.reduce((acc, product) => {
            if (!acc[product.category]) {
                acc[product.category] = [];
            }
            acc[product.category].push(product);
            return acc;
        }, {});

        for (const categoryId in productsByCategory) {
            const categorySection = productListContainer.querySelector(`#category-${categoryId}`);
            const productsGrid = categorySection?.querySelector('.products-grid');

            if (productsGrid) {
                productsGrid.innerHTML = '';
                productsByCategory[categoryId].forEach(product => {
                    const productCard = document.createElement('div');
                    productCard.className = 'product-card';
                    productCard.dataset.productId = product.id;
                    productCard.innerHTML = `
                        <img src="${product.image}" alt="${product.name}" class="product-image">
                        <h4 class="product-name">${product.name}</h4>
                        <p class="product-price">${formatPrice(product.basePrice)}</p>
                    `;
                    productCard.addEventListener('click', () => openModal(product.id));
                    productsGrid.appendChild(productCard);
                });
            }
        }
    }

    function getCart() {
        const cartJson = localStorage.getItem(CART_KEY);
        try {
            return cartJson ? JSON.parse(cartJson) : {};
        } catch (e) {
            console.error("Error parsing cart JSON from localStorage", e);
            return {};
        }
    }

    function saveCart(cart) {
        localStorage.setItem(CART_KEY, JSON.stringify(cart));
    }

    function renderCart() {
        if (!cartItemsList || !cartEmptyMessage || !cartTotalPrice) return;

        const cart = getCart();
        cartItemsList.innerHTML = '';
        let total = 0;
        const cartItemIds = Object.keys(cart);

        if (cartItemIds.length === 0) {
            cartEmptyMessage.style.display = 'block';
        } else {
            cartEmptyMessage.style.display = 'none';
            cartItemIds.forEach(cartItemId => {
                const item = cart[cartItemId];
                const cartItemElement = document.createElement('div');
                cartItemElement.className = 'cart-item';
                cartItemElement.dataset.id = cartItemId;

                let customization = '';
                if (item.size && !item.isDealComponent) {
                    customization = `Size: ${item.size}`;
                } else if (item.popcornChoice || item.drinkChoice) {
                     customization = [item.popcornChoice, item.drinkChoice].filter(Boolean).join(', ');
                }


                cartItemElement.innerHTML = `
                    <img src="${item.image}" alt="${item.name}" class="cart-item-image">
                    <div class="cart-item-details">
                        <span class="cart-item-name">${item.name}</span>
                        ${customization ? `<span class="cart-item-customization">${customization}</span>` : ''}
                        <span class="cart-item-price">${formatPrice(item.pricePerItem)} ${item.quantity > 1 ? `x ${item.quantity}`: ''}</span>
                    </div>
                    <button class="cart-item-delete" data-id="${cartItemId}" type="button">&times;</button>
                `;

                 const deleteBtn = cartItemElement.querySelector('.cart-item-delete');
                 deleteBtn?.addEventListener('click', (e) => {
                     const idToDelete = e.target.dataset.id;
                     removeFromCart(idToDelete);
                 });

                cartItemsList.appendChild(cartItemElement);
                total += item.pricePerItem * item.quantity;
            });
        }
        cartTotalPrice.textContent = formatPrice(total);
    }

    function calculatePrice(product, selectedSizeValue) {
        let price = product.basePrice;
    
        if (product.category === 'drinks' && product.hasSizeSelection) {
            if (selectedSizeValue === '30oz') {
                price += 0.25;
            } else if (selectedSizeValue === '42oz') {
                price += 0.50;
            }
        }
        else if (product.hasSizeSelection) {
             if (selectedSizeValue === '105oz') {
                 price += 0.50;
             } else if (selectedSizeValue === '170oz') {
                 price += 1.00;
             }
        }
    
        return price;
    }

    function addToCart(productId, options = {}) {
        const product = getProductById(productId);
        if (!product) return;

        const cart = getCart();
        let quantity = options.quantity || 1;
        let size = options.size || null;
        let pricePerItem;
        let cartItemId;
        let customizations = {};

        if (product.hasSizeSelection) {
            size = options.size || (product.category === 'drinks' ? '21oz' : '64oz');
        } else {
            size = null;
        }

        if (product.category === 'deals') {
            pricePerItem = product.basePrice;
            cartItemId = `${product.id}`;
            if(options.popcornChoiceId) {
                const chosenPopcorn = getProductById(options.popcornChoiceId);
                customizations.popcornChoice = chosenPopcorn?.name || options.popcornChoiceId;
                cartItemId += `-${options.popcornChoiceId}`;
            }
             if(options.drinkChoiceId) {
                const chosenDrink = getProductById(options.drinkChoiceId);
                customizations.drinkChoice = chosenDrink?.name || options.drinkChoiceId;
                 size = product.drinkSize || null;
                 customizations.drinkSize = size;
                 cartItemId += `-${options.drinkChoiceId}`;
            }

            if (product.popcornCount > 0 && product.popcornSize) {
                customizations.popcornSize = product.popcornSize;
                if(!size) size = product.popcornSize;
            }

             if (product.hasQuantitySelection === false) {
                 quantity = 1;
             }
             cartItemId += `-deal`;

        }
        else if (!product.hasSizeSelection) {
             pricePerItem = product.basePrice;
             size = null;
             cartItemId = product.id;
        }
        else {
            size = options.size || (product.id === 'drk004' ? '21oz' : '64oz');
            pricePerItem = calculatePrice(product, size);
            cartItemId = `${product.id}-${size}`;
        }

        if (cart[cartItemId]) {
            if (product.hasQuantitySelection !== false) {
                 cart[cartItemId].quantity += quantity;
            } else if (product.category === 'deals' && product.hasQuantitySelection) {
                 cart[cartItemId].quantity += quantity;
            } else {
                console.warn("Item quantity cannot be changed or item already in cart.");
                 alert(`${product.name} is limited to 1 per purchase.`);
                return;
            }
        } else {
            cart[cartItemId] = {
                id: product.id,
                name: product.name,
                image: product.image,
                size: size,
                quantity: quantity,
                pricePerItem: pricePerItem,
                isDealComponent: product.category === 'deals',
                ...customizations
            };
        }

        saveCart(cart);
        renderCart();
        console.log('Cart updated:', cart);
    }

    function removeFromCart(cartItemId) {
        const cart = getCart();
        if (cart[cartItemId]) {
            delete cart[cartItemId];
            saveCart(cart);
            renderCart();
        }
    }

    let currentModalProductId = null;

    function updateModalPrice() {
        if (!modal || !currentModalProductId) return;
        const product = getProductById(currentModalProductId);
        if (!product) return;
    
        if (product.category === 'deals') {
            let price = product.basePrice;
            if (product.hasQuantitySelection && modalQuantityInput) {
                const quantity = parseInt(modalQuantityInput.value, 10) || 1;
                price = product.basePrice * Math.max(1, quantity);
            }
            modalCurrentPrice.textContent = formatPrice(price);
            return;
        }
    
        if (!product.hasSizeSelection) {
            let price = product.basePrice;
            if (product.hasQuantitySelection && modalQuantityInput) {
                 const quantity = parseInt(modalQuantityInput.value, 10) || 1;
                 price = product.basePrice * Math.max(1, quantity);
            }
            modalCurrentPrice.textContent = formatPrice(price);
            return;
        }
    
        const selectedSizeInput = modalOptionsForm.querySelector('input[name="size"]:checked');
        const defaultSize = product.category === 'drinks' ? '21oz' : '64oz';
        const sizeValue = selectedSizeInput ? selectedSizeInput.value : defaultSize;
    
        if (modalQuantityInput) {
            const quantity = Math.max(1, parseInt(modalQuantityInput.value, 10) || 1);
    
            const currentPricePerItem = calculatePrice(product, sizeValue);
            const totalPrice = currentPricePerItem * quantity;
            modalCurrentPrice.textContent = formatPrice(totalPrice);
        } else {
            const currentPricePerItem = calculatePrice(product, sizeValue);
            modalCurrentPrice.textContent = formatPrice(currentPricePerItem);
        }
    }

   function openModal(productId) {
       if (!modal || !modalOverlay) return;
       const product = getProductById(productId);
       if (!product) return;

       currentModalProductId = productId;

       modalProductImage.src = product.image;
       modalProductImage.alt = product.name;
       modalProductName.textContent = product.name;
       modalProductDescription.textContent = product.description;

        modalDetailLinkContainer.innerHTML = '';
        if (product.detailPage) {
            const detailLink = document.createElement('a');
            detailLink.href = product.detailPage;
            detailLink.textContent = 'View Full Details';
            detailLink.className = 'modal-detail-link';
            modalDetailLinkContainer.appendChild(detailLink);
        }

       // --- Reset and Configure Modal Options ---

       // A) Hide/Show sections based on product type
       const showSize = product.hasSizeSelection;
       const showQty = product.hasQuantitySelection;
       const showPopcorn = product.hasPopcornChoice;
       const showDrink = product.hasDrinkChoice;

       modalSizeOptionsContainer.style.display = showSize ? 'block' : 'none';
       if (modalQuantityPicker) {
            modalQuantityPicker.style.display = showQty ? 'flex' : 'none';
            if(showQty) modalQuantityInput.value = 1;
       }
       modalDealPopcornChoice.parentElement.style.display = showPopcorn ? 'block' : 'none';
       modalDealDrinkChoice.parentElement.style.display = showDrink ? 'block' : 'none';

       // B) Populate Size Options
       if (showSize) {
        const sizeFieldset = modalSizeOptionsContainer;
        sizeFieldset.innerHTML = '<legend>Choose Size:</legend>';
        let sizes = [];
        let defaultSize = '';

        if (product.category === 'drinks') {
            sizes = [
                { value: '21oz', priceMod: 0, text: '21oz' },
                { value: '30oz', priceMod: 0.25, text: '30oz (+$0.25)' },
                { value: '42oz', priceMod: 0.50, text: '42oz (+$0.50)' }
            ];
            defaultSize = '21oz';
        }
        else {
             sizes = [
                { value: '64oz', priceMod: 0, text: '64oz' },
                { value: '105oz', priceMod: 0.50, text: '105oz (+$0.50)' },
                { value: '170oz', priceMod: 1.00, text: '170oz (+$1.00)' }
            ];
            defaultSize = '64oz';
        }

        sizes.forEach(size => {
            const label = document.createElement('label');
            const radio = document.createElement('input');
            radio.type = 'radio';
            radio.name = 'size';
            radio.value = size.value;
            if (size.value === defaultSize) {
                radio.checked = true;
            }
            label.appendChild(radio);
            label.appendChild(document.createTextNode(` ${size.text}`));
            sizeFieldset.appendChild(label);
        });
    }

       // C) Populate Deal Choices (Popcorn/Drink)
        const popcornProducts = productData.filter(p => p.category === 'popcorn');
        const drinkProducts = productData.filter(p => p.category === 'drinks');

       if (showPopcorn && modalDealPopcornChoice) {
           modalDealPopcornChoice.innerHTML = '';
           popcornProducts.forEach(p => {
               const option = new Option(`${p.name}`, p.id);
               modalDealPopcornChoice.add(option);
           });
       }
        if (showDrink && modalDealDrinkChoice) {
           modalDealDrinkChoice.innerHTML = '';
            drinkProducts.forEach(p => {
               const option = new Option(`${p.name}`, p.id);
               modalDealDrinkChoice.add(option);
           });
       }

       // D) Update initial price and show modal
       updateModalPrice();
       modal.classList.add('active');
       modalOverlay.classList.add('active');
   }

   function closeModal() {
        if (!modal || !modalOverlay) return;
        modal.classList.remove('active');
        modalOverlay.classList.remove('active');
        currentModalProductId = null;
   }

   modalOptionsForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    if (!currentModalProductId) return;

    const product = getProductById(currentModalProductId);
    if (!product) return;

    let options = {
        quantity: 1
    };

    if (product.hasSizeSelection) {
        const selectedSizeInput = modalOptionsForm.querySelector('input[name="size"]:checked');
        const defaultSize = product.category === 'drinks' ? '21oz' : '64oz';
        options.size = selectedSizeInput ? selectedSizeInput.value : defaultSize;
    } else {
        options.size = null;
    }

    if (product.hasQuantitySelection && modalQuantityInput) {
         const qty = Math.max(1, parseInt(modalQuantityInput.value, 10) || 1);
         options.quantity = qty;
    }

    if (product.hasPopcornChoice && modalDealPopcornChoice) {
        options.popcornChoiceId = modalDealPopcornChoice.value;
    }
    if (product.hasDrinkChoice && modalDealDrinkChoice) {
        options.drinkChoiceId = modalDealDrinkChoice.value;
    }

    addToCart(currentModalProductId, options);
    closeModal();
    });

    // --- Event Listeners ---

    modalCloseBtn?.addEventListener('click', closeModal);
    modalOverlay?.addEventListener('click', closeModal);

    modalOptionsForm?.addEventListener('change', (e) => {
        if (e.target.name === 'size') {
            updateModalPrice();
        }
    });
     modalOptionsForm?.addEventListener('input', (e) => {
        if (e.target.id === 'modal-quantity') {
            if (e.target.value < 1 && e.target.value !== '') {
                 e.target.value = 1;
            }
            updateModalPrice();
        }
    });


    modalQtyMinus?.addEventListener('click', () => {
        let currentQty = parseInt(modalQuantityInput.value, 10);
        if (currentQty > 1) {
            modalQuantityInput.value = currentQty - 1;
            updateModalPrice();
        }
    });

    modalQtyPlus?.addEventListener('click', () => {
        let currentQty = parseInt(modalQuantityInput.value, 10);
        modalQuantityInput.value = currentQty + 1;
        updateModalPrice();
    });

    modalOptionsForm?.addEventListener('submit', (e) => {
        e.preventDefault();
        const selectedSizeInput = modalOptionsForm.querySelector('input[name="size"]:checked');
        const size = selectedSizeInput ? selectedSizeInput.value : '64oz';
        const quantity = parseInt(modalQuantityInput.value, 10);

        if (currentModalProductId && !isNaN(quantity) && quantity >= 1) {
            addToCart(currentModalProductId, size, quantity);
            closeModal();
        }
    });

    productNav?.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });

    const checkoutBtn = document.getElementById('checkout-btn');
    checkoutBtn?.addEventListener('click', () => {
        const cart = getCart();
        if (Object.keys(cart).length === 0) {
            alert("Your cart is empty!");
            return;
        } else window.location.href = 'cart.html';
    });


    // --- Initial Setup ---
    renderProducts();
    renderCart();

});