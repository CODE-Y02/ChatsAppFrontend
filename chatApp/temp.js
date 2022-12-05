document.getElementById("sendMsg").addEventListener("click", (e) => {
  e.preventDefault();

  const file = document.getElementById("userFile");

  console.log("file === >", file.files[0]);
});
