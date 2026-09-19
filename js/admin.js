document.addEventListener("DOMContentLoaded", () => {
  const SUPABASE_URL = "https://qugmjqltsqsurqvpjkxg.supabase.co";
  const SUPABASE_PUBLISHABLE_KEY =
    "sb_publishable_OaMCCPC97d20gh9qfRBS3Q_xwm3DJBJ";

  const isConfigured =
    SUPABASE_URL.startsWith("https://") && SUPABASE_PUBLISHABLE_KEY.length > 20;

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
    customers: document.getElementById("customersSection"),
  };

  const supabaseClient = isConfigured
    ? window.supabase.createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY)
    : null;

  let cache = {
    products: [],
    orders: [],
    inquiries: [],
  };

  if (!isConfigured) {
    configNotice.classList.remove("hidden");
  }

  function setMessage(element, text, type = "normal") {
    if (!element) return;
    element.textContent = text;
    element.style.color =
      type === "error" ? "#b54e4e" : type === "success" ? "#3e7d58" : "";
  }

  function escapeHtml(value = "") {
    return String(value)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }

  function money(value) {
    return `Rs. ${Number(value || 0).toLocaleString()}`;
  }

  function parseMoney(value) {
    if (typeof value === "number") return value;
    return Number(String(value || "").replace(/[^\d.-]/g, "")) || 0;
  }

  function dateTime(value) {
    if (!value) return "-";

    return new Date(value).toLocaleString("en-PK", {
      dateStyle: "medium",
      timeStyle: "short",
    });
  }

  function shortDate(value) {
    if (!value) return "-";

    return new Date(value).toLocaleDateString("en-PK", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  }

  function statusClass(status) {
    const normalized = String(status || "").toLowerCase();

    if (normalized === "new") return "status-new";
    if (normalized === "confirmed") return "status-confirmed";
    if (normalized === "contacted") return "status-contacted";
    if (normalized === "cancelled") return "status-cancelled";
    if (normalized === "closed") return "status-closed";

    return "";
  }

  function normalizePhone(phone) {
    const digits = String(phone || "").replace(/\D/g, "");

    if (digits.startsWith("0")) {
      return "92" + digits.slice(1);
    }

    if (digits.startsWith("92")) {
      return digits;
    }

    return digits;
  }

  function whatsappLink(phone, name) {
    const normalized = normalizePhone(phone);

    if (!normalized) return "#";

    const text =
      `Assalam o Alaikum ${name || ""}, ` +
      `Glowzy House ke order ke hawale se rabta kar raha/rahi hoon.`;

    return `https://wa.me/${normalized}?text=${encodeURIComponent(text)}`;
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
      inquiries: "Contact",
      customers: "Customers",
    };

    pageTitle.textContent = titles[name] || "Dashboard";
  }

  document.querySelectorAll(".nav-item").forEach((button) => {
    button.addEventListener("click", () => {
      showSection(button.dataset.section);
    });
  });

  document.querySelectorAll("[data-go]").forEach((button) => {
    button.addEventListener("click", () => {
      showSection(button.dataset.go);
    });
  });

  async function loadAllData() {
    const [productsResult, ordersResult, inquiriesResult] = await Promise.all([
      supabaseClient
        .from("products")
        .select("*")
        .order("created_at", { ascending: false }),

      supabaseClient
        .from("orders")
        .select("*")
        .order("created_at", { ascending: false }),

      supabaseClient
        .from("inquiries")
        .select("*")
        .order("created_at", { ascending: false }),
    ]);

    if (productsResult.error) throw productsResult.error;
    if (ordersResult.error) throw ordersResult.error;
    if (inquiriesResult.error) throw inquiriesResult.error;

    cache.products = productsResult.data || [];
    cache.orders = ordersResult.data || [];
    cache.inquiries = inquiriesResult.data || [];
  }

  function getPeriodOrders() {
    const period = document.getElementById("salesPeriod").value;

    if (period === "all") {
      return cache.orders;
    }

    const now = new Date();

    if (period === "today") {
      const start = new Date(now.getFullYear(), now.getMonth(), now.getDate());

      return cache.orders.filter(
        (order) => new Date(order.created_at) >= start,
      );
    }

    const days = Number(period);
    const cutoff = new Date(now.getTime() - days * 24 * 60 * 60 * 1000);

    return cache.orders.filter((order) => new Date(order.created_at) >= cutoff);
  }

  function buildCustomers() {
    const map = new Map();

    cache.orders.forEach((order) => {
      const key = String(
        order.phone || order.email || order.customer_name || "",
      )
        .trim()
        .toLowerCase();

      if (!key) return;

      if (!map.has(key)) {
        map.set(key, {
          name: order.customer_name || "-",
          phone: order.phone || "",
          email: order.email || "",
          orders: 0,
          spent: 0,
          lastOrder: order.created_at,
        });
      }

      const customer = map.get(key);

      customer.orders += 1;
      customer.spent += parseMoney(order.total);

      if (new Date(order.created_at) > new Date(customer.lastOrder)) {
        customer.lastOrder = order.created_at;
      }
    });

    return Array.from(map.values()).sort(
      (a, b) => new Date(b.lastOrder) - new Date(a.lastOrder),
    );
  }

  function renderDashboard() {
    const periodOrders = getPeriodOrders();

    const sales = periodOrders.reduce(
      (sum, order) => sum + parseMoney(order.total),
      0,
    );

    const customers = buildCustomers();

    document.getElementById("statSales").textContent = money(sales);

    document.getElementById("statOrders").textContent = periodOrders.length;

    document.getElementById("statNewOrders").textContent = periodOrders.filter(
      (order) => String(order.status || "New").toLowerCase() === "new",
    ).length;

    document.getElementById("statCustomers").textContent = customers.length;

    document.getElementById("statProducts").textContent = cache.products.filter(
      (product) => product.active,
    ).length;

    document.getElementById("statInquiries").textContent =
      cache.inquiries.length;

    renderRecentOrders();
    renderRecentInquiries();
  }

  function renderRecentOrders() {
    const box = document.getElementById("recentOrders");

    const data = cache.orders.slice(0, 5);

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
                  <td>
                    <span class="status ${statusClass(order.status)}">
                      ${escapeHtml(order.status || "New")}
                    </span>
                  </td>
                  <td>${escapeHtml(dateTime(order.created_at))}</td>
                </tr>
              `,
            )
            .join("")}
        </tbody>
      </table>
    `;
  }

  function renderRecentInquiries() {
    const box = document.getElementById("recentInquiries");

    const data = cache.inquiries.slice(0, 5);

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
                  <td>
                    <span class="status ${statusClass(item.status)}">
                      ${escapeHtml(item.status || "New")}
                    </span>
                  </td>
                </tr>
              `,
            )
            .join("")}
        </tbody>
      </table>
    `;
  }

  function renderProducts() {
    const box = document.getElementById("productsTable");

    const query = document
      .getElementById("productSearch")
      .value.trim()
      .toLowerCase();

    const data = cache.products.filter((product) =>
      `${product.name} ${product.category} ${product.badge || ""}`
        .toLowerCase()
        .includes(query),
    );

    if (!data.length) {
      box.innerHTML = '<div class="empty-state">No products found.</div>';
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
                      <img
                        class="product-thumb"
                        src="${escapeHtml(product.image)}"
                        alt=""
                      >
                      <div>
                        <strong>
                          ${escapeHtml(product.name)}
                        </strong>

                        <div style="color:#8b7a6d;font-size:11px">
                          ${escapeHtml(product.badge || "")}
                        </div>
                      </div>
                    </div>
                  </td>

                  <td>${money(product.price)}</td>

                  <td>
                    ${escapeHtml(product.category || "general")}
                  </td>

                  <td>${product.active ? "Yes" : "No"}</td>

                  <td>
                    <div class="table-actions">
                      <button
                        data-edit-product="${product.id}">
                        Edit
                      </button>

                      <button
                        data-delete-product="${product.id}">
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              `,
            )
            .join("")}
        </tbody>
      </table>
    `;

    box.querySelectorAll("[data-edit-product]").forEach((button) => {
      button.addEventListener("click", () => {
        const product = cache.products.find(
          (item) => item.id === button.dataset.editProduct,
        );

        openProductForm(product);
      });
    });

    box.querySelectorAll("[data-delete-product]").forEach((button) => {
      button.addEventListener("click", async () => {
        if (!confirm("Delete this product?")) {
          return;
        }

        const { error } = await supabaseClient
          .from("products")
          .delete()
          .eq("id", button.dataset.deleteProduct);

        if (error) {
          setMessage(globalMessage, error.message, "error");
          return;
        }

        setMessage(globalMessage, "Product deleted.", "success");

        await refreshAll();
      });
    });
  }

  function renderOrders() {
    const box = document.getElementById("ordersTable");

    const query = document
      .getElementById("orderSearch")
      .value.trim()
      .toLowerCase();

    const statusFilter = document.getElementById("orderStatusFilter").value;

    const data = cache.orders.filter((order) => {
      const searchable = `${order.customer_name || ""} ${
        order.phone || ""
      } ${order.address || ""} ${order.email || ""}`.toLowerCase();

      const matchesSearch = searchable.includes(query);

      const matchesStatus =
        statusFilter === "all" || (order.status || "New") === statusFilter;

      return matchesSearch && matchesStatus;
    });

    if (!data.length) {
      box.innerHTML = '<div class="empty-state">No orders found.</div>';
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
            <th>Order</th>
            <th>Status</th>
            <th>Date</th>
          </tr>
        </thead>

        <tbody>
          ${data
            .map((order) => {
              let details = "";

              if (Array.isArray(order.order_details)) {
                details = order.order_details
                  .map((item) => `${item.name} ×${item.quantity}`)
                  .join("<br>");
              } else {
                details = String(order.order_details || "").replaceAll(
                  "\n",
                  "<br>",
                );
              }

              return `
                <tr>
                  <td>
                    <strong>
                      ${escapeHtml(order.customer_name)}
                    </strong>
                  </td>

                  <td>
                    ${escapeHtml(order.phone)}
                    <br>
                    ${escapeHtml(order.email || "")}

                    <div class="table-actions" style="margin-top:7px">
                      <a
                        href="${whatsappLink(order.phone, order.customer_name)}"
                        target="_blank"
                        rel="noopener">
                        WhatsApp
                      </a>
                    </div>
                  </td>

                  <td>
                    ${escapeHtml(order.address)}
                  </td>

                  <td>
                    ${escapeHtml(order.payment_method)}
                  </td>

                  <td class="customer-total">
                    ${escapeHtml(order.total || "Rs. 0")}
                  </td>

                  <td style="line-height:1.7">
                    ${details}
                  </td>

                  <td>
                    <select data-order-status="${order.id}">
                      ${["New", "Confirmed", "Packed", "Delivered", "Cancelled"]
                        .map(
                          (status) =>
                            `<option ${
                              status === (order.status || "New")
                                ? "selected"
                                : ""
                            }>${status}</option>`,
                        )
                        .join("")}
                    </select>
                  </td>

                  <td>
                    ${escapeHtml(dateTime(order.created_at))}
                  </td>
                </tr>
              `;
            })
            .join("")}
        </tbody>
      </table>
    `;

    box.querySelectorAll("[data-order-status]").forEach((select) => {
      select.addEventListener("change", async () => {
        const { error } = await supabaseClient
          .from("orders")
          .update({
            status: select.value,
          })
          .eq("id", select.dataset.orderStatus);

        if (error) {
          setMessage(globalMessage, error.message, "error");
        } else {
          setMessage(globalMessage, "Order status updated.", "success");

          await refreshAll();
        }
      });
    });
  }

  function renderInquiries() {
    const box = document.getElementById("inquiriesTable");

    const query = document
      .getElementById("inquirySearch")
      .value.trim()
      .toLowerCase();

    const statusFilter = document.getElementById("inquiryStatusFilter").value;

    const data = cache.inquiries.filter((item) => {
      const searchable = `${item.name || ""} ${
        item.occasion || ""
      } ${item.budget || ""} ${item.gift_details || ""}`.toLowerCase();

      const matchesSearch = searchable.includes(query);

      const matchesStatus =
        statusFilter === "all" || (item.status || "New") === statusFilter;

      return matchesSearch && matchesStatus;
    });

    if (!data.length) {
      box.innerHTML = '<div class="empty-state">No inquiries found.</div>';
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
                  <td style="min-width:240px">
                    ${escapeHtml(item.gift_details)}
                  </td>
                  <td>
                    <select data-inquiry-status="${item.id}">
                      ${["New", "Contacted", "Closed"]
                        .map(
                          (status) =>
                            `<option ${
                              status === (item.status || "New")
                                ? "selected"
                                : ""
                            }>${status}</option>`,
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
          .update({
            status: select.value,
          })
          .eq("id", select.dataset.inquiryStatus);

        if (error) {
          setMessage(globalMessage, error.message, "error");
        } else {
          setMessage(globalMessage, "Inquiry status updated.", "success");

          await refreshAll();
        }
      });
    });
  }

  function renderCustomers() {
    const box = document.getElementById("customersTable");

    const query = document
      .getElementById("customerSearch")
      .value.trim()
      .toLowerCase();

    const data = buildCustomers().filter((customer) =>
      `${customer.name} ${customer.phone} ${customer.email}`
        .toLowerCase()
        .includes(query),
    );

    if (!data.length) {
      box.innerHTML = '<div class="empty-state">No customers found.</div>';
      return;
    }

    box.innerHTML = `
      <table class="table">
        <thead>
          <tr>
            <th>Customer</th>
            <th>Phone</th>
            <th>Email</th>
            <th>Orders</th>
            <th>Total Spent</th>
            <th>Last Order</th>
            <th>Contact</th>
          </tr>
        </thead>

        <tbody>
          ${data
            .map(
              (customer) => `
                <tr>
                  <td>
                    <strong>
                      ${escapeHtml(customer.name)}
                    </strong>
                  </td>

                  <td>
                    ${escapeHtml(customer.phone)}
                  </td>

                  <td>
                    ${escapeHtml(customer.email || "-")}
                  </td>

                  <td>
                    ${customer.orders}
                  </td>

                  <td class="customer-total">
                    ${money(customer.spent)}
                  </td>

                  <td>
                    ${escapeHtml(shortDate(customer.lastOrder))}
                  </td>

                  <td>
                    <div class="table-actions">
                      ${
                        customer.phone
                          ? `
                            <a
                              href="${whatsappLink(
                                customer.phone,
                                customer.name,
                              )}"
                              target="_blank"
                              rel="noopener">
                              WhatsApp
                            </a>
                          `
                          : ""
                      }

                      ${
                        customer.email
                          ? `
                            <a
                              href="mailto:${encodeURIComponent(
                                customer.email,
                              )}">
                              Email
                            </a>
                          `
                          : ""
                      }
                    </div>
                  </td>
                </tr>
              `,
            )
            .join("")}
        </tbody>
      </table>
    `;
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
      await loadAllData();

      renderDashboard();
      renderProducts();
      renderOrders();
      renderInquiries();
      renderCustomers();
    } catch (error) {
      console.error(error);

      setMessage(
        globalMessage,
        error.message || "Could not load admin data.",
        "error",
      );
    }
  }

  /* Navigation / filters */
  document
    .getElementById("salesPeriod")
    .addEventListener("change", renderDashboard);

  document
    .getElementById("productSearch")
    .addEventListener("input", renderProducts);

  document
    .getElementById("orderSearch")
    .addEventListener("input", renderOrders);

  document
    .getElementById("orderStatusFilter")
    .addEventListener("change", renderOrders);

  document
    .getElementById("inquirySearch")
    .addEventListener("input", renderInquiries);

  document
    .getElementById("inquiryStatusFilter")
    .addEventListener("change", renderInquiries);

  document
    .getElementById("customerSearch")
    .addEventListener("input", renderCustomers);

  document
    .getElementById("refreshOrdersBtn")
    .addEventListener("click", refreshAll);

  document
    .getElementById("refreshInquiriesBtn")
    .addEventListener("click", refreshAll);

  document
    .getElementById("refreshCustomersBtn")
    .addEventListener("click", refreshAll);

  /* Product form */
  document
    .getElementById("newProductBtn")
    .addEventListener("click", () => openProductForm());

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

        if (result.error) {
          throw result.error;
        }

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

  /* Login */
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

  /* Logout */
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
// ================================
// MOBILE SIDEBAR
// ================================

const sidebarToggle = document.getElementById("sidebarToggle");
const sidebar = document.querySelector(".sidebar");
const sidebarOverlay = document.getElementById("sidebarOverlay");
const mobileNavItems = document.querySelectorAll(".nav-item");

function openMobileSidebar() {
  sidebar?.classList.add("mobile-open");
  sidebarOverlay?.classList.add("active");
  document.body.style.overflow = "hidden";
}

function closeMobileSidebar() {
  sidebar?.classList.remove("mobile-open");
  sidebarOverlay?.classList.remove("active");
  document.body.style.overflow = "";
}

sidebarToggle?.addEventListener("click", () => {
  if (sidebar?.classList.contains("mobile-open")) {
    closeMobileSidebar();
  } else {
    openMobileSidebar();
  }
});

sidebarOverlay?.addEventListener("click", closeMobileSidebar);

// Menu item click ke baad sidebar close
mobileNavItems.forEach((item) => {
  item.addEventListener("click", () => {
    if (window.innerWidth <= 700) {
      closeMobileSidebar();
    }
  });
});

// Screen resize hone par sidebar reset
window.addEventListener("resize", () => {
  if (window.innerWidth > 700) {
    closeMobileSidebar();
  }
});
