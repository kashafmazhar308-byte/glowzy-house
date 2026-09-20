/// ==============================
// GLOWZY HOUSE
// ==============================

document.addEventListener("DOMContentLoaded", () => {
  /* =========================
       NAVBAR SHADOW
    ========================= */

  const header = document.querySelector("header");

  function updateHeaderShadow() {
    if (!header) return;

    header.style.boxShadow =
      window.scrollY > 50 ? "0 10px 25px rgba(0,0,0,.08)" : "none";
  }

  window.addEventListener("scroll", updateHeaderShadow);
  updateHeaderShadow();

  /* =========================
       MOBILE MENU
    ========================= */

  const menuToggle = document.querySelector(".menu-toggle");
  const navMenu = document.querySelector(".nav-menu");

  if (menuToggle && navMenu) {
    menuToggle.addEventListener("click", () => {
      const isOpen = navMenu.classList.toggle("active");

      menuToggle.setAttribute("aria-expanded", isOpen);

      menuToggle.innerHTML = isOpen
        ? '<i class="fa-solid fa-xmark"></i>'
        : '<i class="fa-solid fa-bars"></i>';
    });

    // Close menu after clicking a link
    navMenu.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        navMenu.classList.remove("active");

        menuToggle.setAttribute("aria-expanded", "false");

        menuToggle.innerHTML = '<i class="fa-solid fa-bars"></i>';
      });
    });

    // Close menu when clicking outside
    document.addEventListener("click", (event) => {
      if (
        !navMenu.contains(event.target) &&
        !menuToggle.contains(event.target)
      ) {
        navMenu.classList.remove("active");

        menuToggle.setAttribute("aria-expanded", "false");

        menuToggle.innerHTML = '<i class="fa-solid fa-bars"></i>';
      }
    });
  }

  /* =========================
       FADE ANIMATION
    ========================= */

  const sections = document.querySelectorAll("section");

  if (sections.length && "IntersectionObserver" in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("show");
          }
        });
      },
      { threshold: 0.15 },
    );

    sections.forEach((section) => observer.observe(section));
  }

  /* =========================
       HERO IMAGE
    ========================= */

  const heroImage = document.querySelector(".hero-image img");

  if (heroImage) {
    heroImage.addEventListener("mouseenter", () => {
      heroImage.style.transform = "scale(1.03)";
    });

    heroImage.addEventListener("mouseleave", () => {
      heroImage.style.transform = "scale(1)";
    });
  }

  /* =========================
       WISHLIST
    ========================= */

  document.querySelectorAll(".wishlist").forEach((heart) => {
    heart.addEventListener("click", () => {
      heart.classList.toggle("fa-regular");
      heart.classList.toggle("fa-solid");
      heart.classList.toggle("active");
    });
  });

  /* =========================
       CURRENT YEAR
    ========================= */

  const year = document.getElementById("year");

  if (year) {
    year.textContent = new Date().getFullYear();
  }

  /* =========================
       CART COUNT
    ========================= */

  function updateCartCount() {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];

    const totalItems = cart.reduce(
      (total, item) => total + Number(item.quantity || 0),
      0,
    );

    document.querySelectorAll(".cart-count").forEach((el) => {
      el.textContent = totalItems;
    });
  }

  updateCartCount();

  /* =========================
       HOME ADD TO CART
    ========================= */

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

      updateCartCount();

      /* Button feedback */

      const originalText = this.textContent;

      this.textContent = "Added ✓";
      this.disabled = true;

      setTimeout(() => {
        this.textContent = originalText;
        this.disabled = false;
      }, 1200);

      /* Toast */

      const card = this.closest(".product-card");

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

      window.ghToastTimer = setTimeout(() => {
        toast.classList.remove("show");
      }, 1800);
    });
  });

  /* =========================
       SEARCH ICON
    ========================= */

  const searchLink = document.querySelector('.nav-icons a[href="#"]');

  if (searchLink) {
    searchLink.addEventListener("click", (event) => {
      event.preventDefault();

      window.location.href = "shop.html";
    });

    searchLink.setAttribute("aria-label", "Search gifts");
  }
});

console.log("Glowzy House Loaded Successfully ✨");
