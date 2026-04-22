/**
 * ACEFASH — Checkout & Razorpay Payment Integration
 * 
 * ⚠️  IMPORTANT: Replace RAZORPAY_TEST_KEY below with your actual Test Key ID
 *     from https://dashboard.razorpay.com/ → Settings → API Keys
 *     It looks like: rzp_test_XXXXXXXXXXXXXXXX
 */

// ============================================================
// 🔑 REPLACE THIS WITH YOUR RAZORPAY TEST KEY
// ============================================================
const RAZORPAY_KEY = 'rzp_test_YOUR_KEY_HERE';
// ============================================================

let selectedPayMethod = 'upi';
let orderTotal = 0;

document.addEventListener('DOMContentLoaded', async () => {
    updateCartBadge();
    await setupAuth();
    renderCheckoutSummary();
    setupCheckoutForm();
});

// ----------------------------------------------------------
// Select payment method pill
// ----------------------------------------------------------
window.selectPayMethod = function(method) {
    selectedPayMethod = method;
    ['upi', 'card', 'netbanking', 'wallet'].forEach(m => {
        const el = document.getElementById(`pill-${m}`);
        if (el) el.classList.remove('active');
    });
    const active = document.getElementById(`pill-${method}`);
    if (active) active.classList.add('active');
};

// ----------------------------------------------------------
// Render order summary from cart
// ----------------------------------------------------------
function renderCheckoutSummary() {
    const cart = getCart();
    const listEl = document.getElementById('order-items-list');
    const totalsEl = document.getElementById('order-totals');
    const emptyEl = document.getElementById('order-empty');

    if (!listEl) return;

    if (cart.length === 0) {
        listEl.innerHTML = '';
        if (totalsEl) totalsEl.style.display = 'none';
        if (emptyEl) emptyEl.style.display = 'block';
        document.getElementById('pay-now-btn').disabled = true;
        document.getElementById('pay-now-btn').style.opacity = '0.5';
        return;
    }

    if (emptyEl) emptyEl.style.display = 'none';
    if (totalsEl) totalsEl.style.display = 'block';

    let subtotal = 0;
    let html = '';

    cart.forEach(item => {
        const product = (window.products || []).find(p => p.id === item.productId);
        if (!product) return;

        const itemTotal = product.price * item.quantity;
        subtotal += itemTotal;

        html += `
            <li class="order-item">
                <img src="${product.image}" alt="${product.name}" onerror="this.src='product-1.jpg'">
                <div class="order-item-info">
                    <div class="item-name">${product.name}</div>
                    <div class="item-meta">Qty: ${item.quantity} · Size: ${item.size || 'N/A'}</div>
                </div>
                <span class="item-price">Rs. ${itemTotal.toFixed(2)}</span>
            </li>
        `;
    });

    listEl.innerHTML = html;

    const tax = subtotal * 0.10;
    const total = subtotal + tax;
    orderTotal = total;

    const setEl = (id, val) => { const e = document.getElementById(id); if (e) e.textContent = val; };
    setEl('summary-subtotal', `Rs. ${subtotal.toFixed(2)}`);
    setEl('summary-tax', `Rs. ${tax.toFixed(2)}`);
    setEl('summary-total', `Rs. ${total.toFixed(2)}`);

    // Update pay button label
    const btnText = document.querySelector('#pay-now-btn .btn-text');
    if (btnText) {
        btnText.innerHTML = `<i class="fa fa-lock lock-icon"></i> Pay Rs. ${total.toFixed(2)}`;
    }
}

// ----------------------------------------------------------
// Validate form fields
// ----------------------------------------------------------
function validateForm() {
    const fields = [
        { id: 'first-name', label: 'First Name' },
        { id: 'last-name',  label: 'Last Name' },
        { id: 'checkout-email', label: 'Email', type: 'email' },
        { id: 'checkout-phone', label: 'Phone (10 digits)', type: 'phone' },
        { id: 'address-line', label: 'Address' },
        { id: 'city', label: 'City' },
        { id: 'pincode', label: 'PIN Code (6 digits)', type: 'pin' },
        { id: 'state', label: 'State' },
    ];

    let valid = true;

    fields.forEach(f => {
        const el = document.getElementById(f.id);
        if (!el) return;
        el.classList.remove('error');

        const val = el.value.trim();
        let fieldValid = val.length > 0;

        if (fieldValid && f.type === 'email') {
            fieldValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);
        }
        if (fieldValid && f.type === 'phone') {
            fieldValid = /^[6-9]\d{9}$/.test(val);
        }
        if (fieldValid && f.type === 'pin') {
            fieldValid = /^\d{6}$/.test(val);
        }

        if (!fieldValid) {
            el.classList.add('error');
            valid = false;
        }
    });

    if (!valid) {
        showToast('⚠️ Please fill all fields correctly');
    }

    return valid;
}

