// ==============================
// Glowzy House - shop.js
// ==============================

// CART
const cart = JSON.parse(localStorage.getItem("cart")) || [];
const cartCount = document.querySelector(".cart-count");

// Update Cart Count
function updateCartCount() {
  if (cartCount) {
    const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
    cartCount.textContent = totalItems;
  }
}

updateCartCount();

// Add To Cart
document.querySelectorAll(".cart-btn").forEach((button) => {
  button.addEventListener("click", () => {
    const product = {
      name: button.dataset.name,
      price: Number(button.dataset.price),
      image: button.dataset.image,
      quantity: 1,
    };

    const existing = cart.find((item) => item.name === product.name);

    if (existing) {
      existing.quantity++;
    } else {
      cart.push(product);
    }

    localStorage.setItem("cart", JSON.stringify(cart));

    updateCartCount();

    showToast(product.name + " added to cart!");
  });
});

// ==============================
// PRODUCT DETAILS
// ==============================

const details = {
  "Luxury Gift Hamper": {
    image: "images/basket1.jpg",

    price: "Rs. 2,499",

    description:
      "A beautifully designed luxury gift hamper made with premium products and elegant packaging.",

    items: [
      "Ferrero Rocher Chocolates",
      "Fresh Flowers",
      "Teddy Bear",
      "Greeting Card",
      "Luxury Basket",
    ],

    delivery: "Same day delivery in Lahore. Nationwide delivery in 2-4 days.",

    occasion: "Birthday, Anniversary, Surprise Gift",
  },

  "Chocolate Hamper": {
    image: "images/basket2.jpg",

    price: "Rs. 3,499",

    description:
      "Premium imported chocolates arranged beautifully inside a luxury hamper.",

    items: [
      "Ferrero Rocher",
      "KitKat",
      "Dairy Milk",
      "Flowers",
      "Luxury Basket",
    ],

    delivery: "Same day delivery in Lahore. Nationwide delivery available.",

    occasion: "Birthday, Corporate Gift, Thank You",
  },

  "Birthday Hamper": {
    image: "images/basket3.jpg",

    price: "Rs.7,499",

    description:
      "Luxury preserved roses with chocolates and premium gifts in an elegant gift box.",

    items: ["Luxury Roses", "Ferrero Rocher", "Perfume", "Luxury Gift Box"],

    delivery: "Delivery available in Lahore",

    occasion: "Birthday, Anniversary",
  },
  "Baby Gift Basket": {
    image: "images/basket4.jpg",

    price: "Rs. 4,299",

    description: "A beautiful baby gift basket with adorable baby essentials.",

    items: [
      "Baby Clothes",
      "Soft Toy",
      "Baby Blanket",
      "Baby Lotion",
      "Gift Box",
    ],

    delivery: "Same day delivery in Lahore.",

    occasion: "Baby Shower, Newborn Gift",
  },

  "Coffee Lover Basket": {
    image: "images/basket5.jpg",

    price: "Rs. 5,199",

    description:
      "A luxury coffee hamper for coffee lovers with premium treats.",

    items: [
      "Premium Coffee",
      "Coffee Mug",
      "Cookies",
      "Chocolate",
      "Greeting Card",
    ],

    delivery: "Nationwide delivery available.",

    occasion: "Corporate Gift, Birthday",
  },

  "Wedding Hamper": {
    image: "images/basket6.jpg",

    price: "Rs. 8,999",

    description: "An elegant wedding hamper designed with luxury products.",

    items: [
      "Fresh Flowers",
      "Luxury Chocolates",
      "Scented Candle",
      "Greeting Card",
      "Gift Basket",
    ],

    delivery: "Delivery across Pakistan.",

    occasion: "Wedding, Anniversary",
  },

  "Luxury Flower Basket": {
    image: "images/basket7.jpg",

    price: "Rs. 6,499",

    description: "A luxury flower basket with fresh roses and premium gifts.",

    items: ["Fresh Roses", "Chocolate", "Greeting Card", "Luxury Basket"],

    delivery: "Nationwide delivery.",

    occasion: "Anniversary, Birthday",
  },

  "Premium Surprise Box": {
    image: "images/basket8.jpeg",

    price: "Rs. 9,499",

    description:
      "Our most luxurious premium surprise box with imported products.",

    items: [
      "Imported Chocolates",
      "Luxury Perfume",
      "Fresh Roses",
      "Premium Teddy",
      "Luxury Packaging",
    ],

    delivery: "Nationwide premium delivery.",

    occasion: "Luxury Gift, Anniversary, VIP Gift",
  },
};
// ==============================
// MODAL
// ==============================

const modal = document.getElementById("productModal");
const modalImg = document.getElementById("modal-img");
const modalTitle = document.getElementById("modal-title");
const modalPrice = document.getElementById("modal-price");
const modalDesc = document.getElementById("modal-desc");
const modalItems = document.getElementById("modal-items");
const modalDelivery = document.getElementById("modal-delivery");
const modalOccasion = document.getElementById("modal-occasion");

