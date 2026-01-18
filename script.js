import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getFirestore, collection, onSnapshot } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyCYLMXUCC6t-zT4CeFHBG7OMMwUNDhA8i0",
    authDomain: "ananmanan-2412c.firebaseapp.com",
    projectId: "ananmanan-2412c",
    storageBucket: "ananmanan-2412c.firebasestorage.app",
    messagingSenderId: "244268274543",
    appId: "1:244268274543:web:10d1e2ccb230d660d8ce9a",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

let products = [];
let cart = [];
const shippingFee = 0;

function loadLiveProducts() {
    const shopGrid = document.querySelector('.shop-grid');
    if (!shopGrid) return;

    // Detection logic
    const path = window.location.pathname.toLowerCase();
    let filterCategory = "";
    if (path.includes("men.html")) filterCategory = "Men";
    else if (path.includes("women.html")) filterCategory = "Women";
    else if (path.includes("acc.html")) filterCategory = "Accessories";

    onSnapshot(collection(db, "products"), (snapshot) => {
        products = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        
        let displayProducts = filterCategory 
            ? products.filter(p => p.category === filterCategory) 
            : products;

        if (displayProducts.length === 0) {
            shopGrid.innerHTML = `<p style="text-align:center; color:#666;">No products found in category: ${filterCategory}</p>`;
        } else {
            shopGrid.innerHTML = displayProducts.map(p => `
                <div class="product-card" onclick="openProductModal('${p.name.replace(/'/g, "\\'")}', ${p.price}, ${JSON.stringify(p.images).replace(/"/g, '&quot;')}, '${p.code}')">
                    <div class="image-box">
                        <img src="${p.images ? p.images[0] : ''}" alt="${p.name}">
                    </div>
                    <div class="info">
                        <h3>${p.name}</h3>
                        <div class="price">Rs. ${p.price}</div>
                    </div>
                </div>
            `).join('');
        }
    });
}

// FIXED: Added 'e' for event to prevent the "undefined target" crash
window.addToCart = function(name, price, sizeId, code, e) {
    const sizeSelect = document.getElementById(sizeId);
    const size = sizeSelect ? sizeSelect.value : "";
    if (!size) { alert("Please select a size first!"); return; }

    cart.push({ name, price, size, code, id: Date.now() });
    updateCartUI();

    // Fix button animation
    const btn = e ? e.target : (window.event ? window.event.target : null);
    if (btn) {
        const oldText = btn.innerText;
        btn.innerText = "ADDED!";
        setTimeout(() => btn.innerText = oldText, 1000);
    }
    if (sizeId !== "modalSize") toggleCart();
};

window.openProductModal = function(name, price, images, code) {
    const modal = document.getElementById("productModal");
    document.getElementById("modalTitle").innerText = name;
    document.getElementById("modalPrice").innerText = "Rs. " + price;
    document.getElementById("modalCode").innerText = code;
    
    const mainImg = document.getElementById("mainModalImg");
    mainImg.src = images[0];
    
    const thumbStrip = document.getElementById("thumbStrip");
    thumbStrip.innerHTML = images.map(src => `<img src="${src}" class="modal-thumb" onclick="document.getElementById('mainModalImg').src='${src}'">`).join('');

    // FIXED: Correctly pass the click event
    document.getElementById("modalAddBtn").onclick = (e) => addToCart(name, price, "modalSize", code, e);
    modal.classList.add("active");
};

window.removeItem = (id) => { cart = cart.filter(i => i.id !== id); updateCartUI(); };
window.toggleCart = () => document.getElementById("cartDrawer").classList.toggle("open");
window.closeModal = () => document.getElementById("productModal").classList.remove("active");

function updateCartUI() {
    const count = document.getElementById("cart-count");
    if (count) count.innerText = cart.length;
    const container = document.getElementById("cartItems");
    if (!container) return;
    container.innerHTML = cart.map(item => `
        <div class="cart-item">
            <div><h4>${item.name}</h4><small>${item.size} | ${item.code}</small><p>Rs. ${item.price}</p></div>
            <button onclick="removeItem(${item.id})" class="remove-btn">✕</button>
        </div>`).join("");
    const sub = cart.reduce((s, i) => s + i.price, 0);
    document.getElementById("subtotal").innerText = sub;
    document.getElementById("totalPrice").innerText = sub + shippingFee;
}

window.addEventListener("load", () => { loadLiveProducts(); updateCartUI(); });
