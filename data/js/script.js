// ===========================
// 🛍️ MyShop Main Script
// ===========================

// Load products into products.html
document.addEventListener("DOMContentLoaded", () => {
  if (document.getElementById("product-list")) {
    loadProducts();
  }

  if (document.getElementById("cart-items")) {
    loadCart();
  }

  updateCartCount();
});

// ===========================
// 📦 Load Products
// ===========================
function loadProducts() {
  fetch("data/js/products.json")
    .then((response) => response.json())
    .then((products) => {
      const productList = document.getElementById("product-list");

      products.forEach((product) => {
        const productCard = document.createElement("div");
        productCard.classList.add("product");

        productCard.innerHTML = `
          <img src="${product.image}" alt="${product.name}">
          <h3>${product.name}</h3>
          <p>$${product.price}</p>
          <button class="add-to-cart" data-id="${product.id}">Add to Cart</button>
        `;

        productList.appendChild(productCard);
      });

      // Add event listeners to all "Add to Cart" buttons
      document.querySelectorAll(".add-to-cart").forEach((button) => {
        button.addEventListener("click", (e) => {
          const id = parseInt(e.target.dataset.id);
          addToCart(id);
        });
      });
    })
    .catch((err) => console.error("Error loading products:", err));
}

// ===========================
// 🛒 Add to Cart
// ===========================
function addToCart(id) {
  fetch("data/js/products.json")
    .then((response) => response.json())
    .then((products) => {
      const product = products.find((item) => item.id === id);

      let cart = JSON.parse(localStorage.getItem("cart")) || [];

      const existing = cart.find((item) => item.id === id);
      if (existing) {
        existing.quantity += 1;
      } else {
        cart.push({ ...product, quantity: 1 });
      }

      localStorage.setItem("cart", JSON.stringify(cart));
      updateCartCount();

      alert(`${product.name} added to cart ✅`);
    });
}

// ===========================
// 🧮 Load Cart (on cart.html)
// ===========================
function loadCart() {
  const cartItemsDiv = document.getElementById("cart-items");
  const cartTotal = document.getElementById("cart-total");

  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  cartItemsDiv.innerHTML = "";

  if (cart.length === 0) {
    cartItemsDiv.innerHTML = "<p>Your cart is empty.</p>";
    cartTotal.textContent = "Total: $0";
    return;
  }

  let total = 0;
  cart.forEach((item, index) => {
    total += item.price * item.quantity;

    const div = document.createElement("div");
    div.classList.add("cart-item");
    div.innerHTML = `
      <img src="${item.image}" alt="${item.name}">
      <div>
        <h4>${item.name}</h4>
        <p>Ksh${item.price} × ${item.quantity}</p>
      </div>
      <div>
        <button class="remove-btn" onclick="removeItem(${index})">Remove</button>
      </div>
    `;
    cartItemsDiv.appendChild(div);
  });

  cartTotal.textContent = `Total: Ksh${total.toFixed(2)}`;
}

// ===========================
// ❌ Remove item from Cart
// ===========================
function removeItem(index) {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  cart.splice(index, 1);
  localStorage.setItem("cart", JSON.stringify(cart));
  loadCart();
  updateCartCount();
}

// ===========================
// 🔢 Update Cart Count
// ===========================
function updateCartCount() {
  const countSpan = document.querySelector(".cart-count");
  if (!countSpan) return;

  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  let totalCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  countSpan.textContent = totalCount;
}
// --- Product search filter ---
const searchInput = document.getElementById('searchInput');

if (searchInput) {
  searchInput.addEventListener('keyup', function () {
    const searchTerm = searchInput.value.toLowerCase().trim();
    const productCards = document.querySelectorAll('.product-card');

    productCards.forEach(card => {
      const productName = card.getAttribute('data-name').toLowerCase();
      if (productName.includes(searchTerm)) {
        card.style.display = ''; // restore CSS layout instead of forcing 'block'
      } else {
        card.style.display = 'none'; // hide non-matching products
      }
    });
  });
}



