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
  fetch(`http://localhost:3000/adsApply`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      id: document.getElementById("id").value,
      message: document.getElementById("message").value,
      status: document.getElementById("status").value,
      advertisementId: document.getElementById("advertisementId").value,
      applicantId: document.getElementById("applicantId").value,
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
