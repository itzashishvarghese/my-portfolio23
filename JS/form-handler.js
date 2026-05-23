/* ==========================================================================
   Ashish Varghese — Portfolio | Contact Form Backend
   Uses Web3Forms API — FREE, no server needed.
   Emails go to: ashishvarghesefdk@gmail.com
   ========================================================================== */

(function () {
  "use strict";

  const ACCESS_KEY = "6a48f721-a5b6-4e3f-bff6-01d6ea603039";
  const API_URL = "https://api.web3forms.com/submit";

  const form = document.getElementById("contact-form");
  if (!form) return;

  form.addEventListener("submit", async function (e) {
    e.preventDefault();

    const nameField = document.getElementById("name-input");
    const emailField = document.getElementById("email-input");
    const phoneField = document.getElementById("phone-input");
    const subjectField = document.getElementById("subject-input");
    const messageField = document.getElementById("message-input");
    const btn = document.getElementById("submit-btn");
    const msg = document.getElementById("form-message");

    // --- Validation ---
    const requiredFields = [nameField, emailField, subjectField, messageField];
    let valid = true;

    requiredFields.forEach((f) => {
      f.style.border = "";
      if (!f.value.trim()) {
        valid = false;
        f.style.border = "2px solid #ff4444";
      }
    });

    if (emailField.value.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailField.value.trim())) {
      valid = false;
      emailField.style.border = "2px solid #ff4444";
      showToast("Please enter a valid email address ⚠️", true);
      return;
    }

    if (!valid) {
      showToast("Please fill in all required fields ⚠️", true);
      return;
    }

    // --- Show loading ---
    btn.value = "Sending...";
    btn.disabled = true;
    btn.style.opacity = "0.6";

    // --- Build form data ---
    const data = {
      access_key: ACCESS_KEY,
      name: nameField.value.trim(),
      email: emailField.value.trim(),
      phone: phoneField.value.trim() || "Not provided",
      subject: subjectField.value.trim(),
      message: messageField.value.trim(),
      from_name: "Ashish Portfolio Contact",
    };

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(data),
      });

      const result = await response.json();
      console.log("Web3Forms response:", result);

      if (result.success) {
        showToast("✅ Message sent successfully! I'll get back to you soon.", false);
        if (msg) {
          msg.textContent = "✅ Message sent successfully!";
          msg.className = "form-message success";
        }
        form.reset();
      } else {
        showToast("❌ Failed: " + (result.message || "Unknown error"), true);
        if (msg) {
          msg.textContent = "❌ Failed to send. Try again.";
          msg.className = "form-message error";
        }
      }
    } catch (err) {
      console.error("Form error:", err);
      showToast("❌ Network error. Check your internet connection.", true);
      if (msg) {
        msg.textContent = "❌ Network error.";
        msg.className = "form-message error";
      }
    }

    // --- Reset button ---
    btn.value = "Send Message";
    btn.disabled = false;
    btn.style.opacity = "1";
  });

  // --- Clear red borders on typing ---
  form.querySelectorAll("input:not([type='submit']):not([type='hidden']), textarea").forEach((f) => {
    f.addEventListener("input", () => {
      if (f.value.trim()) f.style.border = "";
    });
  });

  // --- Toast notification ---
  function showToast(message, isError) {
    const old = document.querySelector(".form-toast");
    if (old) old.remove();

    const toast = document.createElement("div");
    toast.className = "form-toast";
    toast.textContent = message;
    Object.assign(toast.style, {
      position: "fixed",
      bottom: "30px",
      left: "50%",
      transform: "translateX(-50%)",
      padding: "14px 28px",
      borderRadius: "12px",
      fontSize: "1.5rem",
      fontWeight: "600",
      color: "#fff",
      background: isError ? "linear-gradient(135deg,#ff4444,#cc0000)" : "linear-gradient(135deg,#00d4ff,#0098b3)",
      boxShadow: "0 8px 32px rgba(0,0,0,0.4)",
      zIndex: "9999",
      opacity: "0",
      transition: "opacity .4s, transform .4s",
      pointerEvents: "none",
      fontFamily: "'Poppins',sans-serif",
      maxWidth: "90vw",
      textAlign: "center",
    });
    document.body.appendChild(toast);

    requestAnimationFrame(() => {
      toast.style.opacity = "1";
      toast.style.transform = "translateX(-50%) translateY(-10px)";
    });

    setTimeout(() => {
      toast.style.opacity = "0";
      setTimeout(() => toast.remove(), 400);
    }, 4000);
  }
})();
