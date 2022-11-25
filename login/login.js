document.getElementById("authForm").addEventListener("submit", (e) => {
  e.preventDefault();

  const user = {
    email: document.getElementById("email").value,
    password: document.getElementById("password").value,
  };

  loginUser(user);
});

async function loginUser(userObj) {
  try {
    // console.log(userObj);
    // post req to login
    let response = await axios.post("http://localhost:3000/login", userObj);
    console.log(response.response.data);

    //  we receive token
    let token;

    // save it on local storage
    localStorage.setItem("ChatsApp", JSON.stringify(token));

    // success msg
    alert("login Successful 😎 ");

    // redirect to app
    window.location = "/chatApp/chatApp.html";
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
