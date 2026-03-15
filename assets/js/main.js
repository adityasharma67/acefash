// Quick little popup to tell the user what just happened
function showToast(message) {
    const toast = document.getElementById('toast');
    if (!toast) return;
    toast.innerText = message;
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 2500);
}

// Builds the star icons based on product rating (supports half stars too)
function getRatingHtml(rating) {
    let html = '';
    for (let i = 1; i <= 5; i++) {
        if (i <= rating) html += '<i class="fa fa-star"></i>';
        else if (i - 0.5 === rating) html += '<i class="fa fa-star-half-o"></i>';
        else html += '<i class="fa fa-star-o"></i>';
    }
    return html;
}

// Creates a single product card that navigates to the detail page on click
function createProductCard(product) {
    return `
        <div class="product-card" onclick="window.location.href='product-details.html?id=${product.id}'">
            <img src="${product.image}" alt="${product.name}">
            <div class="product-info">
                <h4>${product.name}</h4>
                <p>Rs. ${product.price.toFixed(2)}</p>
                <div class="rating">${getRatingHtml(product.rating)}</div>
            </div>
        </div>
    `;
}

// Takes a list of products and drops them into any container on the page
function renderProducts(list, containerId) {
    const el = document.getElementById(containerId);
    if (!el) return;
    el.innerHTML = list.map(p => createProductCard(p)).join('');
}

// Pulls the saved cart from browser storage
function getCart() {
    return JSON.parse(localStorage.getItem('cart')) || [];
}

// Saves the updated cart and refreshes the little badge on the cart icon
function saveCart(cart) {
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartBadge();
}

// Adds a product to cart — stacks up quantity if same size already exists
function addToCart(productId, quantity, size) {
    const cart = getCart();
    const existing = cart.find(i => i.productId === productId && i.size === size);
    if (existing) {
        existing.quantity += parseInt(quantity);
    } else {
        cart.push({ productId: parseInt(productId), quantity: parseInt(quantity), size });
    }
    saveCart(cart);
    showToast('✓ Item added to cart!');
}

// Keeps the cart icon count badge in sync with actual cart contents
function updateCartBadge() {
    const cart = getCart();
    const total = cart.reduce((s, i) => s + i.quantity, 0);
    const badge = document.getElementById('cart-count');
    if (badge) {
        if (total > 0) {
            badge.style.display = 'inline-block';
            badge.innerText = total;
        } else {
            badge.style.display = 'none';
        }
    }
}

// Draws the full cart table with prices, quantities and totals
function renderCart() {
    const container = document.getElementById('cart-items-container');
    if (!container) return;

    const cart = getCart();
    let html = '';
    let subtotal = 0;

    if (cart.length === 0) {
        html = '<tr><td colspan="3" class="empty-cart-msg">Your cart is empty. <a href="products.html" style="color:#ff523b;">Continue Shopping</a></td></tr>';
        document.getElementById('cart-totals').style.display = 'none';
        document.getElementById('checkout-wrapper').style.display = 'none';
    } else {
        document.getElementById('cart-totals').style.display = 'flex';
        document.getElementById('checkout-wrapper').style.display = 'block';

        cart.forEach((item, index) => {
            const product = window.products.find(p => p.id === item.productId);
            if (product) {
                const itemTotal = product.price * item.quantity;
                subtotal += itemTotal;
                html += `
                    <tr>
                        <td>
                            <div class="cart-info">
                                <img src="${product.image}" alt="${product.name}">
                                <div>
                                    <p><b>${product.name}</b></p>
                                    <small>Price: Rs. ${product.price.toFixed(2)}</small><br>
                                    <small>Size: ${item.size || 'N/A'}</small><br>
                                    <a href="#" onclick="removeFromCart(${index}); return false;">Remove</a>
                                </div>
                            </div>
                        </td>
                        <td><input type="number" value="${item.quantity}" min="1" onchange="updateCartQty(${index}, this.value)"></td>
                        <td>Rs. ${itemTotal.toFixed(2)}</td>
                    </tr>
                `;
            }
        });
    }

    container.innerHTML = html;

    // 10% tax added on top of subtotal
    const tax = subtotal * 0.10;
    const total = subtotal + tax;
    const subtotalEl = document.getElementById('cart-subtotal');
    const taxEl = document.getElementById('cart-tax');
    const totalEl = document.getElementById('cart-total');
    if (subtotalEl) subtotalEl.innerText = `Rs. ${subtotal.toFixed(2)}`;
    if (taxEl) taxEl.innerText = `Rs. ${tax.toFixed(2)}`;
    if (totalEl) totalEl.innerHTML = `<b>Rs. ${total.toFixed(2)}</b>`;
}

