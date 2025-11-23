let form = document.getElementById("form");

form.addEventListener("submit", (e) => {
  e.preventDefault();

  const fullName = document.getElementById("full_name");
  const email = document.getElementById("email");
  const emailSubject = document.getElementById("email_subject");
  const mobileNumber = document.getElementById("mobile_number");
  const message = document.getElementById("message");
  
  // IMPORTANT: Replace 'YOUR_API_KEY_HERE' with your Brevo API key
  // You can find your API key at: https://app.brevo.com/settings/keys/api
  const BREVO_API_KEY = "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";
  const BREVO_URL = "https://api.brevo.com/v3/smtp/email";
  
  // Recipient email - adjust to the email where you want to receive the forms
  const RECIPIENT_EMAIL = "ronaldo@radriano.dev"; // Adjust this email

  // Build the email content in HTML
  const emailContent = `
    <h2>New contact form message</h2>
    <p><strong>Name:</strong> ${fullName.value}</p>
    <p><strong>Email:</strong> ${email.value}</p>
    <p><strong>Phone:</strong> ${mobileNumber.value || "Not provided"}</p>
    <p><strong>Subject:</strong> ${emailSubject.value}</p>
    <p><strong>Message:</strong></p>
    <p>${message.value.replace(/\n/g, "<br>")}</p>
  `;

  const data = {
    sender: {
      name: "RAdriano Dev",
      email: "noreply@radriano.dev"
    },
    to: [
      {
        email: RECIPIENT_EMAIL,
        name: "Ronaldo Adriano"
      }
    ],
    subject: `Contact Form: ${emailSubject.value}`,
    htmlContent: emailContent,
    replyTo: {
      email: email.value,
      name: fullName.value
    }
  };

  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "api-key": BREVO_API_KEY
    },
    body: JSON.stringify(data),
  };

  // Validate API key before making request
  if (BREVO_API_KEY === "YOUR_API_KEY_HERE" || !BREVO_API_KEY || BREVO_API_KEY.length < 20) {
    alert("Please configure your Brevo API key in scriptForm.js");
    console.error("Brevo API key not configured properly");
    return;
  }

  // Validate recipient email
  if (RECIPIENT_EMAIL === "YOUR_EMAIL@example.com" || !RECIPIENT_EMAIL.includes("@")) {
    alert("Please configure the recipient email in scriptForm.js");
    console.error("Recipient email not configured properly");
    return;
  }

  fetch(BREVO_URL, options)
    .then((response) => {
      if (response.ok) {
        // Success - clear form
        fullName.value = "";
        email.value = "";
        emailSubject.value = "";
        mobileNumber.value = "";
        message.value = "";
        alert("Message sent successfully!");
        return response.json();
      } else {
        // Try to get error message
        return response.json().then(errorData => {
          let errorMessage = errorData.message || `Error ${response.status}: ${response.statusText}`;
          
          // Provide more helpful error messages
          if (response.status === 401) {
            errorMessage = "Invalid API key. Please check your Brevo API key in scriptForm.js";
          } else if (response.status === 400) {
            errorMessage = errorData.message || "Invalid request. Please check the form data.";
          }
          
          throw new Error(errorMessage);
        }).catch(() => {
          // If JSON parsing fails, throw with status
          throw new Error(`Error ${response.status}: ${response.statusText}`);
        });
      }
    })
    .catch((error) => {
      console.error("Error sending message:", error);
      alert(`Error sending message: ${error.message || "Please try again later."}`);
    });
});