// ----------------------------------------------------------
// Checkout form submission → Razorpay
// ----------------------------------------------------------
function setupCheckoutForm() {
    const form = document.getElementById('checkout-address-form');
    if (!form) return;

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const cart = getCart();
        if (cart.length === 0) {
            showToast('Your cart is empty!');
            return;
        }

        if (!validateForm()) return;

        // Check login
        const user = getCurrentUser();
        if (!user) {
            showToast('⚠️ Please login before placing an order');
            setTimeout(() => { window.location.href = 'account.html'; }, 800);
            return;
        }

        const firstName = document.getElementById('first-name').value.trim();
        const lastName  = document.getElementById('last-name').value.trim();
        const email     = document.getElementById('checkout-email').value.trim();
        const phone     = document.getElementById('checkout-phone').value.trim();

        const btn = document.getElementById('pay-now-btn');
        btn.classList.add('loading');

        // Small delay for UX, then open Razorpay
        setTimeout(() => {
            openRazorpay({ firstName, lastName, email, phone });
        }, 600);
    });
}

// ----------------------------------------------------------
// Open Razorpay Checkout Modal
// ----------------------------------------------------------
function openRazorpay({ firstName, lastName, email, phone }) {
    const btn = document.getElementById('pay-now-btn');

    // Amount is in paise (multiply by 100)
    const amountInPaise = Math.round(orderTotal * 100);

    const options = {
        key: RAZORPAY_KEY,
        amount: amountInPaise,
        currency: 'INR',
        name: 'ACEFASH',
        description: 'Sports Gear Order',
        image: 'logo.png',
        prefill: {
            name:    `${firstName} ${lastName}`,
            email:   email,
            contact: phone,
        },
        notes: {
            address: document.getElementById('address-line').value.trim(),
            city:    document.getElementById('city').value.trim(),
            state:   document.getElementById('state').value,
            pincode: document.getElementById('pincode').value.trim(),
        },
        theme: {
            color: '#ff523b',
        },
        method: {
            upi:        selectedPayMethod === 'upi' || true,
            card:       selectedPayMethod === 'card' || true,
            netbanking: selectedPayMethod === 'netbanking' || true,
            wallet:     selectedPayMethod === 'wallet' || true,
            emi:        true,
        },
        // ✅ Payment Success
        handler: function(response) {
            btn.classList.remove('loading');
            handlePaymentSuccess(response);
        },
        // ❌ Modal closed / cancelled
        modal: {
            ondismiss: function() {
                btn.classList.remove('loading');
                showToast('Payment cancelled. Your cart is safe!');
            }
        }
    };

    // If Razorpay hasn't loaded (bad key / offline), show demo success
    if (typeof Razorpay === 'undefined') {
        btn.classList.remove('loading');
        showToast('⚠️ Razorpay not loaded — showing demo success');
        setTimeout(() => {
            handlePaymentSuccess({ razorpay_payment_id: 'DEMO_' + Date.now() });
        }, 800);
        return;
    }

    // If using placeholder key, show demo flow
    if (RAZORPAY_KEY === 'rzp_test_YOUR_KEY_HERE') {
        btn.classList.remove('loading');
        showToast('🔑 Demo mode: Replace RAZORPAY_KEY in checkout.js with your key!');
        setTimeout(() => {
            handlePaymentSuccess({ razorpay_payment_id: 'DEMO_' + Date.now() });
        }, 1200);
        return;
    }

    const rzp = new Razorpay(options);

    rzp.on('payment.failed', function(response) {
        btn.classList.remove('loading');
        showToast('❌ Payment failed: ' + (response.error.description || 'Please try again'));
        console.error('Razorpay Error:', response.error);
    });

    rzp.open();
}

