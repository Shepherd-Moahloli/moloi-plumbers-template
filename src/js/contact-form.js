document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("contact-form");
  const success = document.getElementById("form-success");
  const submitError = document.getElementById("form-submit-error");
  if (!form || !success) return;

  const fields = Array.from(form.elements).filter((field) => field.name);

  const rules = {
    name(value) {
      if (!value) return "Please enter your name.";
      if (value.length < 2) return "Please enter at least 2 characters.";

      if (!/^[\p{L}][\p{L}\p{M} .'-]*$/u.test(value)) {
        return "Please enter a valid name.";
      }

      return "";
    },

    email(value) {
      if (!value) return "Please enter your email address.";

      if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value)) {
        return "Please enter a valid email address.";
      }

      return "";
    },

    phone(value) {
      if (!value) {
        return "Please enter your 9-digit phone number.";
      }

      if (!/^\d{9}$/.test(value)) {
        return "Enter exactly 9 numbers after +27.";
      }

      return "";
    },

    area(value) {
      return value ? "" : "Please choose your area.";
    },

    service(value) {
      return value ? "" : "Please select the service you need.";
    },

    message(value) {
      if (!value) return "Please tell us how we can help.";
      if (value.length < 10) return "Please enter at least 10 characters.";

      return "";
    },
  };

  function validate(field) {
    const value = field.value.trim();
    const message = rules[field.name] ? rules[field.name](value) : "";
    const error = document.getElementById(`${field.id}-error`);

    field.classList.toggle("is-invalid", Boolean(message));
    field.setAttribute("aria-invalid", String(Boolean(message)));

    if (error) {
      error.textContent = message;
    }

    return !message;
  }

  function clearFormState() {
    form.reset();
    form.hidden = false;
    success.hidden = true;

    fields.forEach((field) => {
      field.classList.remove("is-invalid");
      field.removeAttribute("aria-invalid");

      const error = document.getElementById(`${field.id}-error`);

      if (error) {
        error.textContent = "";
      }
    });
  }

  fields.forEach((field) => {
    field.addEventListener("blur", () => validate(field));

    const eventName = field.tagName === "SELECT" ? "change" : "input";

    field.addEventListener(eventName, () => {
      if (field.name === "phone") {
        field.value = field.value.replace(/\D/g, "").slice(0, 9);
      }

      if (field.classList.contains("is-invalid")) {
        validate(field);
      }
    });
  });

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const results = fields.map((field) => validate(field));

    if (results.includes(false)) {
      const firstInvalid = fields.find((field) =>
        field.classList.contains("is-invalid"),
      );

      if (firstInvalid) {
        firstInvalid.focus();
      }

      return;
    }

    const submitButton = form.querySelector('button[type="submit"]');
    const originalButtonText = submitButton.textContent;

    submitError.hidden = true;
    submitButton.disabled = true;
    submitButton.textContent = "Sending...";

    const formData = new FormData(form);

    /* Combine the permanent +27 with the customer's nine digits */
    formData.set("phone", `+27${formData.get("phone")}`);

    try {
      const response = await fetch("/contact.html", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams(formData).toString(),
      });

      if (!response.ok) {
        throw new Error("Unable to submit form");
      }

      form.reset();
      form.hidden = true;
      success.hidden = false;
      success.focus();
    } catch (error) {
      submitError.hidden = false;
    } finally {
      submitButton.disabled = false;
      submitButton.textContent = originalButtonText;
    }
  });

  clearFormState();

  window.addEventListener("pageshow", (event) => {
    if (event.persisted) {
      clearFormState();
    }
  });
});
