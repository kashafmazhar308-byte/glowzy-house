// ==========================================
// Glowzy House - Wishlist JS
// ==========================================
(function () {
  "use strict";

  const CART_KEY = "cart";
  const WISHLIST_KEY = "wishlist";

  const get = (key) => {
    try {
      const value = JSON.parse(localStorage.getItem(key));
      return Array.isArray(value) ? value : [];
    } catch (error) {
      return [];
    }
  };

  const save = (key, value) => {
    localStorage.setItem(key, JSON.stringify(value));
  };

  function updateCounters() {
    const cart = get(CART_KEY);
    const wishlist = get(WISHLIST_KEY);

    document.querySelectorAll(".cart-count").forEach((el) => {
      el.textContent = cart.reduce(
        (sum, item) => sum + Number(item.quantity || 1),
        0
      );
    });

    document.querySelectorAll(".wishlist-count").forEach((el) => {
      el.textContent = wishlist.length;
    });
  }

  function toast(message) {
    const el = document.getElementById("toast");
    if (!el) return;

    el.textContent = message;
    el.classList.add("show");

    clearTimeout(window.glowzyWishlistToast);
    window.glowzyWishlistToast = setTimeout(
      () => el.classList.remove("show"),
      1800
    );
  }

  function render() {
    const box = document.getElementById("wishlist-items");
    if (!box) return;

    const items = get(WISHLIST_KEY);

    if (!items.length) {
      box.innerHTML =
        '<div class="empty-state"><h2>Your wishlist is empty</h2><p>Tap the heart on a gift to save it here.</p><a href="shop.html">Explore Gifts</a></div>';
      updateCounters();
      return;
    }

    box.innerHTML = "";

    items.forEach((item, index) => {
      const card = document.createElement("article");
      card.className = "wishlist-card";

      card.innerHTML = `
        <img src="${item.image || ""}" alt="${item.name || "Gift"}">
        <div class="wishlist-info">
          <h3>${item.name || "Gift"}</h3>
          <div class="wishlist-price">Rs. ${Number(item.price || 0).toLocaleString()}</div>
          <div class="wishlist-actions">
            <button class="wishlist-add" data-add="${index}">Add to Cart</button>
            <button class="wishlist-remove" data-remove="${index}">Remove</button>
          </div>
        </div>
      `;

      box.appendChild(card);
    });

    updateCounters();
  }

  document.addEventListener("click", function (event) {
    const add = event.target.closest("[data-add]");
    const remove = event.target.closest("[data-remove]");

    if (add) {
      const wishlist = get(WISHLIST_KEY);
      const item = wishlist[Number(add.dataset.add)];

      if (!item) return;

      const cart = get(CART_KEY);
      const existing = cart.find((x) => x.name === item.name);

      if (existing) {
        existing.quantity = Number(existing.quantity || 1) + 1;
      } else {
        cart.push({ ...item, quantity: 1 });
      }

      save(CART_KEY, cart);
      wishlist.splice(Number(add.dataset.add), 1);
      save(WISHLIST_KEY, wishlist);

      render();
      toast("Added to cart ✓");
    }

    if (remove) {
      const wishlist = get(WISHLIST_KEY);
      wishlist.splice(Number(remove.dataset.remove), 1);
      save(WISHLIST_KEY, wishlist);

      render();
      toast("Removed from wishlist");
    }
  });

  document.addEventListener("DOMContentLoaded", function () {
    render();
    updateCounters();
  });

  window.addEventListener("storage", function () {
    render();
    updateCounters();
  });
})();
