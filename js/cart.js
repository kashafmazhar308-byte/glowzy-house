// ==============================
// Glowzy House - cart.js
// ==============================

const cart = JSON.parse(localStorage.getItem("cart")) || [];

const cartItems = document.getElementById("cart-items");
const cartTotal = document.getElementById("cart-total");
const cartCount = document.querySelector(".cart-count");

function updateCartCount() {
  if (cartCount) {
    const total = cart.reduce((sum, item) => sum + item.quantity, 0);

    cartCount.textContent = total;
  }
}

function saveCart() {
  localStorage.setItem("cart", JSON.stringify(cart));
}

function displayCart() {
  if (!cartItems) return;

  cartItems.innerHTML = "";

  if (cart.length === 0) {
    cartItems.innerHTML = `
<div class="empty-cart">

    <i class="fa-solid fa-cart-shopping"></i>

    <h2>Your cart is empty</h2>

    <p>Add some beautiful hampers to your cart.</p>

    <a href="shop.html" class="continue-btn">
        Continue Shopping
    </a>

</div>
`;

    cartTotal.textContent = "Rs. 0";

    updateCartCount();

    return;
  }

  let totalPrice = 0;

  cart.forEach((item, index) => {
    totalPrice += item.price * item.quantity;

    cartItems.innerHTML += `

        <div class="cart-item">

            <img src="${item.image}" alt="${item.name}">

            <div class="cart-details">

                <h3>${item.name}</h3>

                <p>Rs. ${item.price}</p>

                <div class="quantity">

                    <button onclick="changeQuantity(${index},-1)">−</button>

                    <span>${item.quantity}</span>

                    <button onclick="changeQuantity(${index},1)">+</button>

                </div>

            </div>

            <button class="remove-btn" onclick="removeItem(${index})">
    <i class="fa-solid fa-trash"></i>
</button>

        </div>

        `;
  });

  cartTotal.textContent = "Rs. " + totalPrice.toLocaleString();

  updateCartCount();
}

function changeQuantity(index, amount) {
  cart[index].quantity += amount;

  if (cart[index].quantity <= 0) {
    cart.splice(index, 1);
  }

  saveCart();

  displayCart();
}

function removeItem(index) {
  cart.splice(index, 1);

  saveCart();

  displayCart();
}

displayCart();