// Removes an item from the cart by its position in the array
window.removeFromCart = function(index) {
    const cart = getCart();
    cart.splice(index, 1);
    saveCart(cart);
    renderCart();
    showToast('Item removed from cart');
};

// Updates quantity for a specific cart item when user changes the number
window.updateCartQty = function(index, val) {
    const cart = getCart();
    const qty = parseInt(val);
    if (qty > 0) {
        cart[index].quantity = qty;
        saveCart(cart);
        renderCart();
    }
};

// Fetches all registered users from storage
function getUsers() {
    return JSON.parse(localStorage.getItem('users')) || [];
}

// Returns whoever is currently logged in (or null if no one is)
function getCurrentUser() {
    return JSON.parse(localStorage.getItem('currentUser'));
}

// Saves a new user — rejects if username is already taken
function registerUser(username, email, password) {
    const users = getUsers();
    if (users.find(u => u.username.toLowerCase() === username.toLowerCase())) {
        return { success: false, message: 'Username already exists' };
    }
    users.push({ username, email, password });
    localStorage.setItem('users', JSON.stringify(users));
    return { success: true };
}

// Checks credentials and logs in the user if they match
function loginUser(username, password) {
    const users = getUsers();
    const user = users.find(u => u.username.toLowerCase() === username.toLowerCase() && u.password === password);
    if (user) {
        localStorage.setItem('currentUser', JSON.stringify(user));
        return { success: true };
    }
    return { success: false, message: 'Invalid username or password' };
}

// Clears the session and refreshes the page
function logoutUser() {
    localStorage.removeItem('currentUser');
    showToast('Logged out successfully');
    setTimeout(() => window.location.reload(), 500);
}

// Wires up auth-related UI — login nav label, register form, login form
function setupAuth() {
    const currentUser = getCurrentUser();

    // If someone's logged in, swap the ACCOUNT nav link to show their name + logout
    const accountLink = document.getElementById('account-link');
    if (accountLink && currentUser) {
        accountLink.innerText = `LOGOUT (${currentUser.username})`;
        accountLink.href = '#';
        accountLink.addEventListener('click', (e) => {
            e.preventDefault();
            logoutUser();
        });
    }

    // On the account page, replace the form with a welcome panel if already logged in
    const formContainer = document.getElementById('form-container');
    if (formContainer && currentUser) {
        formContainer.innerHTML = `
            <div class="logged-in-panel">
                <h3>Welcome, ${currentUser.username}!</h3>
                <p>You are currently logged in.</p>
                <a href="#" class="btn" onclick="logoutUser(); return false;">Logout</a>
                <br>
                <a href="products.html" class="btn" style="background:#333;">Continue Shopping</a>
            </div>
        `;
    }

    // Handle new account registration
    const regForm = document.getElementById('regform');
    if (regForm) {
        regForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const u = document.getElementById('reg-username').value;
            const em = document.getElementById('reg-email').value;
            const p = document.getElementById('reg-password').value;
            const res = registerUser(u, em, p);
            if (res.success) {
                showToast('Registration successful! Please login.');
                if (typeof showLogin === 'function') showLogin();
                regForm.reset();
            } else {
                showToast(res.message);
            }
        });
    }

    // Handle login form submission
    const loginForm = document.getElementById('loginform');
    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const u = document.getElementById('login-username').value;
            const p = document.getElementById('login-password').value;
            const res = loginUser(u, p);
            if (res.success) {
                showToast('Login successful!');
                setTimeout(() => window.location.href = 'index.html', 800);
            } else {
                showToast(res.message);
            }
        });
    }
}

