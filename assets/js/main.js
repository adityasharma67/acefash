// =====================================================
// ACEFASH — Main JavaScript
// Handles: Cart, Auth, Product Render, Scroll Reveal,
//          Navbar Scroll Effect, Zoom, Contact
// =====================================================

// Quick little popup to tell the user what just happened
function showToast(message) {
    const toast = document.getElementById('toast');
    if (!toast) return;
    toast.innerText = message;
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 2800);
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
        <div class="product-card reveal" onclick="window.location.href='product-details.html?id=${product.id}'">
            <img src="${product.image}" alt="${product.name}" loading="lazy">
            <div class="product-info">
                <h4>${product.name}</h4>
                <small class="product-category-tag">${product.category}</small>
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
    // Trigger reveal for newly injected cards
    initScrollReveal();
}

const API_BASE = window.ACEFASH_API_BASE || localStorage.getItem('acefash_api_base') || 'http://localhost:5000/api';

function getAuthToken() {
    return localStorage.getItem('authToken') || '';
}

function setAuthSession(token, user) {
    localStorage.setItem('authToken', token);
    localStorage.setItem('currentUser', JSON.stringify(user));
}

function clearAuthSession() {
    localStorage.removeItem('authToken');
    localStorage.removeItem('currentUser');
}

async function apiRequest(path, { method = 'GET', body, requiresAuth = false } = {}) {
    const headers = { 'Content-Type': 'application/json' };
    const token = getAuthToken();

    if (requiresAuth) {
        if (!token) throw new Error('Please login to continue');
        headers.Authorization = `Bearer ${token}`;
    }

    const res = await fetch(`${API_BASE}${path}`, {
        method,
        headers,
        body: body ? JSON.stringify(body) : undefined,
    });

    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
        throw new Error(data.message || 'Something went wrong');
    }

    return data;
}

