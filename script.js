/* ===================== GLOBAL VARIABLES ===================== */
const products = [
  { name: 'Strange-Things', price: 4500, images: ['i/v.png', 'i/v.png', 'i/v.png'], code: 'Strange-Things' },
  { name: 'Solo-Leveling', price: 4350, images: ['i/v (2).jpg', 'i/v (2).jpg', 'i/v (2).jpg'], code: 'Solo-Leveling 1' },
  { name: 'Solo-Leveling', price: 4350, images: ['i/v (3).jpg', 'i/v (3).jpg', 'i/v (3).jpg'], code: 'Solo-Leveling 2' },
  { name: 'Samurai', price: 2950, images: ['i/c (15).jpg', 'i/c (15).jpg', 'i/c (15).jpg'], code: 'AM09' },
  { name: 'Samurai', price: 2950, images: ['i/c (16).jpg', 'i/c (16).jpg', 'i/c (16).jpg'], code: 'AM01' },
  { name: 'Naruto', price: 2800, images: ['i/c (17).jpg', 'i/c (17).jpg', 'i/c (17).jpg'], code: 'AM03' },
  { name: 'Naruto', price: 2800, images: ['i/c (18).jpg', 'i/c (18).jpg', 'i/c (18).jpg'], code: 'AM10' },
  { name: 'k-samurai', price: 2800, images: ['i/c (19).jpg', 'i/c (19).jpg', 'i/c (19).jpg'], code: 'AM04' },
  { name: 'Pink-Panther', price: 2850, images: ['i/c (11).jpg', 'i/c (11).jpg', 'i/c (11).jpg'], code: 'AM11' },
  { name: 'Pink-Panther', price: 2850, images: ['i/c (12).jpg', 'i/c (12).jpg', 'i/c (12).jpg'], code: 'AM012' },
  { name: 'Pink-Panther', price: 2850, images: ['i/c (13).jpg', 'i/c (13).jpg', 'i/c (13).jpg'], code: 'AM05' },
  { name: 'East-Coast', price: 3250, images: ['i/c (9).jpg', 'i/c (9).jpg', 'i/c (9).jpg'], code: 'AM06' },
  { name: 'Tote-bag', price: 1500, images: ['i/ddd.png', 'i/ddd.png', 'i/ddd.png'], code: 'AM08' }
];
const cursor = document.getElementById('custom-cursor');
const dot = document.getElementById('cursor-dot');
const grid = document.getElementById("shopGrid");
let slides = document.querySelectorAll(".slide");
let slideIndex = 0; 
let cart = [];
const shippingFee = 0;

/* ===================== CUSTOM CURSOR ===================== */
document.addEventListener('mousemove', (e) => {
    if (cursor && dot) {
        cursor.style.left = e.clientX + 'px';
        cursor.style.top = e.clientY + 'px';
        dot.style.left = e.clientX + 'px';
        dot.style.top = e.clientY + 'px';
    }
});

const interactiveElements = document.querySelectorAll('button, a, .product-card, select');
interactiveElements.forEach(el => {
    el.addEventListener('mouseenter', () => cursor.classList.add('cursor-grow'));
    el.addEventListener('mouseleave', () => cursor.classList.remove('cursor-grow'));
});

/* ===================== HERO SLIDER ===================== */
setInterval(() => {
    if (slides.length > 0) {
        slides[slideIndex].classList.remove("active");
        slideIndex = (slideIndex + 1) % slides.length;
        slides[slideIndex].classList.add("active");
    }
}, 4000);

/* ===================== VISION TYPEWRITER ===================== */
const visionText = "Ananmanan is more than a clothing brand\n\" it’s a lifestyle for travelers, dreamers, and adventurers. Our collections blend modern streetwear with bold, futuristic designs, crafted for comfort, versatility, and self-expression. Every piece is made to move with you—whether exploring cities, chasing sunsets, or creating unforgettable memories. We celebrate individuality, freedom, and the thrill of the journey. Ananmanan empowers you to stand out, embrace your path, and share your story with the world. Step into style that reflects your bold spirit and limitless adventures...";

let visionIndex = 0; 
const typingSpeed = 40; 

function typeVision() {
    const container = document.getElementById("typewriter-paragraph");
    if (container && visionIndex < visionText.length) {
        container.innerHTML += visionText.charAt(visionIndex);
        visionIndex++;
        setTimeout(typeVision, typingSpeed);
    }
}

/* ===================== INITIALIZATION ===================== */
window.addEventListener('load', () => {
    setTimeout(typeVision, 500);
    updateCartUI();
});

/* ===================== CART LOGIC ===================== */
function toggleCart() {
    document.getElementById("cartDrawer").classList.toggle("open");
}

function addToCart(name, price, sizeId, code) {
    const sizeSelect = document.getElementById(sizeId);
    const size = sizeSelect.value;

    if (!size) {
        alert("Please select a size first!");
        return;
    }

    const item = { name, price, size, code, id: Date.now() };
    cart.push(item);
    updateCartUI();

    if (event && event.target) {
        const originalText = event.target.innerText;
        event.target.innerText = "ADDED!";
        setTimeout(() => { event.target.innerText = originalText; }, 1000);
    }

    if (sizeId !== 'modalSize') toggleCart();
    sizeSelect.selectedIndex = 0;
}

