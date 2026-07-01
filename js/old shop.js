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

    alert(product.name + " added to cart!");
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

    price: "Rs. 7,499",

    description:
      "Luxury preserved roses with chocolates and premium gifts in an elegant gift box.",

    items: ["Luxury Roses", "Ferrero Rocher", "Perfume", "Luxury Gift Box"],

    delivery: "Delivery available in Lahore",

    occasion: "Wedding, Anniversary, Valentine's Day",
  },
};
{
  "Baby Gift Basket": {
  image: "images/basket4.jpg",
  price: "Rs. 4,999",
  description:
    "A premium beauty basket filled with skincare and self-care essentials.",
  items: [
    "Body Lotion",
    "Face Wash",
    "Perfume",
    "Chocolate",
    "Gift Card"
  ],
  delivery: "Delivery all over Pakistan.",
  occasion: "Birthday, Bridal Shower, Self Care"
};

"Baby Gift Basket": {
  image: "images/basket5.jpg",
  price: "Rs. 5,499",
  description:
    "A beautiful baby gift basket with adorable baby essentials.",
  items: [
    "Baby Clothes",
    "Soft Toy",
    "Baby Blanket",
    "Baby Lotion",
    "Gift Box"
  ],
  delivery: "Same day delivery in Lahore.",
  occasion: "Baby Shower, Newborn Gift"
};

"Coffee Lover Basket": {
  image: "images/basket6.jpeg",
  price: "Rs. 3,999",
  description:
    "A luxury coffee hamper for coffee lovers with premium treats.",
  items: [
    "Premium Coffee",
    "Coffee Mug",
    "Cookies",
    "Chocolate",
    "Greeting Card"
  ],
  delivery: "Nationwide delivery available.",
  occasion: "Corporate Gift, Birthday"
};

"Wedding Hamper": {
  image: "images/basket7.jpeg",
  price: "Rs. 6,999",
  description:
    "An elegant wedding hamper designed with luxury products.",
  items: [
    "Fresh Flowers",
    "Luxury Chocolates",
    "Scented Candle",
    "Greeting Card",
    "Gift Basket"
  ],
  delivery: "Delivery across Pakistan.",
  occasion: "Wedding, Anniversary"
};

" Premium Surprise Box": {
  image: "images/basket8.jpeg",
  price: "Rs. 8,999",
  description:
    "Our most luxurious premium basket with imported products.",
  items: [
    "Imported Chocolates",
    "Luxury Perfume",
    "Fresh Roses",
    "Premium Teddy",
    "Luxury Packaging"
  ],
  delivery: "Nationwide premium delivery.",
  occasion: "Luxury Gift, Anniversary, VIP Gift"
}
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

    const name = card.querySelector("h3").innerText;

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
  searchInput.addEventListener("keyup", function () {
    const value = this.value.toLowerCase();

    document.querySelectorAll(".product-card").forEach((card) => {
      const name = card.dataset.name.toLowerCase();

      if (name.includes(value)) {
        card.style.display = "block";
      } else {
        card.style.display = "none";
      }
    });
  });
}


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

    const name = card.querySelector("h3").innerText;

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
  searchInput.addEventListener("keyup", function () {
    const value = this.value.toLowerCase();

    document.querySelectorAll(".product-card").forEach((card) => {
      const name = card.dataset.name.toLowerCase();

      if (name.includes(value)) {
        card.style.display = "block";
      } else {
        card.style.display = "none";
      }
    });
  });
}
