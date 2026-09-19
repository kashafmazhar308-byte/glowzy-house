// ==========================================
// Glowzy House - Cart JS
// ==========================================
(function () {
  "use strict";

  const CART_KEY = "cart";
  const WISHLIST_KEY = "wishlist";

  const getCart = () => {
    try {
      const value = JSON.parse(localStorage.getItem(CART_KEY));
      return Array.isArray(value) ? value : [];
    } catch (error) {
      return [];
    }
  };

  const saveCart = (cart) => {
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
  };

  function cartCount() {
    return getCart().reduce(
      (sum, item) => sum + Number(item.quantity || 1),
      0
    );
  }

  function updateCounters() {
    document.querySelectorAll(".cart-count").forEach((el) => {
      el.textContent = cartCount();
    });

    let wishlistCount = 0;
    try {
      const wishlist = JSON.parse(localStorage.getItem(WISHLIST_KEY));
      wishlistCount = Array.isArray(wishlist) ? wishlist.length : 0;
    } catch (error) {}

    document.querySelectorAll(".wishlist-count").forEach((el) => {
      el.textContent = wishlistCount;
    });
  }

  function toast(message) {
    const el = document.getElementById("toast");
    if (!el) return;

    el.textContent = message;
    el.classList.add("show");

    clearTimeout(window.glowzyCartToast);
    window.glowzyCartToast = setTimeout(
      () => el.classList.remove("show"),
      1800
    );
  }

  function render() {
    const box = document.getElementById("cart-items");
    const totalEl = document.getElementById("cart-total");

    if (!box) return;

    const items = getCart();

    if (!items.length) {
      box.innerHTML =
        '<div class="empty-cart"><h2>Your cart is empty</h2><p>Choose a beautiful gift from our collection.</p><a class="checkout-btn" href="shop.html">Explore Gifts</a></div>';

      if (totalEl) totalEl.textContent = "Rs. 0";
      updateCounters();
      return;
    }

    box.innerHTML = "";
    let total = 0;

    items.forEach((item, index) => {
      const quantity = Math.max(1, Number(item.quantity || 1));
      const price = Number(item.price || 0);
      const lineTotal = quantity * price;

      total += lineTotal;

      const row = document.createElement("div");
      row.className = "cart-item";

      row.innerHTML = `
        <img src="${item.image || ""}" alt="${item.name || "Gift"}">

        <div>
          <h3>${item.name || "Gift"}</h3>
          <p>Glowzy House Gift</p>
          <div class="cart-item-price">Rs. ${price.toLocaleString()}</div>

          <div class="quantity-controls">
            <button type="button" data-minus="${index}">−</button>
            <span>${quantity}</span>
            <button type="button" data-plus="${index}">+</button>
          </div>
        </div>

        <div class="cart-actions">
          <strong>Rs. ${lineTotal.toLocaleString()}</strong>
          <br>
          <button type="button" data-remove="${index}">Remove</button>
        </div>
      `;

      box.appendChild(row);
    });

    if (totalEl) {
      totalEl.textContent = "Rs. " + total.toLocaleString();
    }

    updateCounters();
  }

  document.addEventListener("click", function (event) {
    const plus = event.target.closest("[data-plus]");
    const minus = event.target.closest("[data-minus]");
    const remove = event.target.closest("[data-remove]");

    if (plus) {
      const cart = getCart();
      const index = Number(plus.dataset.plus);

      if (!cart[index]) return;

      cart[index].quantity = Number(cart[index].quantity || 1) + 1;
      saveCart(cart);
      render();
      return;
    }

    if (minus) {
      const cart = getCart();
      const index = Number(minus.dataset.minus);

      if (!cart[index]) return;

      cart[index].quantity = Math.max(
        1,
        Number(cart[index].quantity || 1) - 1
      );

      saveCart(cart);
      render();
      return;
    }

    if (remove) {
      const cart = getCart();
      cart.splice(Number(remove.dataset.remove), 1);

      saveCart(cart);
      render();
      toast("Removed from cart");
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