function removeItem(id) {
    cart = cart.filter(item => item.id !== id);
    updateCartUI();
}

function updateCartUI() {
    const cartCount = document.getElementById('cart-count');
    const cartItemsContainer = document.getElementById('cartItems');
    const subtotalEl = document.getElementById('subtotal');
    const totalEl = document.getElementById('totalPrice');

    if (cartCount) cartCount.innerText = cart.length;
    if (!cartItemsContainer) return;

    cartItemsContainer.innerHTML = cart.map(item => `
        <div class="cart-item">
            <div>
                <h4>${item.name}</h4>
                <small>Size: ${item.size} | Code: ${item.code}</small>
                <p>Rs. ${item.price}</p>
            </div>
            <button onclick="removeItem(${item.id})" class="remove-btn">✕</button>
        </div>
    `).join('');

    const subtotal = cart.reduce((sum, item) => sum + item.price, 0);
    if (subtotalEl) subtotalEl.innerText = subtotal;
    if (totalEl) totalEl.innerText = subtotal + shippingFee;
}

/* ===================== UPDATED CHECKOUT FUNCTION ===================== */
function checkoutWhatsApp() {
    // 1. Validate Cart
    if (cart.length === 0) {
        alert("Your cart is empty!");
        return;
    }

    // 2. Get Customer Details from the inputs
    const name = document.getElementById('custName').value.trim();
    const phone = document.getElementById('custPhone').value.trim();
    const city = document.getElementById('custCity').value.trim();
    const address = document.getElementById('custAddress').value.trim();

    // 3. Validate Details
    if (!name || !phone || !address) {
        alert("Please fill in your Delivery Details (Name, Phone, and Address) inside the cart first!");
        return;
    }

    // 4. Format the Items List
    let itemDetails = cart.map((item, i) => 
        `${i + 1}. ${item.name} (${item.code})\n   Size: ${item.size} - Rs.${item.price}`
    ).join('\n\n');

    const total = document.getElementById('totalPrice').innerText;

    // 5. Build the Message String
    let messageText = `*NEW ORDER REQUEST*\n\n` +
                      `*Customer Details:*\n` +
                      `Name: ${name}\n` +
                      `Phone: ${phone}\n` +
                      `City: ${city}\n` +
                      `Address: ${address}\n\n` +
                      `*Ordered Items:*\n${itemDetails}\n\n` +
                      `*TOTAL AMOUNT: Rs. ${total}*`;

    // 6. Send to WhatsApp
    const whatsappNumber = "94719478895"; 
    const encodedMessage = encodeURIComponent(messageText);
    window.open(`https://wa.me/${whatsappNumber}?text=${encodedMessage}`, "_blank");
}

/* ===================== PRODUCT MODAL ===================== */
function openProductModal(name, price, images, code) {
    const modal = document.getElementById('productModal');
    const mainImg = document.getElementById('mainModalImg');
    const thumbStrip = document.getElementById('thumbStrip');

    document.getElementById('modalTitle').innerText = name;
    document.getElementById('modalPrice').innerText = "Rs. " + price;
    document.getElementById('modalCode').innerText = code;

    mainImg.src = images[0];
    mainImg.style.opacity = '1';

    thumbStrip.innerHTML = '';
    images.forEach(imgSrc => {
        const thumb = document.createElement('img');
        thumb.src = imgSrc;
        thumb.className = 'modal-thumb';
        thumb.onclick = () => swapImg(imgSrc);
        thumbStrip.appendChild(thumb);
    });

    const modalAddBtn = document.getElementById('modalAddBtn');
    modalAddBtn.onclick = () => addToCart(name, price, 'modalSize', code);

    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function swapImg(src) {
    const mainImg = document.getElementById('mainModalImg');
    mainImg.style.opacity = '0.4';
    setTimeout(() => {
        mainImg.src = src;
        mainImg.style.opacity = '1';
    }, 150);
}

function closeModal() {
    document.getElementById('productModal').classList.remove('active');
    document.body.style.overflow = 'auto';
}

/* ===================== MOBILE MENU ===================== */
function toggleMenu() {
    const nav = document.getElementById('navLinks');
    if (nav) nav.classList.toggle('active');
}

/* ===================== SEARCH SYSTEM ===================== */
const searchInput = document.getElementById("productSearch");
const searchResults = document.getElementById("searchResults");

if (searchInput) {
    searchInput.addEventListener("input", () => {
        const query = searchInput.value.toLowerCase().trim();
        if (!searchResults) return;
        searchResults.innerHTML = "";

        if (!query) {
            searchResults.classList.remove("active");
            return;
        }

        const matches = products.filter(p => p.name.toLowerCase().includes(query));

        matches.forEach(product => {
            const item = document.createElement("div");
            item.className = "search-item";
            item.innerText = product.name;
            item.onclick = () => {
                openProductModal(product.name, product.price, product.images, product.code);
                searchResults.classList.remove("active");
                searchInput.value = "";
            };
            searchResults.appendChild(item);
        });

        searchResults.classList.add("active");
    });
}