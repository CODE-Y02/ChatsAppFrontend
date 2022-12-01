// on dom loaded
window.addEventListener("DOMContentLoaded", () => {
  const token = JSON.parse(localStorage.getItem("ChatsAppToken"));

  fetchGroups(token);
});

//create group
document.getElementById("createGroup").addEventListener("submit", (e) => {
  e.preventDefault();
  const token = JSON.parse(localStorage.getItem("ChatsAppToken"));
  const name = document.getElementById("name");

  if (!name.value) {
    alert("group name cannot be empty");
    return;
  }

  createGroup(name.value, token);

  name.value = "";
});

// add user to group
document.getElementById("addUser").addEventListener("click", (e) => {
  e.preventDefault();

  const memberInfoEle = document.getElementById("userId");
  const groupId = document.getElementById("groups");

  console.log("\n\n\n", userId, groupId, "\n\n\n");
  const token = JSON.parse(localStorage.getItem("ChatsAppToken"));

  addnewUserToGroup(memberInfoEle.value, groupId.value, token);

  memberInfoEle.value = "";
  groupId.value = "";
});

async function createGroup(name, token) {
  try {
    let response = await axios.post(
      "http://localhost:3000/group/create",

      { name },
      {
        headers: {
          authorization: token,
        },
      }
    );

    console.log(response);

    alert("group created");
  } catch (error) {
    console.log(error);
  }
}

async function fetchGroups(token) {
  try {
    let response = await axios.get(
      `http://localhost:3000/group/admingroups`,

      {
        headers: {
          authorization: token,
        },
      }
    );

    console.log(response);

    let groupList = document.getElementById("groups");
    groupList.innerHTML = "";

    response.data.map((groupObj) => {
      const groupId = groupObj.id;
      const groupName = groupObj.name;

      listEachGroup(groupName, groupId);
    });
  } catch (error) {
    console.log(error);
  }
}

function listEachGroup(name, id) {
  let groupList = document.getElementById("groups");

  let newList = `
  <option value="${id}">${name}</option>
  `;

  groupList.innerHTML += newList;
}

async function addnewUserToGroup(memberInfo, groupId, token) {
  try {
    let response = await axios.post(
      "http://localhost:3000/group/addmember",

      { memberInfo, groupId },
      {
        headers: {
          authorization: token,
        },
      }
    );

    console.log(response);

    alert("Member Added to group");
  } catch (error) {
    console.log(error);
  }
}

//make admin
document.getElementById("makeAdmin").addEventListener("click", (e) => {
  e.preventDefault();

  const memberInfoEle = document.getElementById("userId");
  const groupId = document.getElementById("groups");

  const token = JSON.parse(localStorage.getItem("ChatsAppToken"));

  makeUserAdmin(memberInfoEle.value, groupId.value, token);

  memberInfoEle.value = "";
  groupId.value = "";
});

async function makeUserAdmin(memberInfo, groupId, token) {
  try {
    // assignAdmin

    let response = await axios.post(
      "http://localhost:3000/group/assignAdmin",

      { memberInfo, groupId },
      {
        headers: {
          authorization: token,
        },
      }
    );

    console.log(response);

    // alert("assigned user as admin");
  } catch (error) {
    console.log(error);
  }
}

// remove member
document.getElementById("removeUser").addEventListener("click", (e) => {
  e.preventDefault();

  const memberInfoEle = document.getElementById("userId");
  const groupId = document.getElementById("groups");

  const token = JSON.parse(localStorage.getItem("ChatsAppToken"));

  removeMember(memberInfoEle.value, groupId.value, token);

  memberInfoEle.value = "";
  groupId.value = "";
});

async function removeMember(memberInfo, groupId, token) {
  try {
    // assignAdmin

    let response = await axios.delete(
      "http://localhost:3000/group/removeMember",
      { data: { memberInfo, groupId }, headers: { Authorization: token } }
    );

    console.log(response);

    // alert("assigned user as admin");
  } catch (error) {
    console.log(error);
  }
}

//s.delete(url, { data: { foo: "bar" }, headers: { "Authorization": "***" } });
