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

// add user to group
document.getElementById("adduserToGroup").addEventListener("submit", (e) => {
  e.preventDefault();

  const userId = document.getElementById("userId");
  const groupId = document.getElementById("groups");

  console.log("\n\n\n", userId, groupId, "\n\n\n");
  const token = JSON.parse(localStorage.getItem("ChatsAppToken"));

  addnewUserToGroup(userId.value, groupId.value, token);

  userId.value = "";
  groupId.value = "";
});

async function addnewUserToGroup(userId, groupId, token) {
  try {
    let response = await axios.post(
      "http://localhost:3000/group/addmember",

      { userId, groupId },
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
