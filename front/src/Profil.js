function onClickToggle(div_Id_To_Show, div_Id_To_Hide) {
  const div_To_Show = document.getElementById(div_Id_To_Show);
  const div_To_Hide = document.getElementById(div_Id_To_Hide);

  div_To_Hide.style.display = "none";
  div_To_Show.style.display = "block";
}

function onClickUpdate(div_Id_To_Show, div_Id_To_Hide) {
  onClickToggle(div_Id_To_Show, div_Id_To_Hide);
  const userdata = JSON.parse(localStorage.getItem("user"));
  document.getElementById("updatename").value = userdata.name;
  document.getElementById("updateemail").value = userdata.email;
  document.getElementById("updatephone").value = userdata.phone;
  document.getElementById("updateDepartement").value = userdata.departement;
}

function onClickDisconnect() {
  localStorage.clear();
  location.reload();
}

function submitUser() {
  var username = document.getElementById("name").value;
  var email = document.getElementById("email").value;
  var departement = document.getElementById("departement").value;
  var phone = document.getElementById("phone").value;
  var password = document.getElementById("password").value;

  fetch("http://localhost:3000/creatuser", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ username, email, departement, phone, password }),
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.error) {
        console.error(data.error);
        alert(data.error);
      } else {
        localStorage.setItem("user", JSON.stringify(data));
        location.reload();
      }
    })
    .catch((error) => {
      console.error("Error :", error);
    });
}

function CheckUser() {
  var email = document.getElementById("loginemail").value;
  var password = document.getElementById("loginpassword").value;

  fetch(`http://localhost:3000/checkuser?email=${email}&password=${password}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.error) {
        console.error(data.error);
        alert(data.error);
      } else {
        localStorage.setItem("user", JSON.stringify(data));
        const userData = JSON.parse(localStorage.getItem("user"));
        if (userData.companyId && userData.companyId != null) {
          localStorage.setItem("company", JSON.stringify(data.company));
        }
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
      `http://localhost:3000/deleteuser?id=${
        JSON.parse(localStorage.getItem("user")).id
      }`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      }
    )
      .then((response) => response.json())
      .then((data) => {
        localStorage.removeItem("user");

        const loginDiv = document.querySelector("#LoginUser");
        const profileDiv = document.querySelector("#profil");

        loginDiv.style.display = "block";
        profileDiv.style.display = "none";
      })
      .catch((error) => {
        console.error("Error during delete request :", error);
      });
  } else {
  }
}

function updateUser() {
  const userdata = JSON.parse(localStorage.getItem("user"));
  var name = document.getElementById("updatename").value;
  var email = document.getElementById("updateemail").value;
  var phone = document.getElementById("updatephone").value;
  var departement = document.getElementById("updateDepartement").value;

  fetch(`http://localhost:3000/updateuser?id=${userdata.id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ name, email, phone, departement }),
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.error) {
        console.error(data.error);
        alert(data.error);
      } else {
        localStorage.setItem("user", JSON.stringify(data));
        onClickToggle("profil", "profilupdate");
        checkAndShowUserProfile();
      }
    })
    .catch((error) => {
      console.error("Error :", error);
    });
}

function toggleAdvertisementDetails(button) {
  const detailsContainer = button.parentElement.parentElement.querySelector(
    ".advertisement-details"
  );
  const learnMoreButton = button.parentElement.querySelector(".learn-more-btn");
  const hideButton = button.parentElement.querySelector(".hide-btn");

  if (
    detailsContainer.style.display === "none" ||
    detailsContainer.style.display === ""
  ) {
    detailsContainer.style.display = "block";
    learnMoreButton.style.display = "none";
    hideButton.style.display = "block";
  } else {
    detailsContainer.style.display = "none";
    learnMoreButton.style.display = "block";
    hideButton.style.display = "none";
  }
}

function createJobAd(data, formattedDate, status, message) {
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
    <p>Wage: $${data.wage} per month</p>
    <p>Departement: ${data.departement}</p>
    <p>Place: ${data.place}</p>
    <p>Working Time: ${data.workTime}</p>
    <p>Date of publication: ${formattedDate}</p>
    <div class="Apply">
    <p class="status">Status: ${status}</p>
    <p>Message: ${message}</p>
    <div>
  `;

  const buttonCommonClass = "button-common";
  const buttonsContainer = document.createElement("div");
  buttonsContainer.className = "buttons";

  const learnMoreButton = document.createElement("button");
  learnMoreButton.className = `learn-more-btn ${buttonCommonClass}`;
  learnMoreButton.textContent = "Learn More";
  learnMoreButton.onclick = function () {
    toggleAdvertisementDetails(this);
  };

  const hideButton = document.createElement("button");
  hideButton.className = `hide-btn ${buttonCommonClass} hidden`;
  hideButton.textContent = "Hide";
  hideButton.onclick = function () {
    toggleAdvertisementDetails(this);
  };

  buttonsContainer.appendChild(learnMoreButton);
  buttonsContainer.appendChild(hideButton);

  jobAd.appendChild(jobTitle);
  jobAd.appendChild(jobDescription);
  jobAd.appendChild(detailsContainer);
  jobAd.appendChild(buttonsContainer);

  return jobAd;
}

function getUserApplications(userId) {
  const userApplicationsContainer = document.getElementById(
    "userApplicationsContainer"
  );

  fetch(`http://localhost:3000/userapplications/${userId}`)
    .then((response) => response.json())
    .then((data) => {
      while (userApplicationsContainer.firstChild) {
        userApplicationsContainer.removeChild(
          userApplicationsContainer.firstChild
        );
      }

      data.forEach((application) => {
        const updatedAt = new Date(application.Advertisement.updatedAt);
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
          application.Advertisement,
          formattedDate,
          application.status,
          application.message
        );
        userApplicationsContainer.appendChild(jobAdElement);
      });
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}

function checkAndShowUserProfile() {
  const userData = JSON.parse(localStorage.getItem("user"));
  const loginDiv = document.querySelector("#LoginUser");
  const profileDiv = document.querySelector("#profil");

  if (userData) {
    const profileName = document.getElementById("profileName");
    const profileEmail = document.getElementById("profileEmail");
    const profilePhone = document.getElementById("profilePhone");
    const profileDepartement = document.getElementById("profileDepartement");
    const profileRole = document.getElementById("profileRole");
    const profileCompany = document.getElementById("profileCompany");

    profileName.textContent = "Id : " + userData.id;
    profileName.textContent = "Nom : " + userData.name;
    profileDepartement.textContent = "Département : " + userData.departement;
    profileEmail.textContent = "Email : " + userData.email;
    profilePhone.textContent = "Numéro de téléphone : " + userData.phone;
    profileCompany.textContent = "Company : " + (userData.company?.name ?? "");
    profileRole.textContent = "Rôle : " + userData.role;

    loginDiv.style.display = "none";
    profileDiv.style.display = "block";
  } else {
  }
}

function onProfilePageLoad() {
  checkAndShowUserProfile();

  const userData = JSON.parse(localStorage.getItem("user"));
  if (userData) {
    getUserApplications(userData.id);
  }
}

window.onload = onProfilePageLoad;
