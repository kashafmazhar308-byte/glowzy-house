document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("giftInquiryForm");
  const message = document.getElementById("formMessage");

  const SUPABASE_URL = "https://qugmjqltsqsurqvpjkxg.supabase.co";

  const SUPABASE_PUBLISHABLE_KEY =
    "sb_publishable_OaMCCPC97d20gh9qfRBS3Q_xwm3DJBJ";

  const EMAIL_SERVICE_ID = "service_7pt9p6a";
  const EMAIL_TEMPLATE_ID = "template_z5l8d8e";
  const EMAIL_PUBLIC_KEY = "NWzVBEpHEcrgFWThl";

  if (!form) return;

  // Initialize EmailJS
  if (window.emailjs) {
    emailjs.init({
      publicKey: EMAIL_PUBLIC_KEY,
    });
  }

  function setMessage(text, type = "normal") {
    if (!message) return;

    message.textContent = text;

    if (type === "success") {
      message.style.color = "#3e7d58";
    } else if (type === "error") {
      message.style.color = "#b54e4e";
    } else {
      message.style.color = "";
    }
  }

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

    if (!name || !phone || !occasion || !budget || !giftDetails) {
      setMessage("Please fill in all required details.", "error");
      return;
    }

    if (submitButton) {
      submitButton.disabled = true;
      submitButton.textContent = "Sending...";
    }

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

    const emailParams = {
      name: name,
      phone: phone,
      email: email || "Not provided",
      occasion: occasion,
      budget: budget,
      preferred_date: preferredDate || "Not specified",
      gift_details: giftDetails,
    };

    try {
      // 1. Save inquiry to Supabase
      await saveInquiryToSupabase(inquiryData);

      // 2. Send email notification
      if (window.emailjs) {
        try {
          await emailjs.send(EMAIL_SERVICE_ID, EMAIL_TEMPLATE_ID, emailParams);
        } catch (emailError) {
          console.error("EmailJS Error:", emailError);
        }
      }

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
