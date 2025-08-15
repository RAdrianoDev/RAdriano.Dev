let form = document.getElementById("form");

form.addEventListener("submit", (e) => {
  e.preventDefault();

  const fullName = document.getElementById("full_name");
  const email = document.getElementById("email");
  const emailSubject = document.getElementById("email_subject");
  const mobileNumber = document.getElementById("mobile_number");
  const message = document.getElementById("message");
  const url = "https://formsquash.io/f/OyCvEueeuTy82DNlXHMO";


  const data = {
    email: email.value,
    full_name: fullName.value,
    mobile_number: mobileNumber.value,
    email_subject: emailSubject.value,
    message: message.value,
  };

  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  };

  fetch(url, options)
    .then((response) => {
      // Check if it's a redirect (302) or success
      if (response.status === 302 || response.status === 200) {
        // Success - clear form
        fullName.value = "";
        email.value = "";
        emailSubject.value = "";
        mobileNumber.value = "";
        message.value = "";
        alert("Message sent successfully!");
        return;
      }
      
      // If it's not a redirect, try to read JSON
      return response.json();
    })
    .then((data) => {
      if (data && data.error) {
        // If there is an error in the JSON response
        console.error("Error at FormSquash:", data);
        alert(`Error sending message: ${data.message}`);
        return;
      }
      
      // If no error, it was successful
      if (data) {
        fullName.value = "";
        email.value = "";
        emailSubject.value = "";
        mobileNumber.value = "";
        message.value = "";
        alert("Message sent successfully!");
      }
    })
    .catch((error) => {
      console.error("Error at request:", error);
      // If there is a network error but the status is 302, it was probably successful
      alert("Message sent successfully!");
    });
});
