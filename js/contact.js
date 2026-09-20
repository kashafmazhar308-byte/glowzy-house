// ==========================================
// Glowzy House - Contact / Gift Inquiry JS
// ==========================================

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("giftInquiryForm");
  const message = document.getElementById("formMessage");

  if (!form) return;

  // ==========================================
  // CONFIG
  // ==========================================

  const SUPABASE_URL = "https://qugmjqltsqsurqvpjkxg.supabase.co";

  const SUPABASE_PUBLISHABLE_KEY =
    "sb_publishable_OaMCCPC97d20gh9qfRBS3Q_xwm3DJB";

  const EMAIL_SERVICE_ID = "service_7pt9p6a";
  const EMAIL_TEMPLATE_ID = "template_z5l8d8e";
  const EMAIL_PUBLIC_KEY = "NWzVBEpHEcrgFWThl";

  // ==========================================
  // EMAILJS INITIALIZATION
  // ==========================================

  if (window.emailjs) {
    emailjs.init({
      publicKey: EMAIL_PUBLIC_KEY,
    });
  }

  // ==========================================
  // MESSAGE
  // ==========================================

  function setMessage(text, type = "normal") {
    if (!message) return;

    message.textContent = text;

    message.classList.remove("success", "error");

    if (type === "success") {
      message.classList.add("success");
    }

    if (type === "error") {
      message.classList.add("error");
    }
  }

  // ==========================================
  // SUPABASE
  // ==========================================

  async function saveInquiryToSupabase(inquiry) {
    const response = await fetch(`${SUPABASE_URL}/rest/v1/inquiries`, {
      method: "POST",

      headers: {
        apikey: SUPABASE_PUBLISHABLE_KEY,
        Authorization: `Bearer ${SUPABASE_PUBLISHABLE_KEY}`,
        "Content-Type": "application/json",
        Prefer: "return=minimal",
      },

      body: JSON.stringify(inquiry),
    });

    if (!response.ok) {
      let errorMessage = `Supabase error (${response.status})`;

      try {
        const errorData = await response.json();

        errorMessage =
          errorData.message ||
          errorData.details ||
          errorData.hint ||
          errorMessage;
      } catch (error) {
        console.error("Supabase response error:", error);
      }

      throw new Error(errorMessage);
    }
  }

  // ==========================================
  // FORM SUBMIT
  // ==========================================

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const submitButton = form.querySelector(".contact-submit");

    const data = new FormData(form);

    const name = data.get("name")?.toString().trim() || "";

    const phone = data.get("phone")?.toString().trim() || "";

    const email = data.get("email")?.toString().trim() || "";

    const occasion = data.get("occasion")?.toString().trim() || "";

    const budget = data.get("budget")?.toString().trim() || "";

    const preferredDate = data.get("date")?.toString().trim() || null;

    const giftDetails = data.get("message")?.toString().trim() || "";

    // ==========================================
    // VALIDATION
    // ==========================================

    if (!name || !phone || !occasion || !budget || !giftDetails) {
      setMessage("Please fill in all required details.", "error");

      return;
    }

    // Basic phone validation
    const phoneDigits = phone.replace(/\D/g, "");

    if (phoneDigits.length < 10) {
      setMessage("Please enter a valid phone number.", "error");

      return;
    }

    // Email validation only if provided
    if (email) {
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      if (!emailPattern.test(email)) {
        setMessage("Please enter a valid email address.", "error");

        return;
      }
    }

    // ==========================================
    // BUTTON STATE
    // ==========================================

    if (submitButton) {
      submitButton.disabled = true;

      submitButton.innerHTML =
        '<i class="fa-solid fa-spinner fa-spin"></i> Sending...';
    }

    // ==========================================
    // SUPABASE DATA
    // ==========================================

    const inquiryData = {
      name: name,
      phone: phone,
      email: email || null,
      occasion: occasion,
      budget: budget,
      preferred_date: preferredDate,
      gift_details: giftDetails,
      status: "New",
    };

    // ==========================================
    // EMAILJS DATA
    // ==========================================

    const emailParams = {
      name: name,
      phone: phone,
      email: email || "Not provided",
      occasion: occasion,
      budget: budget,
      preferred_date: preferredDate || "Not specified",
      gift_details: giftDetails,
    };

    // ==========================================
    // SEND
    // ==========================================

    try {
      // 1. Save inquiry
      await saveInquiryToSupabase(inquiryData);

      // 2. Send email notification
      if (window.emailjs) {
        try {
          await emailjs.send(EMAIL_SERVICE_ID, EMAIL_TEMPLATE_ID, emailParams);
        } catch (emailError) {
          console.error("EmailJS Error:", emailError);
        }
      }

      // ==========================================
      // SUCCESS
      // ==========================================

      form.reset();

      setMessage(
        "Inquiry sent successfully! We'll get back to you soon.",
        "success",
      );
    } catch (error) {
      console.error("Inquiry Save Error:", error);

      setMessage("Inquiry could not be saved. Please try again.", "error");
    } finally {
      if (submitButton) {
        submitButton.disabled = false;

        submitButton.innerHTML =
          'Send Inquiry <i class="fa-solid fa-paper-plane"></i>';
      }
    }
  });
});
