// ==============================
// Glowzy House
// script.js
// ==============================

// Navbar Shadow

const header = document.querySelector("header");

window.addEventListener("scroll", () => {
  if (header) {
    header.style.boxShadow =
      window.scrollY > 50 ? "0 10px 25px rgba(0,0,0,.08)" : "none";
  }
});

// Fade Animation

const sections = document.querySelectorAll("section");

if (sections.length) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("show");
        }
      });
    },
    { threshold: 0.2 },
  );

  sections.forEach((section) => observer.observe(section));
}

// Hero Image Effect

const heroImage = document.querySelector(".hero-image img");

if (heroImage) {
  heroImage.addEventListener("mouseenter", () => {
    heroImage.style.transform = "scale(1.03)";
  });

  heroImage.addEventListener("mouseleave", () => {
    heroImage.style.transform = "scale(1)";
  });
}

// Wishlist

document.querySelectorAll(".wishlist").forEach((heart) => {
  heart.addEventListener("click", () => {
    heart.classList.toggle("fa-regular");

    heart.classList.toggle("fa-solid");

    heart.classList.toggle("active");
  });
});

// Current Year

const year = document.getElementById("year");

if (year) {
  year.textContent = new Date().getFullYear();
}

console.log("Glowzy House Loaded Successfully ✨");
// ==============================
// HOME PAGE - ADD TO CART
// ==============================

document.querySelectorAll(".home-cart-btn").forEach((button) => {
  button.addEventListener("click", function () {
    const product = {
      name: this.dataset.name,
      price: Number(this.dataset.price),
      image: this.dataset.image,
      quantity: 1,
    };

    let cart = JSON.parse(localStorage.getItem("cart")) || [];

    const existingProduct = cart.find((item) => item.name === product.name);

    if (existingProduct) {
      existingProduct.quantity += 1;
    } else {
      cart.push(product);
    }

    localStorage.setItem("cart", JSON.stringify(cart));

    // Update cart count
    const cartCount = document.querySelector(".cart-count");

    if (cartCount) {
      const totalItems = cart.reduce((total, item) => total + item.quantity, 0);

      cartCount.textContent = totalItems;
    }

    // Button feedback
    const originalText = this.textContent;

    this.textContent = "Added ✓";

    setTimeout(() => {
      this.textContent = originalText;
    }, 1500);
  });
});


/* =========================================================
   GLOWZY HOUSE — UX UPGRADE
========================================================= */

document.addEventListener("DOMContentLoaded", () => {
  // Keep cart count correct after refresh.
  const updateCartCount = () => {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    const totalItems = cart.reduce((total, item) => total + Number(item.quantity || 0), 0);
    document.querySelectorAll(".cart-count").forEach(el => {
      el.textContent = totalItems;
    });
  };

  updateCartCount();

  // Small success toast for home-page cart buttons.
  document.querySelectorAll(".home-cart-btn").forEach(button => {
    button.addEventListener("click", () => {
      updateCartCount();

      const card = button.closest(".product-card");
      const name = card?.querySelector("h3")?.textContent?.trim() || "Gift";

      let toast = document.querySelector(".gh-toast");
      if (!toast) {
        toast = document.createElement("div");
        toast.className = "gh-toast";
        toast.setAttribute("role", "status");
        document.body.appendChild(toast);
      }

      toast.textContent = `${name} added to your cart ✓`;
      toast.classList.add("show");

      clearTimeout(window.ghToastTimer);
      window.ghToastTimer = setTimeout(() => toast.classList.remove("show"), 1800);
    });
  });

  // Make the search icon useful without changing the existing search system.
  const searchLink = document.querySelector('.nav-icons a[href="#"]');
  if (searchLink && !searchLink.dataset.searchReady) {
    searchLink.dataset.searchReady = "true";
    searchLink.addEventListener("click", (event) => {
      event.preventDefault();
      window.location.href = "shop.html";
    });
    searchLink.setAttribute("aria-label", "Search gifts");
  }
});
