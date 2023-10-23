function getQueryVariable(variableName) {
  var query = window.location.search.substring(1);
  var vars = query.split("&");
  for (var i = 0; i < vars.length; i++) {
    var pair = vars[i].split("=");
    if (pair[0] == variableName) {
      return pair[1];
    }
  }
}

const onLoadAd = () => {
  const id = getQueryVariable("id");
  const displayEmptyView = () => {
    const emptyView = document.getElementById("EmptyView");
    emptyView.style.display = "block";
  };
  if (!id) {
    displayEmptyView();
  } else {
    fetch(`http://localhost:3000/user/${id}`)
      .then((response) => response.json())
      .then((data) => {
        if (data.error) {
          console.error(data.error);
          displayEmptyView();
        } else {
          const adView = document.getElementById("AdView");
          adView.style.display = "block";
          document.getElementById("id").value = data.id;
          document.getElementById("name").value = data.name;
          document.getElementById("email").value = data.email;
          document.getElementById("phone").value = data.phone;
          document.getElementById("department").value = data.departement;
          document.getElementById("role").value = data.role;
          document.getElementById("companyId").value = data.companyId;
          document.getElementById("password").value = data.password;
        }
      });
  }
};

const save = () => {
  const id = getQueryVariable("id");
  fetch(`http://localhost:3000/user/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      id: document.getElementById("id").value,
      name: document.getElementById("name").value,
      email: document.getElementById("email").value,
      phone: document.getElementById("phone").value,
      departement: document.getElementById("department").value,
      role: document.getElementById("role").value,
      companyId: document.getElementById("companyId").value,
      password: document.getElementById("password").value,
    }),
  }).then((response) => {
    if (response.ok) {
      window.location.href = "../Administration.html";
    } else {
      console.error("Failed to update advertisement");
    }
  });
};

function cancel() {
  window.location.href = `../Administration.html`;
}

window.onload = onLoadAd;
