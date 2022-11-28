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
    fetchAllOrLatestMsg(token);
  } catch (error) {
    console.log("err in send msg===>", error);
    alert(error.response.data.message);
  }
}

async function fetchAllOrLatestMsg(token) {
  try {
    //check on local storage for old msg
    let oldMsgArr = JSON.parse(localStorage.getItem("ChatsApp-Messages")) || [];

    let lastMsg = oldMsgArr[oldMsgArr.length - 1];
    let lastMsgId = -1;
    if (lastMsg) {
      lastMsgId = lastMsg.id;
    }

    let response = await axios.get(
      `http://localhost:3000/message/getall?lastmessageId=${lastMsgId}`,
      {
        headers: {
          authorization: token,
        },
      }
    );

    console.log(response.data);

    let newMessageArr = [...oldMsgArr, ...response.data];

    if (oldMsgArr.length > 10000) {
      // if local storage is getting full delete old msg just store new one
      newMessageArr = response.data;
    }

    localStorage.setItem("ChatsApp-Messages", JSON.stringify(newMessageArr));

    let chatsBoxMain = document.getElementById("chatsBoxMain");

    // console.log(chatsBoxMain);
    chatsBoxMain.innerHTML = "";
    newMessageArr.map((eachMsg) => {
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
  // fetchAllOrLatestMsg(token);
  setInterval(() => fetchAllOrLatestMsg(token), 10000);
});
