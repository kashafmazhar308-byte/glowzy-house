document.addEventListener("DOMContentLoaded", () => {
  // EmailJS initialize
  emailjs.init({
    publicKey: "NWzVBEpHEcrgFWThl",
  });

  const form = document.getElementById("giftInquiryForm");
  const message = document.getElementById("formMessage");

  if (!form) return;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const data = new FormData(form);

    const templateParams = {
      name: data.get("name"),
      occasion: data.get("occasion"),
      budget: data.get("budget"),
      preferred_date: data.get("date") || "Not specified",
      gift_details: data.get("message"),
    };

    const button = form.querySelector(".contact-submit");

    if (button) {
      button.disabled = true;
      button.textContent = "Sending...";
    }

    try {
      const response = await emailjs.send(
        "service_7pt9p6a",
        "template_z5l8d8e",
        templateParams,
      );

      console.log("Email sent:", response.status, response.text);

      if (message) {
        message.textContent =
          "Inquiry sent successfully! We'll get back to you soon.";
      }

      form.reset();
    } catch (error) {
      console.error("EmailJS Error:", error);

      if (message) {
        message.textContent = "Inquiry could not be sent. Please try again.";
      }
    } finally {
      if (button) {
        button.disabled = false;
        button.innerHTML =
          'Send Inquiry <i class="fa-solid fa-paper-plane"></i>';
      }
    }
  });
});
