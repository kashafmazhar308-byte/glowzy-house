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
    image: "images/basket1.jpeg",
    price: "Rs. 4,499",
    description:
      "A premium snack gift basket beautifully arranged with chocolates, chips, soft drinks, juice and a birthday card. Handcrafted with elegant black floral decoration, making it a perfect surprise for your loved ones.",
    items: [
      "Lays Chips",
      "Cadbury Eclairs",
      "Cup Cakes",
      "Cheetos",
      "Coca-Cola",
      "Mixed Snacks",
      "Juice Pack",
      "Birthday Card",
      "Decorative Basket",
    ],
    delivery:
      "Same day delivery in Lahore. Nationwide delivery in 2-4 working days.",
    occasion: "Birthday, Anniversary, Surprise Gift",
  },

  "Chocolate Hamper": {
    image: "images/basket2.jpeg",
    price: "Rs. 3,299",
    description:
      "A luxury chocolate bouquet featuring premium chocolates wrapped in elegant transparent gift packaging with a decorative ribbon.",
    items: [
      "Ferrero Rocher",
      "Kinder Bueno",
      "Cadbury Dairy Milk",
      "Snickers",
      "5 Star",
      "Munch",
      "Dark Chocolate",
      "Luxury Gift Wrapping",
    ],
    delivery: "Nationwide delivery available.",
    occasion: "Birthday, Anniversary, Valentine's Day",
  },

  "Birthday Hamper": {
    image: "images/basket3.jpeg",
    price: "Rs. 3,799",
    description:
      "A classic birthday snack basket filled with popular chips, chocolates, donuts, drinks and premium treats in an elegant basket.",
    items: [
      "Lays",
      "Super Crisps",
      "Kurkure",
      "Donut Cake",
      "Ferrero Rocher",
      "Chocolate Bars",
      "Soft Drink",
      "Decorative Basket",
    ],
    delivery: "Same day delivery in Lahore.",
    occasion: "Birthday, Congratulations, Friends Gift",
  },

  "Baby Gift Basket": {
    image: "images/basket4.jpeg",
    price: "Rs. 5,499",
    description:
      "A beautiful newborn gift basket with premium baby care essentials presented in an elegant handcrafted basket.",
    items: [
      "Baby Powder",
      "Baby Lotion",
      "Baby Oil",
      "Baby Cream",
      "Baby Soap",
      "Baby Bottle",
      "Decorative Basket",
    ],
    delivery: "Nationwide delivery available.",
    occasion: "Baby Shower, Newborn Gift",
  },

  "Coffee Lover Basket": {
    image: "images/basket5.jpeg",
    price: "Rs. 4,999",
    description:
      "Luxury coffee gift box featuring premium coffee, chocolates, cookies and a stylish coffee mug in elegant packaging.",
    items: [
      "Nescafe Gold",
      "Lindt Chocolate",
      "Pringles",
      "Coffee Mug",
      "Coffee Cookies",
      "Premium Gift Box",
    ],
    delivery: "Delivery all over Pakistan.",
    occasion: "Corporate Gift, Birthday, Thank You",
  },

  "Wedding Basket": {
    image: "images/basket6.jpeg",

    price: "Rs. 5,999",

    description:
      "A beautifully handcrafted wedding gift basket featuring premium gifts, elegant floral decorations, luxury chocolates, scented candles, and exquisite wrapping. Perfect for celebrating weddings with style and creating unforgettable memories.",

    items: [
      "Fresh Artificial Flowers",
      "Ferrero Rocher Chocolates",
      "Luxury Scented Candle",
      "Premium Body Care Set",
      "Decorative Wedding Card",
      "Elegant Gift Box",
      "Luxury Ribbon Decoration",
      "Fairy Lights",
      "Premium Wicker Basket",
    ],
  },
  "EID Basket": {
    image: "images/basket7.jpeg",
    price: "Rs. 2,999",
    description:
      "A traditional floral gift basket beautifully decorated with fresh flowers, bangles and accessories for special celebrations.",
    items: [
      "Fresh Flowers",
      "Decorative Bangles",
      "Jewellery Accessories",
      "Henna Cones",
      "Greeting Card",
      "Handmade Basket",
    ],
    delivery: "Delivery available across Pakistan.",
    occasion: "Mehndi, Wedding, Engagement",
  },

  "Premium Surprise Box": {
    image: "images/basket8.jpeg",
    price: "Rs. 6,999",
    description:
      "An elegant premium acrylic surprise box filled with Ferrero Rocher, chocolates, Pringles and luxury snacks, beautifully decorated with flowers and ribbons.",
    items: [
      "Ferrero Rocher",
      "Pringles",
      "Snickers",
      "Toblerone",
      "Premium Chocolates",
      "Luxury Acrylic Box",
      "Floral Decoration",
    ],
    delivery: "Premium nationwide delivery.",
    occasion: "Birthday, Anniversary, Luxury Gift, Corporate Gift",
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
