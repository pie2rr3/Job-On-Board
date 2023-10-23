function onClickToggle(div_Id_To_Show, div_Id_To_Hide) {
  const div_To_Show = document.getElementById(div_Id_To_Show);
  const div_To_Hide = document.getElementById(div_Id_To_Hide);

  div_To_Hide.style.display = "none";
  div_To_Show.style.display = "block";
}

function onClickUpdate(div_Id_To_Show, div_Id_To_Hide) {
  onClickToggle(div_Id_To_Show, div_Id_To_Hide);
  const companydata = JSON.parse(localStorage.getItem("company"));
  document.getElementById("updatename").value = companydata.name;
  document.getElementById("updateDepartement").value = companydata.departement;
}

function onClickDisconnectCompany() {
  localStorage.removeItem("company");
  location.reload();
}

function submitCompany() {
  var name = document.getElementById("name").value;
  var departement = document.getElementById("departement").value;
  var password = document.getElementById("password").value;

  fetch("http://localhost:3000/companies", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name,
      departement,
      password,
      userId: JSON.parse(localStorage.getItem("user")).id,
    }),
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.error) {
        console.error(data.error);
      } else {
        localStorage.setItem("company", JSON.stringify(data));
        location.reload();
      }
    })
    .catch((error) => {
      console.error("Error :", error);
    });
}

function checkCompany() {
  var name = document.getElementById("loginname").value;
  var password = document.getElementById("loginpassword").value;
  const userId = JSON.parse(localStorage.getItem("user")).id;

  fetch(`http://localhost:3000/companies/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ name, password, userId }),
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.error) {
        console.error(data.error);
      } else {
        localStorage.setItem("user", JSON.stringify(data.user));
        localStorage.setItem("company", JSON.stringify(data.company));
        location.reload();
      }
    })
    .catch((error) => {
      console.error("Error :", error);
    });
}

function confirmDelete() {
  var confirmation = window.confirm("Are you sure ?");
  if (confirmation) {
    fetch(
      `http://localhost:3000/companies/${
        JSON.parse(localStorage.getItem("company")).id
      }`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      }
    )
      .then(() => {
        localStorage.removeItem("company");

        const loginDiv = document.querySelector("#LoginCompany");
        const companyDiv = document.querySelector("#company");

        loginDiv.style.display = "block";
        companyDiv.style.display = "none";
      })
      .catch((error) => {
        console.error("Error during delete request:", error);
      });
  } else {
  }
}

function updateCompany() {
  const companydata = JSON.parse(localStorage.getItem("company"));
  var name = document.getElementById("updatename").value;
  var departement = document.getElementById("updateDepartement").value;

  fetch(`http://localhost:3000/companies/${companydata.id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ name, departement }),
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.error) {
        console.error(data.error);
      } else {
        localStorage.setItem("company", JSON.stringify(data));
        onClickToggle("company", "companyupdate");
        checkAndShowCompany();
      }
    })
    .catch((error) => {
      console.error("Error :", error);
    });
}

function checkAndShowCompany() {
  const companyData = JSON.parse(localStorage.getItem("company"));
  const loginDiv = document.querySelector("#LoginCompany");
  const companyDiv = document.querySelector("#company");
  const createAdsDiv = document.querySelector("#buttonCreateAds");
  if (companyData) {
    const companyName = document.getElementById("companyName");
    const companyDepartement = document.getElementById("companyDepartement");

    companyName.textContent = "Id : " + companyData.id;
    companyName.textContent = "Nom : " + companyData.name;
    companyDepartement.textContent = "Département : " + companyData.departement;

    loginDiv.style.display = "none";
    companyDiv.style.display = "block";
    createAdsDiv.style.display = "block";
  } else {
  }
}

document.addEventListener("DOMContentLoaded", function () {
  const jobAdsContainer = document.body;
  const companydata = JSON.parse(localStorage.getItem("company"));
  if (companydata) {
    fetch(`http://localhost:3000/companiesAds/${companydata.id}`)
      .then((response) => {
        if (!response.ok) {
          console.error("Server response not OK. Status : ", response.status);
          throw new Error("Server response not OK.");
        }
        return response.json();
      })
      .then((data) => {
        if (Array.isArray(data)) {
          data.forEach((adData, index) => {
            if (adData.AdvertisementApplication.length === 0) {
              const updatedAt = new Date(adData.updatedAt);
              const formattedDate = updatedAt.toLocaleString("en-US", {
                year: "numeric",
                month: "2-digit",
                day: "2-digit",
                hour: "2-digit",
                minute: "2-digit",
                hour12: false,
                timeZoneName: "short",
              });

              const newJobAd = createJobAd(adData, formattedDate, index + 1);
              jobAdsContainer.appendChild(newJobAd);
            }
          });
        } else {
          console.error("No ad data was retrieved.");
        }
      })
      .catch((error) => {
        console.error("Error retrieving ads:", error);
      });
  }
});

