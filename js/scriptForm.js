let form = document.getElementById("form");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const fullName = document.getElementById("full_name");
  const email = document.getElementById("email");
  const emailSubject = document.getElementById("email_subject");
  const mobileNumber = document.getElementById("mobile_number");
  const message = document.getElementById("message");

  // 👉 NEW ENDPOINT: my API on Raspberry via Cloudflare Tunnel
  const url = "https://api.radriano.dev/contact";

  const data = {
    full_name: fullName.value,
    email: email.value,
    mobile_number: mobileNumber.value,
    email_subject: emailSubject.value,
    message: message.value,
  };

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    const result = await response.json();

    if (!response.ok || !result.ok) {
      console.error("Error sending message:", result);
      alert("Error sending message. Please try again later.");
      return;
    }

    // clear the form
    fullName.value = "";
    email.value = "";
    emailSubject.value = "";
    mobileNumber.value = "";
    message.value = "";

    alert("Message sent successfully!");
  } catch (error) {
    console.error("Network error:", error);
    alert("Error sending message. Please try again later.");
  }
});

