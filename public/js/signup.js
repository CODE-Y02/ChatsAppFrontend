document.getElementById("authForm").addEventListener("submit", (e) => {
  e.preventDefault();

  const user = {
    name: document.getElementById("name").value,
    email: document.getElementById("email").value,
    phone: document.getElementById("phone").value,
    password: document.getElementById("password").value,
  };

  signUpUser(user);
});

async function signUpUser(userObj) {
  try {
    let response = await axios.post("http://localhost:3000/signup", userObj);

    // console.log(response);

    alert("signup successfull 😎 ");

    window.location = "/login";
  } catch (error) {
    console.log("err ===> \n", error.response.data);

    showErrMsg(error.response.data.message, 3000);
  }
}

function showErrMsg(msg, timeout) {
  let errorMsgElement = document.getElementById("error-message");
  errorMsgElement.classList.remove("hidden");

  errorMsgElement.innerText = msg;

  setTimeout(() => {
    errorMsgElement.innerText = "";
    errorMsgElement.classList.add("hidden");
  }, timeout);
}
