document.addEventListener("DOMContentLoaded", () => {
  const SUPABASE_URL = "https://qugmjqltsqsurqvpjkxg.supabase.co";

  const SUPABASE_ANON_KEY = "sb_publishable_OaMCCPC97d20gh9qfRBS3Q_xwm3DJBJ";

  const isConfigured =
    SUPABASE_URL.startsWith("https://") && SUPABASE_ANON_KEY.length > 20;

  const configNotice = document.getElementById("configNotice");
  const loginSection = document.getElementById("loginSection");
  const dashboardApp = document.getElementById("dashboardApp");
  const loginForm = document.getElementById("loginForm");
  const loginMessage = document.getElementById("loginMessage");
  const adminEmail = document.getElementById("adminEmail");
  const globalMessage = document.getElementById("globalMessage");

  const pageTitle = document.getElementById("pageTitle");
  const sections = {
    dashboard: document.getElementById("dashboardSection"),
    products: document.getElementById("productsSection"),
    orders: document.getElementById("ordersSection"),
    inquiries: document.getElementById("inquiriesSection"),
  };

  const supabaseClient = isConfigured
    ? window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
    : null;

  if (!isConfigured) {
    configNotice.classList.remove("hidden");
  }

  function setMessage(element, text, type = "normal") {
    if (!element) return;
    element.textContent = text;
    element.style.color =
      type === "error" ? "#b54e4e" : type === "success" ? "#3e7d58" : "";
  }

  function money(value) {
    return `Rs. ${Number(value || 0).toLocaleString()}`;
  }

  function dateTime(value) {
    if (!value) return "-";
    return new Date(value).toLocaleString("en-PK", {
      dateStyle: "medium",
      timeStyle: "short",
    });
  }

  function escapeHtml(value = "") {
    return String(value)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }

  function statusClass(status) {
    const normalized = String(status || "").toLowerCase();
    if (normalized === "new") return "status-new";
    if (normalized === "confirmed") return "status-confirmed";
    if (normalized === "cancelled") return "status-cancelled";
    return "";
  }

  function showSection(name) {
    Object.entries(sections).forEach(([key, section]) => {
      section.classList.toggle("active-section", key === name);
    });

    document.querySelectorAll(".nav-item").forEach((button) => {
      button.classList.toggle("active", button.dataset.section === name);
    });

    const titles = {
      dashboard: "Dashboard",
      products: "Products",
      orders: "Orders",
      inquiries: "Inquiries",
    };

    pageTitle.textContent = titles[name] || "Dashboard";
  }

  document.querySelectorAll(".nav-item").forEach((button) => {
    button.addEventListener("click", () => showSection(button.dataset.section));
  });

  document.querySelectorAll("[data-go]").forEach((button) => {
    button.addEventListener("click", () => showSection(button.dataset.go));
  });

  async function loadDashboard() {
    if (!supabaseClient) return;

    const [productsResult, ordersResult, inquiriesResult] = await Promise.all([
      supabaseClient.from("products").select("id,active"),
      supabaseClient
        .from("orders")
        .select("id,status,created_at")
        .order("created_at", { ascending: false }),
      supabaseClient
        .from("inquiries")
        .select("id,status,created_at")
        .order("created_at", { ascending: false }),
    ]);

    if (productsResult.error) throw productsResult.error;
    if (ordersResult.error) throw ordersResult.error;
    if (inquiriesResult.error) throw inquiriesResult.error;

    const products = productsResult.data || [];
    const orders = ordersResult.data || [];
    const inquiries = inquiriesResult.data || [];

    document.getElementById("statProducts").textContent = products.filter(
      (p) => p.active,
    ).length;

    document.getElementById("statOrders").textContent = orders.length;

    document.getElementById("statNewOrders").textContent = orders.filter(
      (o) => String(o.status).toLowerCase() === "new",
    ).length;

    document.getElementById("statInquiries").textContent = inquiries.length;
  }

  async function loadRecentOrders() {
    const box = document.getElementById("recentOrders");

    const { data, error } = await supabaseClient
      .from("orders")
      .select("id,customer_name,total,status,created_at")
      .order("created_at", { ascending: false })
      .limit(5);

    if (error) throw error;

    if (!data.length) {
      box.innerHTML = '<div class="empty-state">No orders yet.</div>';
      return;
    }

    box.innerHTML = `
      <table class="table">
        <thead>
          <tr>
            <th>Customer</th>
            <th>Total</th>
            <th>Status</th>
            <th>Date</th>
          </tr>
        </thead>
        <tbody>
          ${data
            .map(
              (order) => `
            <tr>
              <td>${escapeHtml(order.customer_name)}</td>
              <td>${escapeHtml(order.total || "Rs. 0")}</td>
              <td><span class="status ${statusClass(order.status)}">${escapeHtml(order.status || "New")}</span></td>
              <td>${escapeHtml(dateTime(order.created_at))}</td>
            </tr>
          `,
            )
            .join("")}
        </tbody>
      </table>
    `;
  }

  async function loadRecentInquiries() {
    const box = document.getElementById("recentInquiries");

    const { data, error } = await supabaseClient
      .from("inquiries")
      .select("id,name,occasion,budget,status,created_at")
      .order("created_at", { ascending: false })
      .limit(5);

    if (error) throw error;

    if (!data.length) {
      box.innerHTML = '<div class="empty-state">No inquiries yet.</div>';
      return;
    }

    box.innerHTML = `
      <table class="table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Occasion</th>
            <th>Budget</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          ${data
            .map(
              (item) => `
            <tr>
              <td>${escapeHtml(item.name)}</td>
              <td>${escapeHtml(item.occasion)}</td>
              <td>${escapeHtml(item.budget)}</td>
              <td><span class="status ${statusClass(item.status)}">${escapeHtml(item.status || "New")}</span></td>
            </tr>
          `,
            )
            .join("")}
        </tbody>
      </table>
    `;
  }

  async function loadProducts() {
    const box = document.getElementById("productsTable");

    const { data, error } = await supabaseClient
      .from("products")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw error;

    if (!data.length) {
      box.innerHTML = '<div class="empty-state">No products added yet.</div>';
      return;
    }

    box.innerHTML = `
      <table class="table">
        <thead>
          <tr>
            <th>Product</th>
            <th>Price</th>
            <th>Category</th>
            <th>Live</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          ${data
            .map(
              (product) => `
            <tr>
              <td>
                <div style="display:flex;gap:10px;align-items:center">
                  <img class="product-thumb" src="${escapeHtml(product.image)}" alt="">
                  <div>
                    <strong>${escapeHtml(product.name)}</strong>
                    <div style="color:#8b7a6d;font-size:11px">${escapeHtml(product.badge || "")}</div>
                  </div>
                </div>
              </td>
              <td>${money(product.price)}</td>
              <td>${escapeHtml(product.category || "general")}</td>
              <td>${product.active ? "Yes" : "No"}</td>
              <td>
                <div class="table-actions">
                  <button data-edit-product="${product.id}">Edit</button>
                  <button data-delete-product="${product.id}">Delete</button>
                </div>
              </td>
            </tr>
          `,
            )
            .join("")}
        </tbody>
      </table>
    `;

    box.querySelectorAll("[data-edit-product]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const product = data.find(
          (item) => item.id === btn.dataset.editProduct,
        );
        openProductForm(product);
      });
    });

    box.querySelectorAll("[data-delete-product]").forEach((btn) => {
      btn.addEventListener("click", async () => {
        if (!confirm("Delete this product?")) return;

        const { error } = await supabaseClient
          .from("products")
          .delete()
          .eq("id", btn.dataset.deleteProduct);

        if (error) {
          setMessage(globalMessage, error.message, "error");
          return;
        }

        setMessage(globalMessage, "Product deleted.", "success");
        await refreshAll();
      });
    });
  }

  async function loadOrders() {
    const box = document.getElementById("ordersTable");

    const { data, error } = await supabaseClient
      .from("orders")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw error;

    if (!data.length) {
      box.innerHTML = '<div class="empty-state">No orders yet.</div>';
      return;
    }

    box.innerHTML = `
      <table class="table">
        <thead>
          <tr>
            <th>Customer</th>
            <th>Contact</th>
            <th>Address</th>
            <th>Payment</th>
            <th>Total</th>
            <th>Status</th>
            <th>Order</th>
            <th>Date</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          ${data
            .map(
              (order) => `
            <tr>
              <td>${escapeHtml(order.customer_name)}</td>
              <td>${escapeHtml(order.phone)}<br>${escapeHtml(order.email || "")}</td>
              <td>${escapeHtml(order.address)}</td>
              <td>${escapeHtml(order.payment_method)}</td>
              <td>${escapeHtml(order.total || "Rs. 0")}</td>
              <td><span class="status ${statusClass(order.status)}">${escapeHtml(order.status || "New")}</span></td>
              <td style="white-space:pre-line">${escapeHtml(
                Array.isArray(order.order_details)
                  ? order.order_details
                      .map((i) => `${i.name} x${i.quantity}`)
                      .join("\n")
                  : String(order.order_details || ""),
              )}</td>
              <td>${escapeHtml(dateTime(order.created_at))}</td>
              <td>
                <select data-order-status="${order.id}">
                  ${["New", "Confirmed", "Packed", "Delivered", "Cancelled"]
                    .map(
                      (status) =>
                        `<option ${status === (order.status || "New") ? "selected" : ""}>${status}</option>`,
                    )
                    .join("")}
                </select>
              </td>
            </tr>
          `,
            )
            .join("")}
        </tbody>
      </table>
    `;

    box.querySelectorAll("[data-order-status]").forEach((select) => {
      select.addEventListener("change", async () => {
        const { error } = await supabaseClient
          .from("orders")
          .update({ status: select.value })
          .eq("id", select.dataset.orderStatus);

        if (error) setMessage(globalMessage, error.message, "error");
        else {
          setMessage(globalMessage, "Order status updated.", "success");
          await refreshAll();
        }
      });
    });
  }

  async function loadInquiries() {
    const box = document.getElementById("inquiriesTable");

    const { data, error } = await supabaseClient
      .from("inquiries")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw error;

    if (!data.length) {
      box.innerHTML = '<div class="empty-state">No inquiries yet.</div>';
      return;
    }

    box.innerHTML = `
      <table class="table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Occasion</th>
            <th>Budget</th>
            <th>Date</th>
            <th>Gift Details</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          ${data
            .map(
              (item) => `
            <tr>
              <td>${escapeHtml(item.name)}</td>
              <td>${escapeHtml(item.occasion)}</td>
              <td>${escapeHtml(item.budget)}</td>
              <td>${escapeHtml(item.preferred_date || "-")}</td>
              <td>${escapeHtml(item.gift_details)}</td>
              <td><span class="status ${statusClass(item.status)}">${escapeHtml(item.status || "New")}</span></td>
              <td>
                <select data-inquiry-status="${item.id}">
                  ${["New", "Contacted", "Closed"]
                    .map(
                      (status) =>
                        `<option ${status === (item.status || "New") ? "selected" : ""}>${status}</option>`,
                    )
                    .join("")}
                </select>
              </td>
            </tr>
          `,
            )
            .join("")}
        </tbody>
      </table>
    `;

    box.querySelectorAll("[data-inquiry-status]").forEach((select) => {
      select.addEventListener("change", async () => {
        const { error } = await supabaseClient
          .from("inquiries")
          .update({ status: select.value })
          .eq("id", select.dataset.inquiryStatus);

        if (error) setMessage(globalMessage, error.message, "error");
        else {
          setMessage(globalMessage, "Inquiry status updated.", "success");
          await refreshAll();
        }
      });
    });
  }

  function resetProductForm() {
    document.getElementById("productId").value = "";
    document.getElementById("productName").value = "";
    document.getElementById("productPrice").value = "";
    document.getElementById("productImage").value = "";
    document.getElementById("productCategory").value = "birthday";
    document.getElementById("productBadge").value = "";
    document.getElementById("productDescription").value = "";
    document.getElementById("productActive").checked = true;
    document.getElementById("productFormTitle").textContent = "Add Product";
    setMessage(document.getElementById("productMessage"), "");
  }

  function openProductForm(product = null) {
    document.getElementById("productFormCard").classList.remove("hidden");

    if (!product) {
      resetProductForm();
      return;
    }

    document.getElementById("productFormTitle").textContent = "Edit Product";
    document.getElementById("productId").value = product.id;
    document.getElementById("productName").value = product.name || "";
    document.getElementById("productPrice").value = product.price || "";
    document.getElementById("productImage").value = product.image || "";
    document.getElementById("productCategory").value =
      product.category || "general";
    document.getElementById("productBadge").value = product.badge || "";
    document.getElementById("productDescription").value =
      product.description || "";
    document.getElementById("productActive").checked = Boolean(product.active);
  }

  function closeProductForm() {
    document.getElementById("productFormCard").classList.add("hidden");
    resetProductForm();
  }

  async function refreshAll() {
    if (!supabaseClient) return;

    try {
      await Promise.all([
        loadDashboard(),
        loadRecentOrders(),
        loadRecentInquiries(),
        loadProducts(),
        loadOrders(),
        loadInquiries(),
      ]);
    } catch (error) {
      console.error(error);
      setMessage(
        globalMessage,
        error.message || "Could not load admin data.",
        "error",
      );
    }
  }

  document.getElementById("newProductBtn").addEventListener("click", () => {
    openProductForm();
  });

  document
    .getElementById("cancelProductBtn")
    .addEventListener("click", closeProductForm);
  document
    .getElementById("cancelProductBtn2")
    .addEventListener("click", closeProductForm);

  document
    .getElementById("productForm")
    .addEventListener("submit", async (e) => {
      e.preventDefault();

      const id = document.getElementById("productId").value;
      const payload = {
        name: document.getElementById("productName").value.trim(),
        price: Number(document.getElementById("productPrice").value),
        image: document.getElementById("productImage").value.trim(),
        category: document.getElementById("productCategory").value,
        badge: document.getElementById("productBadge").value.trim(),
        description: document.getElementById("productDescription").value.trim(),
        active: document.getElementById("productActive").checked,
      };

      try {
        const result = id
          ? await supabaseClient.from("products").update(payload).eq("id", id)
          : await supabaseClient.from("products").insert(payload);

        if (result.error) throw result.error;

        setMessage(
          document.getElementById("productMessage"),
          "Product saved.",
          "success",
        );
        await refreshAll();
        setTimeout(closeProductForm, 500);
      } catch (error) {
        setMessage(
          document.getElementById("productMessage"),
          error.message,
          "error",
        );
      }
    });

  document
    .getElementById("refreshOrdersBtn")
    .addEventListener("click", refreshAll);
  document
    .getElementById("refreshInquiriesBtn")
    .addEventListener("click", refreshAll);

  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    if (!supabaseClient) {
      setMessage(
        loginMessage,
        "Configure Supabase in admin.js first.",
        "error",
      );
      return;
    }

    setMessage(loginMessage, "Signing in...");

    const { error } = await supabaseClient.auth.signInWithPassword({
      email: document.getElementById("loginEmail").value.trim(),
      password: document.getElementById("loginPassword").value,
    });

    if (error) {
      setMessage(loginMessage, error.message, "error");
      return;
    }

    setMessage(loginMessage, "Signed in.", "success");
    await boot();
  });

  document.getElementById("logoutBtn").addEventListener("click", async () => {
    if (!supabaseClient) return;
    await supabaseClient.auth.signOut();
    dashboardApp.classList.add("hidden");
    loginSection.classList.remove("hidden");
    adminEmail.textContent = "";
  });

  async function boot() {
    if (!supabaseClient) return;

    const { data } = await supabaseClient.auth.getSession();
    const session = data.session;

    if (!session) {
      dashboardApp.classList.add("hidden");
      loginSection.classList.remove("hidden");
      return;
    }

    adminEmail.textContent = session.user.email || "";
    loginSection.classList.add("hidden");
    dashboardApp.classList.remove("hidden");

    await refreshAll();
  }

  if (supabaseClient) {
    supabaseClient.auth.onAuthStateChange((_event, session) => {
      if (session) {
        adminEmail.textContent = session.user.email || "";
        loginSection.classList.add("hidden");
        dashboardApp.classList.remove("hidden");
      }
    });
  }

  boot();
});
