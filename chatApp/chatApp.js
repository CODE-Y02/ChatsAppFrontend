window.addEventListener("DOMContentLoaded", () => {
  const token = JSON.parse(localStorage.getItem("ChatsAppToken"));

  // revert unauthorized user
  if (!token) window.location = "/login/login.html";
  fetchAllOrLatestMsg(token);

  fetchGroups(token);
  setInterval(() => {
    let localdataObj = JSON.parse(localStorage.getItem("ChatsApp-active-chat"));

    let groupId = localdataObj.id;

    if (groupId) fetchGroupMsg(groupId);
    else fetchAllOrLatestMsg(token);
  }, 10000);
});

/*
const msgForm = document.getElementById("msg-form");
// console.log(msgForm);
msgForm.addEventListener("submit", (e) => {
  e.preventDefault();

  // console.log();
  const token = JSON.parse(localStorage.getItem("ChatsAppToken"));

  const formData = new FormData(msgForm);

  console.log(formData.get("file"));

  sendMsgToServer(formData, token);
});
*/

document.getElementById("sendMsg").addEventListener("click", (e) => {
  e.preventDefault();

  const token = JSON.parse(localStorage.getItem("ChatsAppToken"));

  let message = document.getElementById("userMsg").value;
  // console.log("before msg send", message);

  const selectedFile = document.getElementById("userFile").files[0] || null;
  // console.log(selectedFile);
  // sendMsgToServer(message, selectedFile, token);

  let formData = new FormData();

  formData.append("message", message);

  formData.append("file", selectedFile);

  sendMsgToServer(formData, token);
});

async function sendMsgToServer(formData, token) {
  try {
    // console.log(token);
    let localdataObj = JSON.parse(localStorage.getItem("ChatsApp-active-chat"));

    let groupId = localdataObj.id || null;

    if (groupId) formData.append("groupId", groupId);

    let res = await axios.post("http://localhost:3000/message/send", formData, {
      headers: {
        Authorization: token,
      },
    });

    console.log(res);
    // clear input
    document.getElementById("userMsg").value = "";

    //alert
    alert(res.data.message);

    //fetch all
    // fetchAllOrLatestMsg(token);

    if (groupId) {
      fetchGroupMsg(groupId);
    } else {
      fetchAllOrLatestMsg(token);
    }
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
  const { name, content, fileUrl } = messageObj;

  let newMsgEle = `
        <div class="message ${
          name == "you" ? "send-message" : "received-message"
        }">
            <h3>${name}</h3>
            
            <p > ${content}
            </p>


            <a target="blank" href="${fileUrl}">${fileUrl ? "download" : ""} 
            </a>
        </div>
    `;

  chatsBoxMain.innerHTML += newMsgEle;
}

// admin opt
document.getElementById("adminOptionsBtn").addEventListener("click", (e) => {
  e.preventDefault();
  //redirect to admin panel
  window.location = "/admin/admin.html";
});

// fetch groups
async function fetchGroups(token) {
  try {
    let response = await axios.get(
      `http://localhost:3000/group/all`,

      {
        headers: {
          authorization: token,
        },
      }
    );

    console.log(response);

    let groupList = document.getElementById("group-list");
    groupList.innerHTML = "";

    response.data.map((groupObj) => {
      const groupId = groupObj.id;
      const groupName = groupObj.name;

      displayGroup(groupName, groupId);
    });
  } catch (error) {
    console.log(error);
  }
}

function displayGroup(name, id) {
  let groupList = document.getElementById("group-list");

  let group = `
                <div class="group" onclick="fetchGroupMsg(${id})" >
                    <h3>${name}</h3>
                    <p class="groupId">ID = ${id}</p>
                </div>
  `;

  groupList.innerHTML += group;
}

async function fetchGroupMsg(id) {
  try {
    //set active group
    localStorage.setItem(
      "ChatsApp-active-chat",
      JSON.stringify({ group: "group", id: id })
    );

    const token = JSON.parse(localStorage.getItem("ChatsAppToken"));

    let oldMsgArr =
      JSON.parse(localStorage.getItem(`ChatsApp-GroupMessages-${id}`)) || [];

    let lastMsg = oldMsgArr[oldMsgArr.length - 1];
    let lastMsgId = -1;
    if (lastMsg) {
      lastMsgId = lastMsg.id;
    }

    let response = await axios.get(
      `http://localhost:3000/message/group/${id}/?lastmessageId=${lastMsgId}`,
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

    localStorage.setItem(
      `ChatsApp-GroupMessages-${id}`,
      JSON.stringify(newMessageArr)
    );

    let chatsBoxMain = document.getElementById("chatsBoxMain");

    // console.log(chatsBoxMain);
    chatsBoxMain.innerHTML = "";
    newMessageArr.map((eachMsg) => {
      displayMsgOnDom(eachMsg);
    });
  } catch (error) {
    console.log(error.response.data.message);

    if ("invalid token" === error.response.data.message) {
      window.location = "/login/login.html";
    }
  }
}