function createJobAd(data, formattedDate, applicationAdvertisements) {
  const jobAd = document.createElement("div");
  jobAd.className = "job-ad";

  const jobTitle = document.createElement("div");
  jobTitle.className = "job-title";
  jobTitle.textContent = data.title;

  const jobDescription = document.createElement("div");
  jobDescription.className = "job-description";
  jobDescription.textContent = data.shortDescription;

  const detailsContainer = document.createElement("div");
  detailsContainer.className = "advertisement-details hidden";
  detailsContainer.innerHTML = `
      <p>${data.fullDescription}</p>
      <p>Wage: $${data.wage} per year</p>
      <p>Departement: ${data.departement}</p>
      <p>Working Place: ${data.place}</p>
      <p>Working Time: ${data.workTime}</p>
      <p>Date of publication: ${formattedDate}</p>
    `;
  if (applicationAdvertisements.length) {
    applicationAdvertisements.forEach((applicationAdvertisement) => {
      detailsContainer.innerHTML += `
        <div class="Apply">
          <div class="status">
            <p id="reloadStatus-${applicationAdvertisement.id}">Status : ${
        applicationAdvertisement.status
      }</p>
            <select  id="status-${applicationAdvertisement.id}" name="status">
              <option ${
                applicationAdvertisement.status === "PENDING"
                  ? "selected='selected'"
                  : ""
              } value="PENDING">PENDING</option>
              <option ${
                applicationAdvertisement.status === "ACCEPTED"
                  ? "selected='selected'"
                  : ""
              } value="ACCEPTED">ACCEPTED</option>
              <option ${
                applicationAdvertisement.status === "REJECTED"
                  ? "selected='selected'"
                  : ""
              } value="REJECTED">REJECTED</option>
            </select>
            <button class="upload" onclick="onClickStatus(${
              applicationAdvertisement.id
            })">Save</button>
          </div>
          <p>Message: ${applicationAdvertisement.message}</p>
        </div>
      `;
    });
  }

  const learnMoreButton = document.createElement("button");
  learnMoreButton.className = "learn-more-btn";
  learnMoreButton.textContent = "Learn More";
  learnMoreButton.onclick = function () {
    toggleAdvertisementDetails(this);
  };

  const updateButton = document.createElement("button");
  updateButton.className = "update-btn";
  updateButton.textContent = "Update";
  updateButton.onclick = function () {
    updateAdvertisement(data);
  };

  const deleteButton = document.createElement("button");
  deleteButton.className = "delete-btn";
  deleteButton.textContent = "Delete";
  deleteButton.onclick = function () {
    deleteAdvertisement(this, data.id);
  };

  const buttonsContainer = document.createElement("div");
  buttonsContainer.className = "button";

  buttonsContainer.appendChild(learnMoreButton);
  buttonsContainer.appendChild(updateButton);
  buttonsContainer.appendChild(deleteButton);

  jobAd.appendChild(jobTitle);
  jobAd.appendChild(jobDescription);
  jobAd.appendChild(detailsContainer);
  jobAd.appendChild(buttonsContainer);

  return jobAd;
}

function toggleAdvertisementDetails(button) {
  const jobAd = button.closest(".job-ad");

  const detailsContainer = jobAd.querySelector(".advertisement-details");

  if (detailsContainer.classList.contains("hidden")) {
    detailsContainer.classList.remove("hidden");
    button.innerText = "Hide";
  } else {
    detailsContainer.classList.add("hidden");
    button.innerText = "Learn More";
  }
}

function updateAdvertisement(data) {
  window.location.href = `AdDetails.html?id=${data.id}`;
}

function deleteAdvertisement(button, adId) {
  const jobAd = button.closest(".job-ad");
  var confirmation = window.confirm("Are you sure ?");
  if (confirmation) {
    fetch(`http://localhost:3000/companiesads/${adId}`, {
      method: "DELETE",
    })
      .then((response) => {
        if (response.ok) {
          jobAd.remove();
        } else {
          console.error("Failed to delete advertisement");
        }
      })
      .catch((error) => {
        console.error("Error deleting advertisement:", error);
      });
  }
}

function onClickCreate() {
  var title = document.getElementById("title").value;
  var shortDescription = document.getElementById("shortDescription").value;
  var fullDescription = document.getElementById("fullDescription").value;
  var wage = document.getElementById("wage").value;
  var department = document.getElementById("department").value;
  var place = document.getElementById("place").value;
  var worktime = document.getElementById("work-time").value;
  var authorId = JSON.parse(localStorage.getItem("user")).id;
  var companyId = JSON.parse(localStorage.getItem("company")).id;

  fetch("http://localhost:3000/createads", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      title,
      shortDescription,
      fullDescription,
      wage,
      department,
      place,
      worktime,
      authorId,
      companyId,
    }),
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.error) {
        console.error(data.error);
        alert("There is some information missing");
      } else {
        location.reload();
      }
    })
    .catch((error) => {
      console.error("Error :", error);
    });
}

function getCompanyApplications(companyId) {
  const companyApplicationsContainer = document.getElementById(
    "companyApplicationsContainer"
  );

  fetch(`http://localhost:3000/companyapplications/${companyId}`)
    .then((response) => response.json())
    .then((data) => {
      while (companyApplicationsContainer.firstChild) {
        companyApplicationsContainer.removeChild(
          companyApplicationsContainer.firstChild
        );
      }

      const groups = data.reduce((acc, application) => {
        (acc[application.advertisementId] =
          acc[application.advertisementId] || []).push(application);
        return acc;
      }, {});
      Object.keys(groups).forEach((key) => {
        const values = groups[key];
        const updatedAt = new Date(values[0].Advertisement.updatedAt);
        const formattedDate = updatedAt.toLocaleString("en-US", {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
          timeZoneName: "short",
        });
        const jobAdElement = createJobAd(
          values[0].Advertisement,
          formattedDate,
          values
        );
        companyApplicationsContainer.appendChild(jobAdElement);
      });
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}

function onProfilePageLoad() {
  checkAndShowCompany();

  const companyData = JSON.parse(localStorage.getItem("company"));
  if (companyData) {
    getCompanyApplications(companyData.id);
  }
}

function onClickStatus(applicationId) {
  var status = document.getElementById("status-" + applicationId).value;

  fetch(`http://localhost:3000/updateApply/${applicationId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ status }),
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.error) {
        console.error(data.error);
      } else {
        document.getElementById("reloadStatus-" + applicationId).innerHTML =
          "Status :" + status;
      }
    })
    .catch((error) => {
      console.error("Error :", error);
    });
}

window.onload = onProfilePageLoad;
