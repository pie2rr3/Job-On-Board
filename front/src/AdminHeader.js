function checkAdminUser() {
  const userData = JSON.parse(localStorage.getItem("user"));
  const AdminDiv = document.querySelector("#admin");
  const AdminBody = document.querySelector("#Admin");
  if (userData) {
    if (AdminDiv && userData.role === "ADMIN") {
      AdminDiv.style.display = "inline";
    }
  } else {
    AdminDiv.style.display = "none";
    if (AdminBody) AdminBody.style.display = "none";
  }
}

function checkUser() {
  const userData = JSON.parse(localStorage.getItem("user"));
  const UserlogedDiv = document.querySelector("#userloged");
  const userlogedBody = document.querySelector("#Userloged");
  if (userData) {
    UserlogedDiv.style.display = "inline";
  } else {
    UserlogedDiv.style.display = "none";
    if (userlogedBody) userlogedBody.style.display = "none";
  }
}

window.onload = checkAdminUser() + checkUser();
