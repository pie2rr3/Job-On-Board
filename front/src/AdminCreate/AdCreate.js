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
  fetch(`http://localhost:3000/ads`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      id: document.getElementById("id").value,
      title: document.getElementById("title").value,
      shortDescription: document.getElementById("shortDescription").value,
      fullDescription: document.getElementById("fullDescription").value,
      wage: document.getElementById("wage").value,
      departement: document.getElementById("department").value,
      place: document.getElementById("place").value,
      workTime: document.getElementById("work-time").value,
      companyId: document.getElementById("companyId").value,
      authorId: document.getElementById("authorId").value,
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
