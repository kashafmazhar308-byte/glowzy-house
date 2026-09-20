// ==========================================
// Glowzy House - Cart JS
// ==========================================

(function () {
  "use strict";

  const CART_KEY = "cart";
  const WISHLIST_KEY = "wishlist";

  /* =========================
     CART HELPERS
  ========================= */

  function getCart() {
    try {
      const value = JSON.parse(localStorage.getItem(CART_KEY));

      if (!Array.isArray(value)) {
        return [];
      }

      return value;
    } catch (error) {
      console.error("Cart read error:", error);
      return [];
    }
  }

  function saveCart(cart) {
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
  }

  function getQuantity(item) {
    const quantity = Number(item.quantity);

    return Number.isFinite(quantity) && quantity > 0 ? Math.floor(quantity) : 1;
  }

  function getPrice(item) {
    const price = Number(item.price);

    return Number.isFinite(price) && price >= 0 ? price : 0;
  }

  function getCartCount() {
    return getCart().reduce((sum, item) => sum + getQuantity(item), 0);
  }

  /* =========================
     COUNTERS
  ========================= */

  function updateCounters() {
    const totalItems = getCartCount();

    document.querySelectorAll(".cart-count").forEach((el) => {
      el.textContent = totalItems;
    });

    let wishlistCount = 0;

    try {
      const wishlist = JSON.parse(localStorage.getItem(WISHLIST_KEY)) || [];

      if (Array.isArray(wishlist)) {
        wishlistCount = wishlist.length;
      }
    } catch (error) {
      wishlistCount = 0;
    }

    document.querySelectorAll(".wishlist-count").forEach((el) => {
      el.textContent = wishlistCount;
    });
  }

  /* =========================
     TOAST
  ========================= */

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

    clearTimeout(window.glowzyCartToast);

    window.glowzyCartToast = setTimeout(() => {
      el.classList.remove("show");
    }, 1800);
  }

  /* =========================
     RENDER CART
  ========================= */

  function render() {
    const box = document.getElementById("cart-items");

    const totalEl = document.getElementById("cart-total");

    if (!box) return;

    const items = getCart();

    /* =========================
       EMPTY CART
    ========================= */

    if (!items.length) {
      box.innerHTML = `
        <div class="empty-cart">

          <div class="empty-cart-icon">
            <i class="fa-solid fa-bag-shopping"></i>
          </div>

          <h2>Your cart is empty</h2>

          <p>
            You haven't added any gifts yet.
            Explore our collection and find something special.
          </p>

          <a
            class="checkout-btn"
            href="shop.html"
          >
            <i class="fa-solid fa-gift"></i>
            Explore Gifts
          </a>

        </div>
      `;

      if (totalEl) {
        totalEl.textContent = "Rs. 0";
      }

      updateCounters();

      return;
    }

    /* =========================
       CART ITEMS
    ========================= */

    box.innerHTML = "";

    let total = 0;

    items.forEach((item, index) => {
      const quantity = getQuantity(item);

      const price = getPrice(item);

      const lineTotal = quantity * price;

      total += lineTotal;

      const name = item.name || "Gift";

      const image = item.image || "images/placeholder.jpg";

      const row = document.createElement("div");

      row.className = "cart-item";

      row.innerHTML = `

        <div class="cart-product-image">

          <img
            src="${image}"
            alt="${name}"
            loading="lazy"
            onerror="this.style.display='none'"
          >

        </div>


        <div class="cart-product-info">

          <h3>${name}</h3>

          <p>
            Glowzy House Gift
          </p>

          <div class="cart-item-price">
            Rs. ${price.toLocaleString()}
          </div>


          <div class="quantity-controls">

            <button
              type="button"
              data-minus="${index}"
              aria-label="Decrease quantity"
            >
              −
            </button>


            <span aria-label="Quantity">
              ${quantity}
            </span>


            <button
              type="button"
              data-plus="${index}"
              aria-label="Increase quantity"
            >
              +
            </button>

          </div>

        </div>


        <div class="cart-actions">

          <strong>
            Rs. ${lineTotal.toLocaleString()}
          </strong>


          <button
            type="button"
            class="remove-item"
            data-remove="${index}"
          >
            <i class="fa-regular fa-trash-can"></i>
            Remove
          </button>

        </div>

      `;

      box.appendChild(row);
    });

    /* =========================
       TOTAL
    ========================= */

    if (totalEl) {
      totalEl.textContent = "Rs. " + total.toLocaleString();
    }

    updateCounters();
  }

  /* =========================
     CART ACTIONS
  ========================= */

  document.addEventListener("click", function (event) {
    /* PLUS */

    const plus = event.target.closest("[data-plus]");

    if (plus) {
      const cart = getCart();

      const index = Number(plus.dataset.plus);

      if (!cart[index]) return;

      cart[index].quantity = getQuantity(cart[index]) + 1;

      saveCart(cart);

      render();

      return;
    }

    /* MINUS */

    const minus = event.target.closest("[data-minus]");

    if (minus) {
      const cart = getCart();

      const index = Number(minus.dataset.minus);

      if (!cart[index]) return;

      const currentQuantity = getQuantity(cart[index]);

      cart[index].quantity = Math.max(1, currentQuantity - 1);

      saveCart(cart);

      render();

      return;
    }

    /* REMOVE */

    const remove = event.target.closest("[data-remove]");

    if (remove) {
      const cart = getCart();

      const index = Number(remove.dataset.remove);

      if (!cart[index]) return;

      const productName = cart[index].name || "Item";

      cart.splice(index, 1);

      saveCart(cart);

      render();

      toast(`${productName} removed from cart`);

      return;
    }
  });

  /* =========================
     INITIALIZE
  ========================= */

  document.addEventListener("DOMContentLoaded", function () {
    render();

    updateCounters();
  });

  /* =========================
     MULTI-TAB SYNC
  ========================= */

  window.addEventListener("storage", function () {
    render();

    updateCounters();
  });
})();
