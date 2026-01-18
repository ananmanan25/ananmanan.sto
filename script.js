import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getFirestore, collection, onSnapshot } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// 1. YOUR FIREBASE CONFIG
const firebaseConfig = {
    apiKey: "AIzaSyCYLMXUCC6t-zT4CeFHBG7OMMwUNDhA8i0",
    authDomain: "ananmanan-2412c.firebaseapp.com",
    projectId: "ananmanan-2412c",
    storageBucket: "ananmanan-2412c.firebasestorage.app",
    messagingSenderId: "244268274543",
    appId: "1:244268274543:web:10d1e2ccb230d660d8ce9a",
};

// 2. INITIALIZE FIREBASE
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// 3. LIVE PRODUCT LOADING
let products = [];

function loadLiveProducts() {
    const shopGrid = document.querySelector('.shop-grid');
    if (!shopGrid) return;

    // Detect Category based on filename
    const path = window.location.pathname.toLowerCase();
    let filterCategory = "";
    if (path.includes("men.html")) filterCategory = "Men";
    else if (path.includes("women.html")) filterCategory = "Women";
    else if (path.includes("acc.html")) filterCategory = "Accessories";

    // This listens for changes in your Firebase Database
    onSnapshot(collection(db, "products"), (snapshot) => {
        products = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        
        // Filter based on the category you set in Firebase Console
        let displayProducts = filterCategory 
            ? products.filter(p => p.category === filterCategory) 
            : products;

        shopGrid.innerHTML = displayProducts.map(p => `
            <div class="product-card" onclick="openProductModal('${p.name.replace(/'/g, "\\'")}', ${p.price}, ${JSON.stringify(p.images).replace(/"/g, '&quot;')}, '${p.code}')">
                <div class="image-box">
                    <img src="${p.images[0]}" alt="${p.name}">
                </div>
                <div class="info">
                    <h3>${p.name}</h3>
                    <div class="price">Rs. ${p.price}</div>
                </div>
            </div>
        `).join('');
    });
}

/* ===================== GLOBAL VARIABLES ===================== */
const cursor = document.getElementById("custom-cursor");
const dot = document.getElementById("cursor-dot");
let slides = document.querySelectorAll(".slide");
let slideIndex = 0;
let cart = [];
const shippingFee = 0;

/* ===================== CUSTOM CURSOR ===================== */
document.addEventListener("mousemove", (e) => {
  if (cursor && dot) {
    cursor.style.left = e.clientX + "px";
    cursor.style.top = e.clientY + "px";
    dot.style.left = e.clientX + "px";
    dot.style.top = e.clientY + "px";
  }
});

/* ===================== HERO SLIDER ===================== */
if (slides.length > 0) {
    setInterval(() => {
        slides[slideIndex].classList.remove("active");
        slideIndex = (slideIndex + 1) % slides.length;
        slides[slideIndex].classList.add("active");
    }, 4000);
}

/* ===================== INITIALIZATION ===================== */
window.addEventListener("load", () => {
  loadLiveProducts(); 
  updateCartUI();
});

/* ===================== CART LOGIC ===================== */
window.toggleCart = function() {
  document.getElementById("cartDrawer").classList.toggle("open");
}

window.addToCart = function(name, price, sizeId, code, event) {
  const sizeSelect = document.getElementById(sizeId);
  const size = sizeSelect.value;
  if (!size) { alert("Please select a size first!"); return; }

  const item = { name, price, size, code, id: Date.now() };
  cart.push(item);
  updateCartUI();

  // Animation Fix
  const btn = event ? event.target : (window.event ? window.event.target : null);
  if (btn) {
    const originalText = btn.innerText;
    btn.innerText = "ADDED!";
    setTimeout(() => { btn.innerText = originalText; }, 1000);
  }
  
  if (sizeId !== "modalSize") toggleCart();
  sizeSelect.selectedIndex = 0;
}

window.removeItem = function(id) {
  cart = cart.filter((item) => item.id !== id);
  updateCartUI();
}

function updateCartUI() {
  const cartCount = document.getElementById("cart-count");
  const cartItemsContainer = document.getElementById("cartItems");
  const subtotalEl = document.getElementById("subtotal");
  const totalEl = document.getElementById("totalPrice");

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
    `).join("");

  const subtotal = cart.reduce((sum, item) => sum + item.price, 0);
  if (subtotalEl) subtotalEl.innerText = subtotal;
  if (totalEl) totalEl.innerText = subtotal + shippingFee;
}

/* ===================== CHECKOUT ===================== */
window.checkoutWhatsApp = function() {
  if (cart.length === 0) { alert("Your cart is empty!"); return; }

  const name = document.getElementById("custName").value.trim();
  const phone = document.getElementById("custPhone").value.trim();
  const city = document.getElementById("custCity").value.trim();
  const address = document.getElementById("custAddress").value.trim();

  if (!name || !phone || !address) {
    alert("Please fill in Delivery Details inside the cart!");
    return;
  }

  let itemDetails = cart.map((item, i) => 
    `${i + 1}. ${item.name} (${item.code})\n Size: ${item.size} - Rs.${item.price}`).join("\n\n");

  const total = document.getElementById("totalPrice").innerText;
  let messageText = `*NEW ORDER REQUEST*\n\n*Customer:*\nName: ${name}\nPhone: ${phone}\nCity: ${city}\nAddress: ${address}\n\n*Items:*\n${itemDetails}\n\n*TOTAL: Rs. ${total}*`;

  const whatsappNumber = "94719478895";
  window.open(`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(messageText)}`, "_blank");
}

/* ===================== PRODUCT MODAL ===================== */
window.openProductModal = function(name, price, images, code) {
  const modal = document.getElementById("productModal");
  const mainImg = document.getElementById("mainModalImg");
  const thumbStrip = document.getElementById("thumbStrip");

  document.getElementById("modalTitle").innerText = name;
  document.getElementById("modalPrice").innerText = "Rs. " + price;
  document.getElementById("modalCode").innerText = code;

  mainImg.src = images[0];
  thumbStrip.innerHTML = "";
  images.forEach((imgSrc) => {
    const thumb = document.createElement("img");
    thumb.src = imgSrc;
    thumb.className = "modal-thumb";
    thumb.onclick = () => { mainImg.src = imgSrc; };
    thumbStrip.appendChild(thumb);
  });

  document.getElementById("modalAddBtn").onclick = (e) => addToCart(name, price, "modalSize", code, e);
  modal.classList.add("active");
  document.body.style.overflow = "hidden";
}

window.closeModal = function() {
  document.getElementById("productModal").classList.remove("active");
  document.body.style.overflow = "auto";
}

window.toggleMenu = function() {
  const nav = document.getElementById("navLinks");
  if (nav) nav.classList.toggle("active");
}

window.toggleSizeChart = function() {
  const chart = document.getElementById("sizeChartContainer");
  if (chart) chart.classList.toggle("active");
}
