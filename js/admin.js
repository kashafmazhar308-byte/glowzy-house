let products = JSON.parse(localStorage.getItem("products")) || [];

document.getElementById("productForm").addEventListener("submit", function (e) {
  e.preventDefault();

  const newProduct = {
    id: Date.now(),
    name: document.getElementById("name").value,
    price: document.getElementById("price").value,
    image: document.getElementById("image").value,
  };

  products.push(newProduct);
  localStorage.setItem("products", JSON.stringify(products));

  alert("Product Added Successfully ✅");

  this.reset();
});
let products = JSON.parse(localStorage.getItem("products")) || [];

function loadProducts() {
  const container = document.querySelector(".product-grid");
  container.innerHTML = "";

  products.forEach((p) => {
    container.innerHTML += `
      <div class="product-card">
        <div class="product-image">
          <img src="${p.image}">
        </div>
        <div class="product-info">
          <h3>${p.name}</h3>
          <h4>Rs ${p.price}</h4>
          <button onclick="addToCart(${p.id})">Add to Cart</button>
        </div>
      </div>
    `;
  });
}

loadProducts(function addToCart(id) {
  let product = products.find((p) => p.id === id);

  let cart = JSON.parse(localStorage.getItem("cart")) || [];

  let existing = cart.find((item) => item.id === id);

  if (existing) {
    existing.qty += 1;
  } else {
    cart.push({ ...product, qty: 1 });
  }

  localStorage.setItem("cart", JSON.stringify(cart));

  alert("Added to cart ✅");
});
