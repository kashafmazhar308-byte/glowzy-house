// ==============================
// Glowzy House - shop.js
// ==============================

// ==============================
// CART
// ==============================

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

  "Wedding Hamper": {
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

    delivery: "Nationwide delivery available.",

    occasion: "Wedding, Engagement, Anniversary",
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

  "Premium Birthday Basket": {
    image: "images/basket12.jpeg",
    price: "Rs. 13,999",

    description:
      "A luxurious premium birthday basket beautifully arranged with Ferrero Rocher chocolates, teddy bear, fresh flowers, premium snacks, greeting card and elegant gift wrapping. Perfect for making birthdays extra special.",

    items: [
      "Premium Teddy Bear",
      "Ferrero Rocher",
      "Pringles",
      "KitKat",
      "Kinder Bueno",
      "Dairy Milk Silk",
      "Fresh Flowers",
      "Birthday Greeting Card",
      "Luxury Ribbon Decoration",
      "Premium Wicker Basket",
    ],

    delivery:
      "Same day delivery in Lahore. Nationwide delivery in 2-4 working days.",

    occasion: "Birthday, Surprise Gift, Anniversary, Special Occasion",
  },

  "Classic Birthday Basket": {
    image: "images/basket123.jpeg",
    price: "Rs. 6,000",

    description:
      "A beautifully arranged Classic Birthday Basket featuring a delicious cake, Coca-Cola can, premium chocolates, snacks, birthday card, and elegant gift wrapping. Perfect for making birthdays memorable.",

    items: [
      "Birthday Cake",
      "Coca-Cola Can",
      "Premium Chocolates",
      "Mixed Snacks",
      "Birthday Greeting Card",
      "Decorative Basket",
      "Luxury Net Wrapping",
    ],

    delivery: "Same day delivery in Lahore. Nationwide delivery available.",

    occasion: "Birthday, Surprise Gift, Family, Friends",
  },
};

// ==============================
// MODAL ELEMENTS
// ==============================

const modal = document.getElementById("productModal");

const modalImg = document.getElementById("modal-img");

const modalTitle = document.getElementById("modal-title");

const modalPrice = document.getElementById("modal-price");

const modalDesc = document.getElementById("modal-desc");

const modalItems = document.getElementById("modal-items");

const modalDelivery = document.getElementById("modal-delivery");

const modalOccasion = document.getElementById("modal-occasion");

// ==============================
// OPEN PRODUCT DETAILS
// ==============================

function openProductDetails(card) {
  if (!card || !modal) return;

  const nameElement = card.querySelector("h3");

  if (!nameElement) return;

  const name = nameElement.innerText.trim();

  const product = details[name];

  if (!product) {
    alert("Product details not found.");
    return;
  }

  // Product Image
  if (modalImg) {
    modalImg.src = product.image;

    modalImg.alt = name;
  }

  // Product Name
  if (modalTitle) {
    modalTitle.innerText = name;
  }

  // Product Price
  if (modalPrice) {
    modalPrice.innerText = product.price;
  }

  // Description
  if (modalDesc) {
    modalDesc.innerText = product.description;
  }

  // Product Items
  if (modalItems) {
    modalItems.innerHTML = "";

    product.items.forEach((item) => {
      const li = document.createElement("li");

      li.textContent = item;

      modalItems.appendChild(li);
    });
  }

  // Delivery
  if (modalDelivery) {
    modalDelivery.innerText = product.delivery || "Delivery available.";
  }

  // Occasion
  if (modalOccasion) {
    modalOccasion.innerText =
      product.occasion || "Perfect for every special occasion.";
  }

  // Open Modal
  modal.classList.add("active");

  // Prevent Background Scroll
  document.body.style.overflow = "hidden";
}

// ==============================
// VIEW DETAILS BUTTON
// ==============================

document.querySelectorAll(".view-btn").forEach((button) => {
  button.addEventListener("click", function (e) {
    e.preventDefault();

    const card = this.closest(".product-card");

    openProductDetails(card);
  });
});

// ==============================
// PRODUCT IMAGE CLICK
// ==============================

document.querySelectorAll(".product-card img").forEach((image) => {
  image.style.cursor = "pointer";

  image.addEventListener("click", function (e) {
    e.preventDefault();

    const card = this.closest(".product-card");

    openProductDetails(card);
  });
});

// ==============================
// CLOSE MODAL
// ==============================

const closeModalButton = document.querySelector(".close-modal");

if (closeModalButton) {
  closeModalButton.addEventListener("click", () => {
    if (modal) {
      modal.classList.remove("active");

      document.body.style.overflow = "";
    }
  });
}

// ==============================
// CLOSE OUTSIDE MODAL
// ==============================

window.addEventListener("click", (e) => {
  if (modal && e.target === modal) {
    modal.classList.remove("active");

    document.body.style.overflow = "";
  }
});

// ==============================
// CLOSE WITH ESC
// ==============================

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && modal && modal.classList.contains("active")) {
    modal.classList.remove("active");

    document.body.style.overflow = "";
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
      const cardCategory = (card.dataset.category || "").toLowerCase();

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
// CATEGORY FROM HOME PAGE
// ==============================

const urlParams = new URLSearchParams(window.location.search);

const selectedCategory = urlParams.get("category");

if (selectedCategory) {
  const category = selectedCategory.toLowerCase();

  productCards.forEach((card) => {
    const categories = (card.dataset.category || "").toLowerCase();

    if (categories.includes(category)) {
      card.style.display = "";
    } else {
      card.style.display = "none";
    }
  });

  // Activate matching category button
  categoryButtons.forEach((button) => {
    if (button.innerText.toLowerCase().includes(category)) {
      button.classList.add("active");
    }
  });
}

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

  if (!card) return;

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