// Loads and sets up the product detail page based on ?id= in the URL
function setupProductDetail() {
    const nameEl = document.getElementById('product-name');
    if (!nameEl) return; // we're not on the product detail page, skip

    const urlParams = new URLSearchParams(window.location.search);
    const productId = parseInt(urlParams.get('id'));
    const product = window.products.find(p => p.id === productId);

    if (!product) {
        nameEl.innerText = 'Product Not Found';
        return;
    }

    document.getElementById('ProductImg').src = product.image;
    document.getElementById('product-category').innerText = `Home / ${product.category}`;
    nameEl.innerText = product.name;
    document.getElementById('product-price').innerText = `Rs. ${product.price.toFixed(2)}`;
    document.getElementById('product-rating').innerHTML = getRatingHtml(product.rating);
    document.title = `ACEFASH | ${product.name}`;

    // All gallery thumbnails show the same product image for now
    const smallImgs = document.getElementsByClassName('small-img');
    for (let i = 0; i < smallImgs.length; i++) {
        smallImgs[i].src = product.image;
        smallImgs[i].addEventListener('click', function() {
            document.getElementById('ProductImg').src = this.src;
            // Keep the zoom panel in sync when user switches gallery image
            const zoomResult = document.getElementById('zoom-result');
            if (zoomResult) zoomResult.style.backgroundImage = `url(${this.src})`;
        });
    }

    // Kick off the hover zoom feature
    setupZoom();

    // Add to cart button — validates size is selected before adding
    const addBtn = document.getElementById('add-to-cart-btn');
    if (addBtn) {
        addBtn.addEventListener('click', (e) => {
            e.preventDefault();
            const size = document.getElementById('product-size').value;
            const qty = document.getElementById('product-quantity').value;
            if (!size) { showToast('Please select a size!'); return; }
            addToCart(product.id, qty, size);
        });
    }

    // Pick 4 random products (excluding the current one) as related suggestions
    const related = window.products.filter(p => p.id !== product.id).sort(() => 0.5 - Math.random()).slice(0, 4);
    renderProducts(related, 'related-products');
}

// Hover zoom — magnifies the product image where your cursor is pointing
function setupZoom() {
    const container = document.getElementById('zoom-container');
    const img = document.getElementById('ProductImg');
    const result = document.getElementById('zoom-result');
    if (!container || !img || !result) return;

    // Set the side panel background to match the current product image
    function updateZoomBg() {
        result.style.backgroundImage = `url(${img.src})`;
    }

    img.addEventListener('load', updateZoomBg);
    if (img.complete) updateZoomBg();

    // Track mouse position and zoom into that exact spot
    container.addEventListener('mousemove', (e) => {
        const rect = container.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 100;
        const y = ((e.clientY - rect.top) / rect.height) * 100;

        img.style.transformOrigin = `${x}% ${y}%`;
        result.style.backgroundPosition = `${x}% ${y}%`;
    });

    // Reset zoom origin when mouse leaves the image
    container.addEventListener('mouseleave', () => {
        img.style.transformOrigin = 'center center';
    });
}

// Sets up the products listing page with sort functionality
function setupProductsPage() {
    const container = document.getElementById('all-products');
    if (!container) return;

    let sorted = [...window.products];
    renderProducts(sorted, 'all-products');

    // Re-sort and re-render whenever the user picks a different sort option
    const sortSelect = document.getElementById('sort-select');
    if (sortSelect) {
        sortSelect.addEventListener('change', () => {
            const val = sortSelect.value;
            if (val === 'price-low') sorted.sort((a, b) => a.price - b.price);
            else if (val === 'price-high') sorted.sort((a, b) => b.price - a.price);
            else if (val === 'rating') sorted.sort((a, b) => b.rating - a.rating);
            else sorted = [...window.products];
            renderProducts(sorted, 'all-products');
        });
    }
}

// Contact form just shows a thank-you toast for now (no backend yet)
function setupContact() {
    const form = document.getElementById('contact-form');
    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            showToast('Message sent successfully! We will get back to you soon.');
            form.reset();
        });
    }
}

// Checkout flow — checks login, clears cart, and confirms the order
function setupCheckout() {
    const btn = document.getElementById('checkout-btn');
    if (btn) {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const user = getCurrentUser();
            if (!user) {
                showToast('Please login to checkout');
                setTimeout(() => window.location.href = 'account.html', 1000);
                return;
            }
            const cart = getCart();
            if (cart.length === 0) {
                showToast('Your cart is empty!');
                return;
            }
            // Order placed — clear the cart and celebrate!
            localStorage.setItem('cart', JSON.stringify([]));
            updateCartBadge();
            showToast('🎉 Order placed successfully! Thank you for shopping with ACEFASH!');
            setTimeout(() => {
                renderCart();
            }, 500);
        });
    }
}

// Everything kicks off here once the page has fully loaded
document.addEventListener('DOMContentLoaded', () => {
    updateCartBadge();
    setupAuth();

    // Home page product sections
    renderProducts(window.products.slice(0, 4), 'featured-products');
    renderProducts(window.products.slice(4, 8), 'latest-products-1');
    renderProducts(window.products.slice(8, 12), 'latest-products-2');

    setupProductsPage();
    setupProductDetail();

    // Only render cart if we're actually on the cart page
    if (document.getElementById('cart-items-container')) {
        renderCart();
    }

    setupCheckout();
    setupContact();
});