// View Details
document.querySelectorAll(".view-btn").forEach((button) => {
  button.addEventListener("click", function (e) {
    e.preventDefault();

    const card = this.closest(".product-card");
    const name = card.querySelector("h3").innerText.trim();

    const product = details[name];

    if (!product) {
      alert("Product details not found.");
      return;
    }

    modalImg.src = product.image;
    modalTitle.innerText = name;
    modalPrice.innerText = product.price;
    modalDesc.innerText = product.description;

    modalItems.innerHTML = "";

    product.items.forEach((item) => {
      modalItems.innerHTML += `<li>${item}</li>`;
    });

    modalDelivery.innerText = product.delivery;
    modalOccasion.innerText = product.occasion;

    modal.classList.add("active");
  });
});

// Close Modal
document.querySelector(".close-modal").addEventListener("click", () => {
  modal.classList.remove("active");
});

// Close When Click Outside
window.addEventListener("click", (e) => {
  if (e.target === modal) {
    modal.classList.remove("active");
  }
});

// ==============================
// SEARCH PRODUCTS
// ==============================

const searchInput = document.getElementById("searchInput");

if (searchInput) {
  searchInput.addEventListener("input", function () {
    const value = this.value.toLowerCase().trim();

    document.querySelectorAll(".product-card").forEach((card) => {
      const productName = card.querySelector("h3").innerText.toLowerCase();

      if (productName.includes(value)) {
        card.style.display = "";
      } else {
        card.style.display = "none";
      }
    });
  });
}
// ==============================
// CATEGORY FILTER
// ==============================

const categoryButtons = document.querySelectorAll(".shop-categories button");
const productCards = document.querySelectorAll(".product-card");

categoryButtons.forEach((button) => {
  button.addEventListener("click", () => {
    categoryButtons.forEach((btn) => btn.classList.remove("active"));
    button.classList.add("active");

    const category = button.innerText.toLowerCase();

    productCards.forEach((card) => {
      const cardCategory = card.dataset.category.toLowerCase();

      if (category === "all") {
        card.style.display = "";
      } else if (cardCategory.includes(category)) {
        card.style.display = "";
      } else {
        card.style.display = "none";
      }
    });
  });
});
// ==============================
// WISHLIST
// ==============================
// ==============================
// WISHLIST
// ==============================

let wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];

const wishlistCount = document.querySelector(".wishlist-count");

function updateWishlistCount() {
  if (wishlistCount) {
    wishlistCount.textContent = wishlist.length;
  }
}

updateWishlistCount();

document.querySelectorAll(".wishlist").forEach((heart) => {
  const card = heart.closest(".product-card");

  const name = card.querySelector("h3").innerText.trim();
  const image = card.querySelector("img").getAttribute("src");
  const price = card.querySelector("h4").innerText;

  if (wishlist.find((item) => item.name === name)) {
    heart.classList.remove("fa-regular");
    heart.classList.add("fa-solid", "active");
  }

  heart.addEventListener("click", () => {
    const index = wishlist.findIndex((item) => item.name === name);

    if (index === -1) {
      wishlist.push({
        name,
        image,
        price,
      });

      heart.classList.remove("fa-regular");
      heart.classList.add("fa-solid", "active");

      showToast(name + " added to wishlist ❤️");
    } else {
      wishlist.splice(index, 1);

      heart.classList.remove("fa-solid", "active");
      heart.classList.add("fa-regular");

      showToast(name + " removed from wishlist", "error");
    }

    localStorage.setItem("wishlist", JSON.stringify(wishlist));

    updateWishlistCount();
  });
});
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
// ==============================
// PRODUCT SORTING
// ==============================

const sortSelect = document.getElementById("sortProducts");
const productGrid = document.querySelector(".product-grid");

if (sortSelect && productGrid) {
  sortSelect.addEventListener("change", () => {
    const cards = Array.from(productGrid.querySelectorAll(".product-card"));

    switch (sortSelect.value) {
      case "low-high":
        cards.sort((a, b) => {
          const priceA = parseInt(a.querySelector(".cart-btn").dataset.price);
          const priceB = parseInt(b.querySelector(".cart-btn").dataset.price);
          return priceA - priceB;
        });
        break;

      case "high-low":
        cards.sort((a, b) => {
          const priceA = parseInt(a.querySelector(".cart-btn").dataset.price);
          const priceB = parseInt(b.querySelector(".cart-btn").dataset.price);
          return priceB - priceA;
        });
        break;

      case "az":
        cards.sort((a, b) => {
          const nameA = a.querySelector("h3").innerText;
          const nameB = b.querySelector("h3").innerText;
          return nameA.localeCompare(nameB);
        });
        break;

      case "za":
        cards.sort((a, b) => {
          const nameA = a.querySelector("h3").innerText;
          const nameB = b.querySelector("h3").innerText;
          return nameB.localeCompare(nameA);
        });
        break;

      default:
        location.reload();
        return;
    }

    cards.forEach((card) => productGrid.appendChild(card));
  });
}