window.apiRequest = apiRequest;

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

    // Pop animation on badge
    const badge = document.getElementById('cart-count');
    if (badge) {
        badge.classList.remove('pop');
        void badge.offsetWidth; // reflow
        badge.classList.add('pop');
        setTimeout(() => badge.classList.remove('pop'), 400);
    }
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
        html = '<tr><td colspan="3" class="empty-cart-msg">Your cart is empty. <a href="products.html">Continue Shopping</a></td></tr>';
        const totalsEl = document.getElementById('cart-totals');
        const wrapperEl = document.getElementById('checkout-wrapper');
        if (totalsEl) totalsEl.style.display = 'none';
        if (wrapperEl) wrapperEl.style.display = 'none';
    } else {
        const totalsEl = document.getElementById('cart-totals');
        const wrapperEl = document.getElementById('checkout-wrapper');
        if (totalsEl) totalsEl.style.display = 'flex';
        if (wrapperEl) wrapperEl.style.display = 'block';

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
                                    <a href="#" onclick="removeFromCart(${index}); return false;"><i class="fa fa-trash"></i> Remove</a>
                                </div>
                            </div>
                        </td>
                        <td><input type="number" value="${item.quantity}" min="1" onchange="updateCartQty(${index}, this.value)"></td>
                        <td><b>Rs. ${itemTotal.toFixed(2)}</b></td>
                    </tr>
                `;
            }
        });
    }

    container.innerHTML = html;

    const tax = subtotal * 0.10;
    const total = subtotal + tax;
    const subtotalEl = document.getElementById('cart-subtotal');
    const taxEl      = document.getElementById('cart-tax');
    const totalEl    = document.getElementById('cart-total');
    if (subtotalEl) subtotalEl.innerText = `Rs. ${subtotal.toFixed(2)}`;
    if (taxEl)      taxEl.innerText      = `Rs. ${tax.toFixed(2)}`;
    if (totalEl)    totalEl.innerHTML    = `<b>Rs. ${total.toFixed(2)}</b>`;
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

// Backward compatibility helper used by account page script
function getUsers() {
    return [];
}

// Returns whoever is currently logged in (or null if no one is)
function getCurrentUser() {
    return JSON.parse(localStorage.getItem('currentUser'));
}

async function syncCurrentUserFromServer() {
    const token = getAuthToken();
    if (!token) return getCurrentUser();

    try {
        const data = await apiRequest('/auth/me', { requiresAuth: true });
        const user = {
            id: data.user._id || data.user.id,
            name: data.user.name,
            email: data.user.email,
            role: data.user.role,
            phone: data.user.phone || '',
            preferredSport: data.user.preferredSport || '',
            defaultShippingAddress: data.user.defaultShippingAddress || {},
            createdAt: data.user.createdAt,
        };
        localStorage.setItem('currentUser', JSON.stringify(user));
        return user;
    } catch (error) {
        clearAuthSession();
        return null;
    }
}

// Saves a new user via backend API
async function registerUser(name, email, password) {
    try {
        const data = await apiRequest('/auth/register', {
            method: 'POST',
            body: { name, email, password },
        });

        setAuthSession(data.token, data.user);
        return { success: true, user: data.user };
    } catch (error) {
        return { success: false, message: error.message };
    }
}

// Checks credentials via backend API
async function loginUser(email, password) {
    try {
        const data = await apiRequest('/auth/login', {
            method: 'POST',
            body: { email, password },
        });

        setAuthSession(data.token, data.user);
        return { success: true, user: data.user };
    } catch (error) {
        return { success: false, message: error.message };
    }
}

// Clears the session and refreshes the page
function logoutUser() {
    clearAuthSession();
    showToast('Logged out successfully');
    setTimeout(() => window.location.reload(), 500);
}

window.fetchMyOrdersFromServer = async function() {
    const data = await apiRequest('/orders/my-orders', { requiresAuth: true });
    return data.orders || [];
};

window.updateProfileOnServer = async function(profilePayload) {
    const data = await apiRequest('/auth/profile', {
        method: 'PUT',
        body: profilePayload,
        requiresAuth: true,
    });
    localStorage.setItem('currentUser', JSON.stringify(data.user));
    return data.user;
};

window.createStorefrontOrderOnServer = async function(orderPayload) {
    const data = await apiRequest('/orders/storefront', {
        method: 'POST',
        body: orderPayload,
        requiresAuth: true,
    });
    return data.order;
};

window.syncCurrentUserFromServer = syncCurrentUserFromServer;

// Wires up auth-related UI — login nav label, register form, login form
async function setupAuth() {
    const currentUser = await syncCurrentUserFromServer();

    const accountLink = document.getElementById('account-link');
    if (accountLink && currentUser) {
        accountLink.innerText = `LOGOUT (${currentUser.name})`;
        accountLink.href = '#';
        accountLink.addEventListener('click', (e) => {
            e.preventDefault();
            logoutUser();
        });
    }

    const formContainer = document.getElementById('form-container');
    if (formContainer && currentUser) {
        // On account page: hide auth, show dashboard
        if (typeof window.initDashboard === 'function') {
            window.initDashboard(currentUser);
        } else {
            formContainer.innerHTML = `
                <div class="logged-in-panel">
                    <h3>Welcome, ${currentUser.name}! 👋</h3>
                    <p>You are currently logged in.</p>
                    <a href="#" class="btn" onclick="logoutUser(); return false;">Logout</a>
                    <br>
                    <a href="products.html" class="btn" style="background:linear-gradient(135deg,#1a1a2e,#333); margin-top:10px;">Continue Shopping</a>
                </div>
            `;
        }
    }

    const regForm = document.getElementById('regform');
    if (regForm) {
        regForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const u  = document.getElementById('reg-name').value;
            const em = document.getElementById('reg-email').value;
            const p  = document.getElementById('reg-password').value;
            const res = await registerUser(u, em, p);
            if (res.success) {
                showToast('✅ Registration successful!');
                setTimeout(() => window.location.href = 'account.html', 600);
            } else {
                showToast('❌ ' + res.message);
            }
        });
    }

    const loginForm = document.getElementById('loginform');
    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const u = document.getElementById('login-email').value;
            const p = document.getElementById('login-password').value;
            const res = await loginUser(u, p);
            if (res.success) {
                showToast('✅ Login successful!');
                setTimeout(() => window.location.href = 'account.html', 800);
            } else {
                showToast('❌ ' + res.message);
            }
        });
    }
}

// Loads and sets up the product detail page based on ?id= in the URL
function setupProductDetail() {
    const nameEl = document.getElementById('product-name');
    if (!nameEl) return;

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

    const smallImgs = document.getElementsByClassName('small-img');
    for (let i = 0; i < smallImgs.length; i++) {
        smallImgs[i].src = product.image;
        smallImgs[i].addEventListener('click', function() {
            document.getElementById('ProductImg').src = this.src;
            const zoomResult = document.getElementById('zoom-result');
            if (zoomResult) zoomResult.style.backgroundImage = `url(${this.src})`;
        });
    }

    setupZoom();

    const addBtn = document.getElementById('add-to-cart-btn');
    if (addBtn) {
        addBtn.addEventListener('click', (e) => {
            e.preventDefault();
            const size = document.getElementById('product-size').value;
            const qty  = document.getElementById('product-quantity').value;
            if (!size) { showToast('⚠️ Please select a size!'); return; }
            addToCart(product.id, qty, size);
        });
    }

    const related = window.products.filter(p => p.id !== product.id).sort(() => 0.5 - Math.random()).slice(0, 4);
    renderProducts(related, 'related-products');
}

// Hover zoom — magnifies the product image where your cursor is pointing
function setupZoom() {
    const container = document.getElementById('zoom-container');
    const img    = document.getElementById('ProductImg');
    const result = document.getElementById('zoom-result');
    if (!container || !img || !result) return;

    function updateZoomBg() {
        result.style.backgroundImage = `url(${img.src})`;
    }

    img.addEventListener('load', updateZoomBg);
    if (img.complete) updateZoomBg();

    container.addEventListener('mousemove', (e) => {
        const rect = container.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 100;
        const y = ((e.clientY - rect.top) / rect.height) * 100;
        img.style.transformOrigin = `${x}% ${y}%`;
        result.style.backgroundPosition = `${x}% ${y}%`;
    });

    container.addEventListener('mouseleave', () => {
        img.style.transformOrigin = 'center center';
    });
}

// Sets up the products listing page with sort functionality
function setupProductsPage() {
    const container = document.getElementById('all-products');
    if (!container) return;

    const categorySelect = document.getElementById('category-select');
    const sortSelect = document.getElementById('sort-select');
    const searchInput = document.getElementById('search-input');
    const paginationEl = document.getElementById('pagination-controls');
    const countEl = document.getElementById('products-count');
    const products = [...window.products];
    const pageSize = 12;
    let currentPage = 1;

    if (categorySelect) {
        const categories = [...new Set(products.map(p => p.category))].sort();
        categorySelect.innerHTML = '<option value="all">All Categories</option>' +
            categories.map(c => `<option value="${c}">${c}</option>`).join('');
    }

    const renderPagination = (totalPages) => {
        if (!paginationEl) return;
        if (totalPages <= 1) {
            paginationEl.innerHTML = '';
            return;
        }

        let html = '';

        for (let page = 1; page <= totalPages; page++) {
            html += `<button class="pagination-btn ${page === currentPage ? 'active' : ''}" data-page="${page}">${page}</button>`;
        }

        paginationEl.innerHTML = html;

        paginationEl.querySelectorAll('[data-page]').forEach((btn) => {
            btn.addEventListener('click', () => {
                currentPage = Number(btn.getAttribute('data-page'));
                applyFilters();
                window.scrollTo({ top: 0, behavior: 'smooth' });
            });
        });
    };

    const applyFilters = () => {
        let list = [...products];
        const selectedCategory = categorySelect ? categorySelect.value : 'all';
        const sortBy = sortSelect ? sortSelect.value : 'default';
        const searchTerm = (searchInput ? searchInput.value : '').trim().toLowerCase();

        if (selectedCategory !== 'all') {
            list = list.filter(p => p.category === selectedCategory);
        }

        if (searchTerm) {
            list = list.filter((p) =>
                p.name.toLowerCase().includes(searchTerm) ||
                p.category.toLowerCase().includes(searchTerm)
            );
        }

        if (sortBy === 'price-low') list.sort((a, b) => a.price - b.price);
        else if (sortBy === 'price-high') list.sort((a, b) => b.price - a.price);
        else if (sortBy === 'rating') list.sort((a, b) => b.rating - a.rating);

        const totalPages = Math.max(1, Math.ceil(list.length / pageSize));
        if (currentPage > totalPages) currentPage = 1;

        const start = (currentPage - 1) * pageSize;
        const end = start + pageSize;
        const pageItems = list.slice(start, end);

        renderProducts(pageItems, 'all-products');
        renderPagination(totalPages);

        if (countEl) {
            if (!list.length) {
                countEl.textContent = 'No products found';
            } else {
                countEl.textContent = `Showing ${start + 1}-${Math.min(end, list.length)} of ${list.length} products`;
            }
        }
    };

    applyFilters();

    if (sortSelect) {
        sortSelect.addEventListener('change', applyFilters);
    }

    if (categorySelect) {
        categorySelect.addEventListener('change', () => {
            currentPage = 1;
            applyFilters();
        });
    }

    if (searchInput) {
        searchInput.addEventListener('input', () => {
            currentPage = 1;
            applyFilters();
        });
    }
}

// Contact form just shows a thank-you toast
function setupContact() {
    const form = document.getElementById('contact-form');
    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            showToast('✅ Message sent! We will get back to you soon.');
            form.reset();
        });
    }
}

// =====================================================
// SCROLL REVEAL — Intersection Observer
// =====================================================
function initScrollReveal() {
    const elements = document.querySelectorAll(
        '.reveal, .reveal-left, .reveal-right, .reveal-scale'
    );

    if (!elements.length) return;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.12, rootMargin: '0px 0px -50px 0px' });

    elements.forEach(el => observer.observe(el));
}

// =====================================================
// NAVBAR — scroll effect (add shadow)
// =====================================================
function initNavbarScroll() {
    const navbar = document.getElementById('main-navbar');
    if (!navbar) return;
    window.addEventListener('scroll', () => {
        if (window.scrollY > 40) navbar.classList.add('scrolled');
        else navbar.classList.remove('scrolled');
    }, { passive: true });
}

// =====================================================
// Everything kicks off here once page has fully loaded
// =====================================================
document.addEventListener('DOMContentLoaded', async () => {
    updateCartBadge();
    await setupAuth();
    initNavbarScroll();
    initScrollReveal();

    // Home page product sections
    if (document.getElementById('featured-products')) {
        renderProducts(window.products.slice(0, 4), 'featured-products');
        renderProducts(window.products.slice(4, 8), 'latest-products-1');
        renderProducts(window.products.slice(8, 12), 'latest-products-2');
    }

    setupProductsPage();
    setupProductDetail();

    // Only render cart if we're actually on the cart page
    if (document.getElementById('cart-items-container')) {
        renderCart();
    }

    setupContact();
});
