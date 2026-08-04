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
