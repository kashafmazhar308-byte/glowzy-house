// ==============================
// Glowzy House - checkout.js
// ==============================

let cart = JSON.parse(localStorage.getItem("cart")) || [];

const checkoutItems = document.getElementById("checkout-items");
const checkoutTotal = document.getElementById("checkout-total");
const form = document.getElementById("checkoutForm");

// ==============================
// DISPLAY ORDER
// ==============================

function displayCheckout() {
  checkoutItems.innerHTML = "";

  let total = 0;

  if (cart.length === 0) {
    checkoutItems.innerHTML = "<p>Your cart is empty.</p>";
    checkoutTotal.textContent = "Rs. 0";
    return;
  }

  cart.forEach((item) => {
    total += item.price * item.quantity;

    checkoutItems.innerHTML += `

        <div class="checkout-item">

            <div>
                <h4>${item.name}</h4>
                <small>Qty: ${item.quantity}</small>
            </div>

            <p>Rs. ${(item.price * item.quantity).toLocaleString()}</p>

        </div>

        `;
  });

  checkoutTotal.textContent = "Rs. " + total.toLocaleString();
}

displayCheckout();

// ==============================
// PAYMENT METHOD
// ==============================

const paymentOptions = document.querySelectorAll('input[name="payment"]');
const bankDetails = document.getElementById("bankDetails");

paymentOptions.forEach((option) => {
  option.addEventListener("change", function () {
    if (this.value === "SadaPay") {
      bankDetails.style.display = "block";
    } else {
      bankDetails.style.display = "none";
    }
  });
});

// ==============================
// PLACE ORDER
// ==============================

form.addEventListener("submit", function (e) {
  e.preventDefault();

  if (cart.length === 0) {
    showToast("Your cart is empty!", "error");
    return;
  }

  const name = document.getElementById("name").value;
  const phone = document.getElementById("phone").value;
  const email = document.getElementById("email").value;
  const address = document.getElementById("address").value;

  const payment = document.querySelector('input[name="payment"]:checked').value;

  let message = `🌸 *Glowzy House Order*

👤 Name: ${name}

📞 Phone: ${phone}

📧 Email: ${email}

📍 Address:
${address}

💳 Payment:
${payment}

-----------------------

🛍 Order Details

`;

  let total = 0;

  cart.forEach((item) => {
    message += `• ${item.name}

Qty: ${item.quantity}

Rs. ${(item.price * item.quantity).toLocaleString()}

`;

    total += item.price * item.quantity;
  });

  message += `-----------------------

💰 Total: Rs. ${total.toLocaleString()}`;

  if (payment === "SadaPay") {
    showToast(
      "Complete your SadaPay payment and send the screenshot on WhatsApp.",
      "success",
    );
  }

  const whatsappNumber = "923161440430";
  showToast("Order placed successfully! Redirecting...", "success");
  window.open(
    `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`,
    "_blank",
  );

  localStorage.removeItem("cart");

  setTimeout(() => {
    window.location.href = "index.html";
  }, 1000);
});
// ==============================
// TOAST NOTIFICATION
// ==============================

function showToast(message, type = "success") {
  const toast = document.getElementById("toast");

  if (!toast) return;

  toast.textContent = message;
  toast.className = "toast " + type + " show";

  setTimeout(() => {
    toast.classList.remove("show");
  }, 3000);
}
