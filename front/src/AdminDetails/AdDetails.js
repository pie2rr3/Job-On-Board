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
    fetch(`http://localhost:3000/ads/${id}`)
      .then((response) => response.json())
      .then((data) => {
        if (data.error) {
          console.error(data.error);
          displayEmptyView();
        } else {
          const adView = document.getElementById("AdView");
          adView.style.display = "block";
          document.getElementById("id").value = data.id;
          document.getElementById("title").value = data.title;
          document.getElementById("shortDescription").value =
            data.shortDescription;
          document.getElementById("fullDescription").value =
            data.fullDescription;
          document.getElementById("wage").value = data.wage;
          document.getElementById("department").value = data.departement;
          document.getElementById("place").value = data.place;
          document.getElementById("work-time").value = data.workTime;
          document.getElementById("companyId").value = data.companyId;
          document.getElementById("authorId").value = data.authorId;
          document.getElementById("createdAt").value = data.createdAt;
          document.getElementById("updatedAt").value = data.updatedAt;
        }
      });
  }
};

const save = () => {
  const id = getQueryVariable("id");
  fetch(`http://localhost:3000/ads/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      id: (document.getElementById("id").value = data.id),
      title: document.getElementById("title").value,
      shortDescription: document.getElementById("shortDescription").value,
      fullDescription: document.getElementById("fullDescription").value,
      wage: document.getElementById("wage").value,
      departement: document.getElementById("department").value,
      place: document.getElementById("place").value,
      workTime: document.getElementById("work-time").value,
      companyId: (document.getElementById("companyId").value = data.companyId),
      authorId: (document.getElementById("authorId").value = data.authorId),
      createdAt: (document.getElementById("createdAt").value = data.createdAt),
      updatedAt: (document.getElementById("updatedAt").value = data.updatedAt),
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