// ----------------------------------------------------------
// Handle payment success → show overlay + confetti
// ----------------------------------------------------------
async function handlePaymentSuccess(response) {
    const paymentId = response.razorpay_payment_id || 'DEMO_' + Date.now();

    // Build order snapshot from cart + form fields
    const cart = getCart();
    const orderItems = cart.map(item => {
        const product = (window.products || []).find(p => p.id === item.productId);
        return {
            productId: item.productId,
            title:     product ? product.name  : 'Unknown Product',
            image:    product ? product.image : 'product-1.jpg',
            price:    product ? product.price : 0,
            quantity: item.quantity,
            size:     item.size || 'N/A'
        };
    });

    const subtotal = orderItems.reduce((s, i) => s + i.price * i.quantity, 0);
    const tax      = subtotal * 0.10;
    const total    = subtotal + tax;
    const shippingAddress = {
        firstName: (document.getElementById('first-name') || {}).value || '',
        lastName: (document.getElementById('last-name') || {}).value || '',
        email: (document.getElementById('checkout-email') || {}).value || '',
        phone: (document.getElementById('checkout-phone') || {}).value || '',
        addressLine: (document.getElementById('address-line') || {}).value || '',
        city: (document.getElementById('city') || {}).value || '',
        state: (document.getElementById('state') || {}).value || '',
        pincode: (document.getElementById('pincode') || {}).value || ''
    };

    let savedOrder = null;
    try {
        if (typeof window.createStorefrontOrderOnServer !== 'function') {
            throw new Error('Order API helper missing');
        }

        savedOrder = await window.createStorefrontOrderOnServer({
            items: orderItems,
            shippingAddress,
            paymentMethod: selectedPayMethod,
            paymentStatus: 'paid',
            paymentId,
            frontendTotals: {
                subtotal,
                tax,
                total,
            },
        });
    } catch (error) {
        showToast('❌ Order was paid but failed to save on server. Please contact support.');
        console.error('Order save error:', error);
        return;
    }

    // Clear cart
    localStorage.setItem('cart', JSON.stringify([]));
    updateCartBadge();

    // Update success overlay
    const oidEl = document.getElementById('success-order-id');
    if (oidEl) oidEl.textContent = 'Order ID: ' + (savedOrder.orderNumber || savedOrder._id || 'N/A');
    const pidEl = document.getElementById('success-payment-id');
    if (pidEl) pidEl.textContent = 'Payment ID: ' + paymentId;

    // Show overlay
    const overlay = document.getElementById('success-overlay');
    if (overlay) {
        overlay.classList.add('show');
        const check = overlay.querySelector('.success-check');
        if (check) {
            check.style.strokeDashoffset = '200';
            setTimeout(() => { check.style.strokeDashoffset = '0'; }, 100);
        }
    }

    launchConfetti();
}

// ----------------------------------------------------------
// Confetti animation
// ----------------------------------------------------------
function launchConfetti() {
    const container = document.getElementById('confetti-container');
    if (!container) return;

    const colors = ['#ff523b', '#ff7a68', '#ffd6d6', '#1a1a2e', '#fff', '#ffb347', '#87ceeb'];
    const count = 120;

    for (let i = 0; i < count; i++) {
        setTimeout(() => {
            const piece = document.createElement('div');
            piece.classList.add('confetti-piece');

            const size = Math.random() * 10 + 6;
            const color = colors[Math.floor(Math.random() * colors.length)];
            const left = Math.random() * 100;
            const duration = Math.random() * 2.5 + 2;
            const delay = Math.random() * 1.5;
            const rotation = Math.random() * 360;
            const shape = Math.random() > 0.5 ? '50%' : '0%';

            piece.style.cssText = `
                left: ${left}%;
                width: ${size}px;
                height: ${size}px;
                background: ${color};
                border-radius: ${shape};
                animation: confettiFall ${duration}s ${delay}s linear forwards;
                transform: rotate(${rotation}deg);
            `;

            container.appendChild(piece);

            // Clean up after animation
            setTimeout(() => piece.remove(), (duration + delay + 0.5) * 1000);
        }, i * 10);
    }
}
