// ==============================
// Glowzy House - wishlist.js
// ==============================

let wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
let cart = JSON.parse(localStorage.getItem("cart")) || [];

const wishlistItems = document.getElementById("wishlist-items");
const wishlistCount = document.querySelector(".wishlist-count");
const cartCount = document.querySelector(".cart-count");

// Update Wishlist Count
function updateWishlistCount() {
  if (wishlistCount) {
    wishlistCount.textContent = wishlist.length;
  }
}

// Update Cart Count
function updateCartCount() {
  if (cartCount) {
    const total = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCount.textContent = total;
  }
}

// Display Wishlist
function displayWishlist() {
  if (!wishlistItems) return;

  wishlistItems.innerHTML = "";

  if (wishlist.length === 0) {
    wishlistItems.innerHTML = `
            <div class="empty-cart">
                <i class="fa-solid fa-heart-crack"></i>
                <h2>Your wishlist is empty</h2>
                <p>Add your favourite hampers ❤️</p>
            </div>
        `;

    updateWishlistCount();
    updateCartCount();
    return;
  }

  wishlist.forEach((item, index) => {
    wishlistItems.innerHTML += `

        <div class="cart-item">

            <img src="${item.image}" alt="${item.name}">

            <div class="cart-details">

                <h3>${item.name}</h3>

                <p>${item.price}</p>

            </div>

            <div>

                <button class="checkout-btn" onclick="addToCart(${index})">
                    Add to Cart
                </button>

                <button class="remove-btn" onclick="removeWishlist(${index})">
                    Remove
                </button>

            </div>

        </div>

        `;
  });

  updateWishlistCount();
  updateCartCount();
}

// Remove Wishlist Item
function removeWishlist(index) {
  wishlist.splice(index, 1);

  localStorage.setItem("wishlist", JSON.stringify(wishlist));

  displayWishlist();
}

// Add To Cart
function addToCart(index) {
  const item = wishlist[index];

  const existing = cart.find((product) => product.name === item.name);

  if (existing) {
    existing.quantity++;
  } else {
    cart.push({
      name: item.name,
      price: Number(item.price.replace(/[^\d]/g, "")),
      image: item.image,
      quantity: 1,
    });
  }

  localStorage.setItem("cart", JSON.stringify(cart));

  showToast(item.name + " added to cart!");

  updateCartCount();
}

displayWishlist();
// ==============================
// TOAST
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
