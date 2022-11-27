document.getElementById("sendMsg").addEventListener("click", (e) => {
  e.preventDefault();

  let message = document.getElementById("userMsg").value;
  console.log("before msg send", message);

  const token = JSON.parse(localStorage.getItem("ChatsAppToken"));
  sendMsgToServer(message, token);
});

async function sendMsgToServer(message, token) {
  try {
    let res = await axios.post(
      "http://localhost:3000/message/send",
      {
        message: message,
      },
      {
        headers: {
          authorization: token,
        },
      }
    );

    console.log(res);
    // clear input
    document.getElementById("userMsg").value = "";

    //alert
    alert(res.data.message);
  } catch (error) {
    console.log("err in send msg===>", error);
    alert(error.response.data.message);
  }
}
