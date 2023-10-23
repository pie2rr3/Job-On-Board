const onLoadAd = () => {
  if (JSON.parse(localStorage.getItem("user")).role != "ADMIN") {
    const emptyView = document.getElementById("EmptyView");
    emptyView.style.display = "block";
  } else {
    const adView = document.getElementById("AdView");
    adView.style.display = "block";
  }
};

const save = () => {
  fetch(`http://localhost:3000/companiesEdit`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      id: document.getElementById("id").value,
      name: document.getElementById("name").value,
      departement: document.getElementById("department").value,
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
