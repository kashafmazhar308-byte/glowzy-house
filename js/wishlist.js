// ==========================================
// Glowzy House - Wishlist JS
// ==========================================

(function () {
  "use strict";

  const CART_KEY = "cart";
  const WISHLIST_KEY = "wishlist";

  // ==========================================
  // STORAGE HELPERS
  // ==========================================

  function get(key) {
    try {
      const value = JSON.parse(localStorage.getItem(key));
      return Array.isArray(value) ? value : [];
    } catch (error) {
      console.error(`Storage read error: ${key}`, error);
      return [];
    }
  }

  function save(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
  }

  // ==========================================
  // COUNTERS
  // ==========================================

  function updateCounters() {
    const cart = get(CART_KEY);
    const wishlist = get(WISHLIST_KEY);

    const cartCount = cart.reduce(
      (sum, item) => sum + Number(item.quantity || 1),
      0,
    );

    document.querySelectorAll(".cart-count").forEach((el) => {
      el.textContent = cartCount;
    });

    document.querySelectorAll(".wishlist-count").forEach((el) => {
      el.textContent = wishlist.length;
    });
  }

  // ==========================================
  // TOAST
  // ==========================================

  function toast(message) {
    let el = document.getElementById("toast");

    if (!el) {
      el = document.createElement("div");
      el.id = "toast";
      el.className = "toast";
      document.body.appendChild(el);
    }

    el.textContent = message;
    el.classList.add("show");

    clearTimeout(window.glowzyWishlistToast);

    window.glowzyWishlistToast = setTimeout(() => {
      el.classList.remove("show");
    }, 1800);
  }

  // ==========================================
  // RENDER WISHLIST
  // ==========================================

  function render() {
    const box = document.getElementById("wishlist-items");

    if (!box) return;

    const items = get(WISHLIST_KEY);

    // EMPTY WISHLIST
    if (!items.length) {
      box.innerHTML = `
        <div class="empty-wishlist">

          <div class="empty-wishlist-icon">
            <i class="fa-regular fa-heart"></i>
          </div>

          <h2>Your Wishlist is Empty</h2>

          <p>
            Save your favorite gifts here by tapping the heart icon.
          </p>

          <a href="shop.html">
            <i class="fa-solid fa-gift"></i>
            Explore Gifts
          </a>

        </div>
      `;

      updateCounters();
      return;
    }

    // CLEAR OLD ITEMS
    box.innerHTML = "";

    // RENDER ITEMS
    items.forEach((item, index) => {
      const card = document.createElement("article");

      card.className = "wishlist-item";

      const image = item.image || "";
      const name = item.name || "Gift";
      const price = Number(item.price || 0);

      card.innerHTML = `
        <img
          src="${image}"
          alt="${name}"
          loading="lazy"
          onerror="this.style.display='none'"
        >

        <div class="wishlist-info">

          <h3>${name}</h3>

          <div class="price">
            Rs. ${price.toLocaleString()}
          </div>

        </div>

        <div class="wishlist-actions">

          <button
            type="button"
            class="add-cart"
            data-add="${index}"
          >
            <i class="fa-solid fa-cart-plus"></i>
            Add to Cart
          </button>

          <button
            type="button"
            class="remove"
            data-remove="${index}"
          >
            <i class="fa-regular fa-trash-can"></i>
            Remove
          </button>

        </div>
      `;

      box.appendChild(card);
    });

    updateCounters();
  }

  // ==========================================
  // CLICK ACTIONS
  // ==========================================

  document.addEventListener("click", function (event) {
    // ----------------------------------------
    // ADD TO CART
    // ----------------------------------------

    const addButton = event.target.closest("[data-add]");

    if (addButton) {
      const index = Number(addButton.dataset.add);

      const wishlist = get(WISHLIST_KEY);
      const item = wishlist[index];

      if (!item) return;

      const cart = get(CART_KEY);

      const existingProduct = cart.find(
        (cartItem) => cartItem.name === item.name,
      );

      if (existingProduct) {
        existingProduct.quantity = Number(existingProduct.quantity || 1) + 1;
      } else {
        cart.push({
          name: item.name || "Gift",
          price: Number(item.price || 0),
          image: item.image || "",
          quantity: 1,
        });
      }

      save(CART_KEY, cart);

      // Remove from wishlist after adding to cart
      wishlist.splice(index, 1);

      save(WISHLIST_KEY, wishlist);

      render();

      toast(`${item.name || "Gift"} added to cart ✓`);

      return;
    }

    // ----------------------------------------
    // REMOVE FROM WISHLIST
    // ----------------------------------------

    const removeButton = event.target.closest("[data-remove]");

    if (removeButton) {
      const index = Number(removeButton.dataset.remove);

      const wishlist = get(WISHLIST_KEY);
      const item = wishlist[index];

      if (!item) return;

      const productName = item.name || "Gift";

      wishlist.splice(index, 1);

      save(WISHLIST_KEY, wishlist);

      render();

      toast(`${productName} removed from wishlist`);

      return;
    }
  });

  // ==========================================
  // INITIAL LOAD
  // ==========================================

  document.addEventListener("DOMContentLoaded", function () {
    render();
    updateCounters();
  });

  // ==========================================
  // SYNC BETWEEN TABS
  // ==========================================

  window.addEventListener("storage", function (event) {
    if (event.key === CART_KEY || event.key === WISHLIST_KEY) {
      render();
      updateCounters();
    }
  });
})();
