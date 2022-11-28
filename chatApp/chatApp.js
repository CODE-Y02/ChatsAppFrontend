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

    //fetch all
    fetchAllMsg(token);
  } catch (error) {
    console.log("err in send msg===>", error);
    alert(error.response.data.message);
  }
}

async function fetchAllMsg(token) {
  try {
    let response = await axios.get("http://localhost:3000/message/getall", {
      headers: {
        authorization: token,
      },
    });

    console.log(response.data);

    let chatsBoxMain = document.getElementById("chatsBoxMain");

    console.log(chatsBoxMain);
    chatsBoxMain.innerHTML = "";
    response.data.map((eachMsg) => {
      displayMsgOnDom(eachMsg);
    });
    //chatsBoxMain
  } catch (error) {
    console.log(error);
  }
}

function displayMsgOnDom(messageObj) {
  const { name, content } = messageObj;

  let newMsgEle = `
        <div class="message ${
          name == "you" ? "send-message" : "received-message"
        }">
            <h3>${name}</h3>
            <p > ${content}
            </p>
        </div>
    `;

  chatsBoxMain.innerHTML += newMsgEle;
}

window.addEventListener("DOMContentLoaded", () => {
  const token = JSON.parse(localStorage.getItem("ChatsAppToken"));

  // revert unauthorized user
  if (!token) window.location = "/login/login.html";

  setInterval(() => fetchAllMsg(token), 1000);
});
