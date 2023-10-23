const listUsers = () => {
  fetch("http://localhost:3000/users")
    .then((response) => response.json())
    .catch((error) => console.error("Error:", error))
    .then((users) => {
      users.forEach((user) => {
        const table = document.getElementById("userList");
        const row = table.insertRow(-1);
        row.insertCell(0).innerHTML = user.id;
        row.insertCell(1).innerHTML = user.email;
        row.insertCell(2).innerHTML = user.name;
        row.insertCell(3).innerHTML = user.phone;
        row.insertCell(4).innerHTML = user.departement;
        row.insertCell(5).innerHTML = user.role;
        row.insertCell(6).innerHTML = user.company?.name ?? "";

        const editButton = document.createElement("button");
        editButton.innerHTML = "Edit";
        editButton.addEventListener("click", () => editUser(user.id));
        row.insertCell(7).appendChild(editButton);

        const deleteButton = document.createElement("button");
        deleteButton.innerHTML = "Delete";
        deleteButton.className = "delete-btn";
        deleteButton.addEventListener("click", () => deleteUser(user.id));
        row.insertCell(8).appendChild(deleteButton);
      });
    });
};

const listCompany = () => {
  fetch("http://localhost:3000/companies")
    .then((response) => response.json())
    .catch((error) => console.error("Error:", error))
    .then((companies) => {
      companies.forEach((company) => {
        const table = document.getElementById("companyList");
        const row = table.insertRow(-1);
        row.insertCell(0).innerHTML = company.id;
        row.insertCell(1).innerHTML = company.name;
        row.insertCell(2).innerHTML = company.departement;

        const editButton = document.createElement("button");
        editButton.innerHTML = "Edit";
        editButton.addEventListener("click", () => editCompany(company.id));
        row.insertCell(3).appendChild(editButton);

        const deleteButton = document.createElement("button");
        deleteButton.innerHTML = "Delete";
        deleteButton.className = "delete-btn";
        deleteButton.addEventListener("click", () => deleteCompany(company.id));
        row.insertCell(4).appendChild(deleteButton);
      });
    });
};

const listAds = () => {
  fetch("http://localhost:3000/ads")
    .then((response) => response.json())
    .catch((error) => console.error("Error:", error))
    .then((advertisements) => {
      advertisements.forEach((advertisement) => {
        const table = document.getElementById("adsList");
        const row = table.insertRow(-1);
        row.insertCell(0).innerHTML = advertisement.id;
        row.insertCell(1).innerHTML = advertisement.authorId;
        row.insertCell(2).innerHTML = advertisement.companyId;
        row.insertCell(3).innerHTML = advertisement.title;
        row.insertCell(4).innerHTML = advertisement.shortDescription;
        row.insertCell(5).innerHTML = advertisement.fullDescription;
        row.cells[5].classList.add("description-cell");
        row.insertCell(6).innerHTML = advertisement.wage;
        row.insertCell(7).innerHTML = advertisement.departement;
        row.insertCell(8).innerHTML = advertisement.workTime;
        row.insertCell(9).innerHTML = advertisement.place;

        const editButton = document.createElement("button");
        editButton.innerHTML = "Edit";
        editButton.addEventListener("click", () =>
          editAdvertisement(advertisement.id)
        );
        row.insertCell(10).appendChild(editButton);

        const deleteButton = document.createElement("button");
        deleteButton.innerHTML = "Delete";
        deleteButton.className = "delete-btn";
        deleteButton.addEventListener("click", () =>
          deleteAdvertisement(advertisement.id)
        );
        row.insertCell(11).appendChild(deleteButton);
      });
    });
};

const listAdsApply = () => {
  fetch("http://localhost:3000/adsApply")
    .then((response) => response.json())
    .catch((error) => console.error("Error:", error))
    .then((advertisements) => {
      advertisements.forEach((advertisementApplication) => {
        const table = document.getElementById("adsApplyList");
        const row = table.insertRow(-1);
        row.insertCell(0).innerHTML = advertisementApplication.id;
        row.insertCell(1).innerHTML = advertisementApplication.advertisementId;
        row.insertCell(2).innerHTML = advertisementApplication.applicantId;
        row.insertCell(3).innerHTML = advertisementApplication.message;
        row.insertCell(4).innerHTML = advertisementApplication.status;

        const editButton = document.createElement("button");
        editButton.innerHTML = "Edit";
        editButton.addEventListener("click", () =>
          editAdvertisementApply(advertisementApplication.id)
        );
        row.insertCell(5).appendChild(editButton);

        const deleteButton = document.createElement("button");
        deleteButton.innerHTML = "Delete";
        deleteButton.className = "delete-btn";
        deleteButton.addEventListener("click", () =>
          deleteAdvertisementApply(advertisementApplication.id)
        );
        row.insertCell(6).appendChild(deleteButton);
      });
    });
};

const userData = JSON.parse(localStorage.getItem("user"));

if (userData && userData.role === "ADMIN") {
  listUsers();
  listCompany();
  listAds();
  listAdsApply();
}

function deleteUser(userId) {
  var confirmation = window.confirm("Are you sure ?");
  if (confirmation) {
    fetch(`http://localhost:3000/deleteuser?id=${userId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.error) {
          console.error(data.error);
        } else {
          location.reload();
        }
      })
      .catch((error) => {
        console.error("Error during delete request :", error);
      });
  } else {
  }
}

function deleteCompany(companyId) {
  var confirmation = window.confirm("Are you sure ?");
  if (confirmation) {
    fetch(`http://localhost:3000/deletecompany?id=${companyId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.error) {
          console.error(data.error);
        } else {
          location.reload();
        }
      })
      .catch((error) => {
        console.error("Error during delete request :", error);
      });
  } else {
  }
}

function deleteAdvertisement(adId) {
  var confirmation = window.confirm("Are you sure ?");
  if (confirmation) {
    fetch(`http://localhost:3000/deleteadvertisement?id=${adId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.error) {
          console.error(data.error);
        } else {
          location.reload();
        }
      })
      .catch((error) => {
        console.error("Error during delete request :", error);
      });
  } else {
  }
}

function deleteAdvertisementApply(adApplyId) {
  var confirmation = window.confirm("Are you sure ?");
  if (confirmation) {
    fetch(`http://localhost:3000/deleteadvertisementApply?id=${adApplyId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.error) {
          console.error(data.error);
        } else {
          location.reload();
        }
      })
      .catch((error) => {
        console.error("Error during delete request :", error);
      });
  } else {
  }
}

function editUser(userId) {
  window.location.href = `./AdminDetails/UserDetails.html?id=${userId}`;
}

function editCompany(companyId) {
  window.location.href = `./AdminDetails/CompanyDetails.html?id=${companyId}`;
}

function editAdvertisement(adId) {
  window.location.href = `./AdminDetails/AdDetails.html?id=${adId}`;
}

function editAdvertisementApply(adApplyId) {
  window.location.href = `./AdminDetails/AdApplyDetails.html?id=${adApplyId}`;
}

function createUser() {
  window.location.href = `./AdminCreate/UserCreate.html`;
}

function createCompany() {
  window.location.href = `./AdminCreate/CompanyCreate.html`;
}

function createAdvertisement() {
  window.location.href = `./AdminCreate/AdCreate.html`;
}

function createAdvertisementApply() {
  window.location.href = `./AdminCreate/AdApplyCreate.html`;
}