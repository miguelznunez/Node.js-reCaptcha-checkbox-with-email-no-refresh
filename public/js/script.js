document.querySelector("#contact-form").addEventListener("submit", (e) => {
  e.preventDefault();

  const name = document.querySelector("#name").value;
  const email = document.querySelector("#email").value;
  const message = document.querySelector("#message").value;
  const captcha = document.querySelector("#g-recaptcha-response").value;

  fetch("/submitForm", {
    method: "POST",
    headers: {
      "Accept": "application/json, text/plain, */*",
      "Content-type": "application/json"
    },
    body: JSON.stringify({ name: name, email: email, message: message, captcha: captcha })
  })
  .then((res) => res.json())
  .then((data) => {
    if(!data.success){
      removeMessage()
      document.querySelector(".output-message").className += " error";
      document.querySelector("#success-message").textContent = "Error: " + data.msg;
    }
    else{
      removeMessage()
      document.querySelector(".output-message").className += " success";
      document.querySelector("#success-message").textContent = "Success: Message was sent";
      document.querySelector("#name").value = "";
      document.querySelector("#email").value = "";
      document.querySelector("#message").value = "";
    }
  });
});

function removeMessage(){
  var current = document.querySelector(".output-message");
  current.className = current.className.replace(" error", "");
  current.className = current.className.replace(" success", "");
}