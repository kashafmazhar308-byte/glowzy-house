document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("checkoutForm");
  const toast = document.getElementById("toast");

  const SUPABASE_URL = "https://qugmjqltsqsurqvpjkxg.supabase.co";

  const SUPABASE_PUBLISHABLE_KEY =
    "sb_publishable_OaMCCPC97d20gh9qfRBS3Q_xwm3DJBJ";

  /* =========================
     CART HELPERS
  ========================= */

  function getCart() {
    try {
      return JSON.parse(localStorage.getItem("cart")) || [];
    } catch (error) {
      console.error("Cart error:", error);
      return [];
    }
  }

  function updateCounters() {
    const items = getCart();

    const cartCount = items.reduce(
      (total, item) => total + Number(item.quantity || 1),
      0,
    );

    document.querySelectorAll(".cart-count").forEach((el) => {
      el.textContent = cartCount;
    });

    try {
      const wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];

      document.querySelectorAll(".wishlist-count").forEach((el) => {
        el.textContent = wishlist.length;
      });
    } catch (error) {
      document.querySelectorAll(".wishlist-count").forEach((el) => {
        el.textContent = "0";
      });
    }
  }

  /* =========================
     CHECKOUT ORDER SUMMARY
  ========================= */

  function renderCheckout() {
    const box = document.getElementById("checkout-items");
    const totalBox = document.getElementById("checkout-total");

    if (!box || !totalBox) return;

    const items = getCart();

    box.innerHTML = "";

    if (!items.length) {
      box.innerHTML = `
        <p style="color:#8d7a6d;font-size:13px">
          Your cart is empty.
          <a href="shop.html">Shop now</a>
        </p>
      `;

      totalBox.textContent = "Rs. 0";
      return;
    }

    let total = 0;

    items.forEach((item) => {
      const quantity = Number(item.quantity || 1);
      const price = Number(item.price || 0);
      const subtotal = quantity * price;

      total += subtotal;

      const row = document.createElement("div");
      row.className = "checkout-item";

      row.innerHTML = `
        <img
          src="${item.image || ""}"
          alt="${item.name || "Gift"}"
        >

        <div>
          <h4>${item.name || "Gift"}</h4>
          <p>Qty: ${quantity}</p>
        </div>

        <strong>
          Rs. ${subtotal.toLocaleString()}
        </strong>
      `;

      box.appendChild(row);
    });

    totalBox.textContent = "Rs. " + total.toLocaleString();
  }

  /* =========================
     TOAST
  ========================= */

  function showToast(message) {
    if (!toast) return;

    toast.textContent = message;
    toast.classList.add("show");

    setTimeout(() => {
      toast.classList.remove("show");
    }, 3000);
  }

  /* =========================
     PAYMENT TOGGLE
  ========================= */

  function setupPaymentMethod() {
    const radios = document.querySelectorAll('input[name="payment"]');

    const bankDetails = document.getElementById("bankDetails");

    radios.forEach((radio) => {
      radio.addEventListener("change", () => {
        if (!bankDetails) return;

        bankDetails.style.display =
          radio.checked && radio.value === "SadaPay" ? "block" : "none";
      });
    });
  }

  /* =========================
     ORDER DATA
  ========================= */

  function getOrderItems() {
    return getCart().map((item) => {
      const quantity = Number(item.quantity || 1);

      const price = Number(item.price || 0);

      const subtotal = quantity * price;

      return {
        name: item.name || "Gift",
        quantity,
        price,
        subtotal,
        image: item.image || "",
      };
    });
  }

  function getOrderDetailsText(items) {
    if (!items.length) {
      return "No items found in cart.";
    }

    return items
      .map(
        (item) =>
          `${item.name} | Qty: ${item.quantity} | Rs. ${item.subtotal.toLocaleString()}`,
      )
      .join("\n");
  }

  /* =========================
     SUPABASE
  ========================= */

  async function saveOrderToSupabase(order) {
    const response = await fetch(`${SUPABASE_URL}/rest/v1/orders`, {
      method: "POST",

      headers: {
        apikey: SUPABASE_PUBLISHABLE_KEY,
        Authorization: `Bearer ${SUPABASE_PUBLISHABLE_KEY}`,
        "Content-Type": "application/json",
        Prefer: "return=minimal",
      },

      body: JSON.stringify(order),
    });

    if (!response.ok) {
      let errorMessage = `Supabase error (${response.status})`;

      try {
        const errorData = await response.json();

        errorMessage =
          errorData.message ||
          errorData.details ||
          errorData.hint ||
          errorMessage;
      } catch (error) {
        console.error("Supabase response error:", error);
      }

      throw new Error(errorMessage);
    }
  }

  /* =========================
     PLACE ORDER
  ========================= */

  if (form) {
    form.addEventListener("submit", async (e) => {
      e.preventDefault();

      const submitButton = form.querySelector(".place-order");

      const name = document.getElementById("name")?.value.trim() || "";

      const phone = document.getElementById("phone")?.value.trim() || "";

      const email = document.getElementById("email")?.value.trim() || "";

      const address = document.getElementById("address")?.value.trim() || "";

      const paymentMethod =
        document.querySelector('input[name="payment"]:checked')?.value ||
        "Cash on Delivery";

      const total =
        document.getElementById("checkout-total")?.textContent.trim() ||
        "Rs. 0";

      const items = getOrderItems();

      const orderDetailsText = getOrderDetailsText(items);

      if (!name || !phone || !address) {
        showToast("Please fill in all required details.");
        return;
      }

      if (!items.length) {
        showToast("Your cart is empty.");
        return;
      }

      if (submitButton) {
        submitButton.disabled = true;
        submitButton.textContent = "Placing Order...";
      }

      const orderData = {
        customer_name: name,
        phone: phone,
        email: email || null,
        address: address,
        payment_method: paymentMethod,
        order_details: items,
        total: total,
        status: "New",
      };

      const emailParams = {
        customer_name: name,
        customer_phone: phone,
        customer_email: email || "Not provided",
        customer_address: address,
        payment_method: paymentMethod,
        order_details: orderDetailsText,
        total: total,
      };

      try {
        /* Save order to Supabase */
        await saveOrderToSupabase(orderData);

        /* Send notification email */
        try {
          if (window.emailjs) {
            await emailjs.send(
              "service_7pt9p6a",
              "template_ig77ozj",
              emailParams,
            );
          }
        } catch (emailError) {
          console.error("EmailJS Error:", emailError);
        }

        /* Clear cart after successful DB save */
        localStorage.removeItem("cart");

        updateCounters();

        showToast("Order placed successfully!");

        form.reset();

        const cod = document.querySelector(
          'input[name="payment"][value="Cash on Delivery"]',
        );

        if (cod) {
          cod.checked = true;
        }

        const bankDetails = document.getElementById("bankDetails");

        if (bankDetails) {
          bankDetails.style.display = "none";
        }

        setTimeout(() => {
          window.location.href = "order-success.html";
        }, 1200);
      } catch (error) {
        console.error("Order Save Error:", error);

        showToast("Order could not be saved. Please try again.");
      } finally {
        if (submitButton) {
          submitButton.disabled = false;

          submitButton.textContent = "Place Order";
        }
      }
    });
  }

  /* =========================
     INITIALIZE
  ========================= */

  renderCheckout();
  updateCounters();
  setupPaymentMethod();
});
