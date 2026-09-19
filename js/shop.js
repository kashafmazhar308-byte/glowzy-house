// ==========================================
// Glowzy House - Shop JS
// Cart + Wishlist + Search + Sort + Categories
// ==========================================
(function () {
  "use strict";

  const CART_KEY = "cart";
  const WISHLIST_KEY = "wishlist";

  const read = (key) => {
    try {
      const value = JSON.parse(localStorage.getItem(key));
      return Array.isArray(value) ? value : [];
    } catch (error) {
      return [];
    }
  };

  const write = (key, value) => {
    localStorage.setItem(key, JSON.stringify(value));
  };

  function getCartCount() {
    return read(CART_KEY).reduce(
      (total, item) => total + Number(item.quantity || 1),
      0
    );
  }

  function updateCounters() {
    document.querySelectorAll(".cart-count").forEach((el) => {
      el.textContent = getCartCount();
    });

    document.querySelectorAll(".wishlist-count").forEach((el) => {
      el.textContent = read(WISHLIST_KEY).length;
    });
  }

  function showToast(message) {
    let toast = document.getElementById("toast");

    if (!toast) {
      toast = document.createElement("div");
      toast.id = "toast";
      toast.className = "toast";
      document.body.appendChild(toast);
    }

    toast.textContent = message;
    toast.classList.add("show");

    clearTimeout(window.glowzyToastTimer);
    window.glowzyToastTimer = setTimeout(() => {
      toast.classList.remove("show");
    }, 1800);
  }

  function getProductFromCard(card) {
    if (!card) return null;

    const button = card.querySelector(".cart-btn");

    const name =
      button?.dataset.name ||
      card.dataset.name ||
      card.querySelector("h3")?.textContent.trim() ||
      "Gift";

    const priceText =
      button?.dataset.price ||
      card.querySelector("h4")?.textContent.replace(/[^\d.]/g, "") ||
      "0";

    const image =
      button?.dataset.image ||
      card.querySelector(".product-image img")?.getAttribute("src") ||
      "";

    return {
      name: name.trim(),
      price: Number(priceText) || 0,
      image: image,
      quantity: 1
    };
  }

  function addToCart(product) {
    const cart = read(CART_KEY);
    const existing = cart.find((item) => item.name === product.name);

    if (existing) {
      existing.quantity = Number(existing.quantity || 1) + 1;
    } else {
      cart.push(product);
    }

    write(CART_KEY, cart);
    updateCounters();
    showToast(product.name + " added to cart ✓");
  }

  function toggleWishlist(product, heart) {
    const wishlist = read(WISHLIST_KEY);
    const index = wishlist.findIndex((item) => item.name === product.name);

    if (index >= 0) {
      wishlist.splice(index, 1);
      write(WISHLIST_KEY, wishlist);
      showToast("Removed from wishlist");
    } else {
      wishlist.push(product);
      write(WISHLIST_KEY, wishlist);
      showToast("Added to wishlist ❤️");
    }

    updateCounters();
    syncHeart(heart, product.name);
  }

  function syncHeart(heart, productName) {
    if (!heart) return;

    const exists = read(WISHLIST_KEY).some(
      (item) => item.name === productName
    );

    // script.js also handles the icon classes. This only runs after its
    // click handler so the final visual state matches localStorage.
    setTimeout(() => {
      heart.classList.toggle("fa-solid", exists);
      heart.classList.toggle("fa-regular", !exists);
      heart.classList.toggle("active", exists);
    }, 0);
  }

  function syncAllHearts() {
    document.querySelectorAll(".wishlist").forEach((heart) => {
      const card = heart.closest(".product-card");
      const product = getProductFromCard(card);
      if (product) syncHeart(heart, product.name);
    });
  }

  // Cart + wishlist clicks
  document.addEventListener("click", function (event) {
    const cartButton = event.target.closest(".cart-btn");
    const heart = event.target.closest(".wishlist");

    if (cartButton) {
      event.preventDefault();
      const card = cartButton.closest(".product-card");
      const product = getProductFromCard(card);
      if (product) addToCart(product);
      return;
    }

    if (heart) {
      event.preventDefault();
      const card = heart.closest(".product-card");
      const product = getProductFromCard(card);

      if (product) {
        // Prevent script.js from causing a second visual toggle only;
        // the actual saved state is controlled here.
        toggleWishlist(product, heart);
      }
      return;
    }

    const viewButton = event.target.closest(".view-btn");
    if (viewButton) {
      event.preventDefault();

      const card = viewButton.closest(".product-card");
      const product = getProductFromCard(card);
      const modal = document.getElementById("productModal");

      if (!card || !modal || !product) return;

      const img = document.getElementById("modal-img");
      const title = document.getElementById("modal-title");
      const price = document.getElementById("modal-price");
      const desc = document.getElementById("modal-desc");
      const items = document.getElementById("modal-items");
      const delivery = document.getElementById("modal-delivery");
      const occasion = document.getElementById("modal-occasion");

      if (img) img.src = product.image;
      if (title) title.textContent = product.name;
      if (price) price.textContent = "Rs. " + product.price.toLocaleString();
      if (desc) desc.textContent = "A beautifully prepared Glowzy House gift, packed with care.";
      if (items) items.innerHTML = "<li>Premium gift presentation</li><li>Beautiful packaging</li><li>Personalized touch available</li>";
      if (delivery) delivery.textContent = "Lahore delivery available. Please order at least 2 days in advance.";
      if (occasion) occasion.textContent = card.dataset.category || "Special occasions";

      modal.classList.add("active");
    }

    if (event.target.closest(".close-modal")) {
      document.getElementById("productModal")?.classList.remove("active");
    }
  });

  // Search
  const searchInput = document.getElementById("searchInput");

  function filterProducts() {
    const query = (searchInput?.value || "").trim().toLowerCase();

    document.querySelectorAll(".product-card").forEach((card) => {
      const text = card.textContent.toLowerCase();
      const matches = !query || text.includes(query);
      card.style.display = matches ? "" : "none";
    });
  }

  searchInput?.addEventListener("input", filterProducts);

  // Categories
  document.querySelectorAll(".shop-categories button").forEach((button) => {
    button.addEventListener("click", function () {
      document
        .querySelectorAll(".shop-categories button")
        .forEach((btn) => btn.classList.remove("active"));

      this.classList.add("active");

      const category = this.textContent.trim().toLowerCase();

      document.querySelectorAll(".product-card").forEach((card) => {
        const categories = (card.dataset.category || "").toLowerCase();
        card.style.display =
          category === "all" || categories.includes(category) ? "" : "none";
      });
    });
  });

  // Sort
  const sortSelect = document.getElementById("sortProducts");
  const grid = document.querySelector(".product-grid");

  sortSelect?.addEventListener("change", function () {
    if (!grid) return;

    const cards = Array.from(grid.querySelectorAll(".product-card"));

    cards.sort((a, b) => {
      const aProduct = getProductFromCard(a);
      const bProduct = getProductFromCard(b);

      switch (this.value) {
        case "low-high":
          return aProduct.price - bProduct.price;
        case "high-low":
          return bProduct.price - aProduct.price;
        case "az":
          return aProduct.name.localeCompare(bProduct.name);
        case "za":
          return bProduct.name.localeCompare(aProduct.name);
        default:
          return 0;
      }
    });

    cards.forEach((card) => grid.appendChild(card));
  });

  // Close modal when clicking outside
  document.addEventListener("click", function (event) {
    const modal = document.getElementById("productModal");

    if (
      modal &&
      event.target === modal
    ) {
      modal.classList.remove("active");
    }
  });

  window.addEventListener("storage", updateCounters);

  document.addEventListener("DOMContentLoaded", function () {
    updateCounters();
    syncAllHearts();
  });
})();
