document.addEventListener("DOMContentLoaded", function () {
  const jobAdsContainer = document.body;
  const searchForm = document.getElementById("search-form");
  const workTimeSelect = document.getElementById("work-time");

  searchForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const selectedWorkTime = workTimeSelect.value;
    const keyword = document.getElementById("keyword").value.toLowerCase();
    const selectedDepartment = document.getElementById("distance").value;
    const selectedSalary = document.getElementById("salary").value;

    const existingJobAds = document.querySelectorAll(".job-ad");
    existingJobAds.forEach((jobAd) => {
      jobAdsContainer.removeChild(jobAd);
    });

    fetch("http://localhost:3000/ads")
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
            if (
              (selectedWorkTime === "" ||
                adData.workTime === selectedWorkTime) &&
              (selectedDepartment === "" ||
                adData.departement == selectedDepartment) &&
              (keyword === "" ||
                adData.title.toLowerCase().includes(keyword) ||
                (adData.shortDescription &&
                  adData.shortDescription.toLowerCase().includes(keyword)) ||
                (adData.fullDescription &&
                  adData.fullDescription.toLowerCase().includes(keyword))) &&
              (selectedSalary === "" ||
                (selectedSalary === "0-1000" &&
                  adData.wage >= 0 &&
                  adData.wage <= 1000) ||
                (selectedSalary === "1000-2000" &&
                  adData.wage > 1000 &&
                  adData.wage <= 2000) ||
                (selectedSalary === "2000-3000" &&
                  adData.wage > 2000 &&
                  adData.wage <= 3000) ||
                (selectedSalary === "3000-4000" &&
                  adData.wage > 3000 &&
                  adData.wage <= 4000) ||
                (selectedSalary === "4000-5000" &&
                  adData.wage > 4000 &&
                  adData.wage <= 5000) ||
                (selectedSalary === "5000-6000" &&
                  adData.wage > 5000 &&
                  adData.wage <= 6000) ||
                (selectedSalary === "6000-7000" &&
                  adData.wage > 6000 &&
                  adData.wage <= 7000) ||
                (selectedSalary === "8000-9000" &&
                  adData.wage > 8000 &&
                  adData.wage <= 9000) ||
                (selectedSalary === "9000-10000" &&
                  adData.wage > 90000 &&
                  adData.wage <= 10000) ||
                (selectedSalary === "10000" && adData.wage >= 10000))
            ) {
              const newJobAd = createJobAd(adData, index + 1);
              jobAdsContainer.appendChild(newJobAd);
            }
          });
        } else {
          console.error("No ad data was retrieved.");
        }
      })
      .catch((error) => {
        console.error("Error :", error);
      });
  });

  fetch("http://localhost:3000/ads")
    .then((response) => {
      if (!response.ok) {
        console.error("Server response not OK. Status : ", response.status);
        throw new Error("Server response not OK.");
      }
      return response.json();
    })
    .then((data) => {
      if (Array.isArray(data)) {
        data.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));

        data.forEach((adData, index) => {
          const newJobAd = createJobAd(adData, index + 1);
          jobAdsContainer.appendChild(newJobAd);
        });
      } else {
        console.error("No ad data was retrieved.");
      }
    })
    .catch((error) => {
      console.error("Error retrieving ads :", error);
    });
});

function createJobAd(data) {
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

  const updatedAt = new Date(data.updatedAt);

  const parisTimeZone = "Europe/Paris";
  const options = {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    timeZoneName: "short",
  };

  const formattedDate = updatedAt.toLocaleString("en-US", options);

  detailsContainer.innerHTML = `
      <p>${data.fullDescription}</p>
      <p>Wage: $${data.wage} per month</p>
      <p>Departement: ${data.departement}</p>
      <p>Place: ${data.place}</p>
      <p>Working Time: ${data.workTime}</p>
      <p>Date of publication: ${formattedDate}</p>
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

  const applyButton = document.createElement("button");
  applyButton.className = `apply-btn ${buttonCommonClass}`;
  applyButton.textContent = "Apply";
  applyButton.onclick = function () {
    openApplyForm(this, data.id);
  };

  buttonsContainer.appendChild(learnMoreButton);
  buttonsContainer.appendChild(applyButton);

  jobAd.appendChild(jobTitle);
  jobAd.appendChild(jobDescription);
  jobAd.appendChild(detailsContainer);
  jobAd.appendChild(buttonsContainer);

  return jobAd;
}

function getLocalTimeZoneAbbreviation() {
  const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const timeZoneAbbreviation = timeZone.replace(/.*\//, "");
  return timeZoneAbbreviation;
}

function openApplyForm(button, advertisementId) {
  const user = JSON.parse(localStorage.getItem("user"));
  if (user) {
    const existingApplyForm = document.querySelector(".apply-form");
    if (existingApplyForm) {
      return;
    }

    const applyForm = document.createElement("div");
    applyForm.className = "apply-form";
    applyForm.innerHTML = `
      <h3>Apply for this job</h3>
      <textarea id="apply-message" placeholder="Your message"></textarea>
      <button id="submit-application" class="upload">Submit</button>
      <button id="cancel-application">Cancel</button>
    `;

    const jobAd = button.closest(".job-ad");
    const applyButton = jobAd.querySelector(".apply-btn");

    applyButton.style.display = "none";

    jobAd.appendChild(applyForm);

    const submitButton = applyForm.querySelector("#submit-application");
    submitButton.addEventListener("click", function () {
      const message = document.getElementById("apply-message").value;

      fetch("http://localhost:3000/apply", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          advertisementId,
          message,
          userId: user.id,
        }),
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.success) {
            alert("Application submitted successfully!");
            applyForm.remove();
            applyButton.style.display = "block";
          } else {
            alert("Failed to submit application. Please try again.");
          }
        })
        .catch((error) => {
          console.error("Error submitting application:", error);
          alert("An error occurred. Please try again later.");
        });
    });

    const cancelButton = applyForm.querySelector("#cancel-application");
    cancelButton.addEventListener("click", function () {
      applyForm.remove();
      applyButton.style.display = "block";
    });
  } else {
    alert("You must be logged in to apply for this job.");
  }
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
