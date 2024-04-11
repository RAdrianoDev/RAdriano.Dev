let form = document.getElementById("form");

form.addEventListener("submit", (e) => {
  e.preventDefault();

  const fullName = document.getElementById("full_name");
  const email = document.getElementById("email");
  const emailSubject = document.getElementById("email_subject");
  const mobileNumber = document.getElementById("mobile_number");
  const message = document.getElementById("message");
  const url = "https://formsquash.io/f/OyCvEueeuTy82DNlXHMO";
  //   const url = "https://formsquash.io/f/RcAn5BKryMwC06lSg2Tv";

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
      "Access-Control-Allow-Origin": "https://radriano.dev",
    },
    body: JSON.stringify(data),
  };

  fetch(url, options)
    .then((response) => response.json())
    .then((data) => {
      fullName.value = "";
      email.value = "";
      emailSubject.value = "";
      mobileNumber.value = "";
      message.value = "";
      alert("Email successfully sent");
    })
    .catch((error) => {
      fullName.value = "";
      email.value = "";
      emailSubject.value = "";
      mobileNumber.value = "";
      message.value = "";
      alert("Email successfully sent");
    });
});
