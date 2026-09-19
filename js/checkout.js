document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("checkoutForm");
  const toast = document.getElementById("toast");

  if (!form) return;

  function showToast(message) {
    if (!toast) return;

    toast.textContent = message;
    toast.classList.add("show");

    setTimeout(() => {
      toast.classList.remove("show");
    }, 3500);
  }

  function getCart() {
    try {
      return JSON.parse(localStorage.getItem("cart")) || [];
    } catch (error) {
      console.error("Cart read error:", error);
      return [];
    }
  }

  function getOrderDetails() {
    const items = getCart();

    if (!items.length) {
      return "No items found in cart.";
    }

    return items
      .map((item) => {
        const quantity = Number(item.quantity || 1);
        const price = Number(item.price || 0);
        const subtotal = quantity * price;

        return `${item.name || "Gift"} | Qty: ${quantity} | Rs. ${subtotal.toLocaleString()}`;
      })
      .join("\n");
  }

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
      document.getElementById("checkout-total")?.textContent.trim() || "Rs. 0";

    const orderDetails = getOrderDetails();

    if (!name || !phone || !address) {
      showToast("Please fill in all required details.");
      return;
    }

    if (submitButton) {
      submitButton.disabled = true;
      submitButton.textContent = "Sending Order...";
    }

    const templateParams = {
      customer_name: name,
      customer_phone: phone,
      customer_email: email || "Not provided",
      customer_address: address,
      payment_method: paymentMethod,
      order_details: orderDetails,
      total: total,
    };

    try {
      await emailjs.send("service_7pt9p6a", "template_ig77ozj", templateParams);

      localStorage.removeItem("cart");

      showToast("Order placed successfully! Your order has been sent.");

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
      }, 1800);
    } catch (error) {
      console.error("EmailJS Error:", error);

      showToast(
        "Order could not be sent. Please try again or contact us directly.",
      );
    } finally {
      if (submitButton) {
        submitButton.disabled = false;
        submitButton.textContent = "Place Order";
      }
    }
  });
});
