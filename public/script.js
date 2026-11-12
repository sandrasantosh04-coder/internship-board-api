
/* =========================================
   1. INTERNSHIP DATA
========================================= */

let internships = [];


/* =========================================
   2. SEARCH ELEMENTS
========================================= */

const searchForm = document.getElementById("search-form");
const searchInput = document.getElementById("search-input");
const domainFilter = document.getElementById("domain-filter");
const modeFilter = document.getElementById("mode-filter");
const clearButton = document.getElementById("clear-button");
const internshipList = document.getElementById("internship-list");
const resultMessage = document.getElementById("result-message");
const emptyMessage = document.getElementById("empty-message");

/* Loading, error and retry elements */

const loadingMessage = document.getElementById("loading-message");
const errorMessage = document.getElementById("error-message");
const retryButton = document.getElementById("retry-button");


/* =========================================
   3. INTERNSHIP DETAILS DIALOG
========================================= */

const internshipDialog = document.getElementById("internship-dialog");

const closeDialogButton = document.getElementById("close-dialog");
const dialogCloseButton = document.getElementById("dialog-close-button");
const applyButton = document.getElementById("apply-button");

/* Internship detail elements */

const detailId = document.getElementById("detail-id");
const detailDomain = document.getElementById("detail-domain");
const detailMode = document.getElementById("detail-mode");
const detailLocation = document.getElementById("detail-location");
const detailSkills = document.getElementById("detail-skills");
const detailOpenings = document.getElementById("detail-openings");


/* =========================================
   4. APPLICATION FORM ELEMENTS
========================================= */

const applicationDialog = document.getElementById("application-dialog");

const closeApplicationButton =
    document.getElementById("close-application");

const cancelApplicationButton =
    document.getElementById("cancel-application");

const applicationForm =
    document.getElementById("application-form");

const applicationInternshipTitle =
    document.getElementById("application-internship-title");

const applicationMessage =
    document.getElementById("application-message");

const applicantName =
    document.getElementById("applicant-name");

const applicantEmail =
    document.getElementById("applicant-email");

const applicantPhone =
    document.getElementById("applicant-phone");

const applicantResume =
    document.getElementById("applicant-resume");

const applicantCoverLetter =
    document.getElementById("applicant-cover-letter");

const submitApplicationButton =
    document.getElementById("submit-application");


/* =========================================
   5. APPLICATION STATE
========================================= */

let selectedInternship = null;
let isLoading = false;


/* =========================================
   6. SHOW LOADING STATE
========================================= */

function showLoadingState() {

    loadingMessage.hidden = false;
    errorMessage.hidden = true;
    retryButton.hidden = true;
    emptyMessage.hidden = true;

    resultMessage.textContent = "";

    internshipList.replaceChildren();
}


/* =========================================
   7. SHOW ERROR STATE
========================================= */

function showErrorState() {

    loadingMessage.hidden = true;
    errorMessage.hidden = false;
    retryButton.hidden = false;
    emptyMessage.hidden = true;

    resultMessage.textContent = "";

    internshipList.replaceChildren();
}


/* =========================================
   8. HIDE LOADING AND ERROR STATES
========================================= */

function hideLoadingAndErrorStates() {

    loadingMessage.hidden = true;
    errorMessage.hidden = true;
    retryButton.hidden = true;
}


/* =========================================
   9. DISPLAY INTERNSHIP CARDS
========================================= */

function displayInternships(internshipData) {

    internshipList.replaceChildren();

    hideLoadingAndErrorStates();

    resultMessage.textContent =
        `${internshipData.length} internship(s) found`;

    emptyMessage.hidden = internshipData.length !== 0;

    internshipData.forEach(function (internship) {

        /* Create card */

        const card = document.createElement("article");

        card.className = "internship-card";


        /* Internship title */

        const title = document.createElement("h3");

        title.textContent = internship.title;


        /* Internship ID */

        const id = document.createElement("p");

        id.textContent = `ID: ${internship.id}`;


        /* Domain */

        const domain = document.createElement("p");

        domain.textContent = `Domain: ${internship.domain}`;


        /* Work mode */

        const mode = document.createElement("p");

        mode.textContent = `Work Mode: ${internship.mode}`;


        /* Location */

        const location = document.createElement("p");

        location.textContent = `Location: ${internship.location}`;


        /* Skills heading */

        const skillsHeading = document.createElement("p");

        skillsHeading.textContent = "Required Skills:";


        /* Skills list */

        const skillsList = document.createElement("ul");

        skillsList.className = "skills-list";

        const skills = Array.isArray(internship.skills)
            ? internship.skills
            : [];

        skills.forEach(function (skill) {

            const skillItem = document.createElement("li");

            skillItem.textContent = skill;

            skillsList.appendChild(skillItem);

        });


        /* Openings */

        const openings = document.createElement("p");

        openings.textContent =
            `Openings: ${internship.openings}`;


        /* Actions */

        const actions = document.createElement("div");

        actions.className = "card-actions";


        /* View details button */

        const viewButton = document.createElement("button");

        viewButton.type = "button";

        viewButton.className = "btn-primary";

        viewButton.textContent = "View Details";

        viewButton.addEventListener("click", function () {

            openInternshipDetails(internship);

        });

        actions.appendChild(viewButton);


        /* Add elements to card */

        card.append(
            title,
            id,
            domain,
            mode,
            location,
            skillsHeading,
            skillsList,
            openings,
            actions
        );


        /* Add card to internship list */

        internshipList.appendChild(card);

    });

}


/* =========================================
   10. LOAD INTERNSHIPS FROM BACKEND API
========================================= */

async function loadInternships() {

    if (isLoading) {

        return;

    }

    isLoading = true;

    showLoadingState();

    try {

        const response = await fetch(
            "/api/internships?limit=100"
        );

        if (!response.ok) {

            throw new Error(
                "Unable to fetch internship data."
            );

        }

        const result = await response.json();

        if (
            !result.success ||
            !Array.isArray(result.data)
        ) {

            throw new Error(
                "Invalid API response."
            );

        }

        internships = result.data;

        displayInternships(internships);

    } catch (error) {

        console.error(
            "Unable to load internships:",
            error.message
        );

        showErrorState();

    } finally {

        isLoading = false;

    }

}


/* =========================================
   11. OPEN INTERNSHIP DETAILS
========================================= */

function openInternshipDetails(internship) {

    selectedInternship = internship;

    detailId.textContent = internship.id;

    detailDomain.textContent = internship.domain;

    detailMode.textContent = internship.mode;

    detailLocation.textContent = internship.location;

    detailOpenings.textContent = internship.openings;


    /* Clear previous skills */

    detailSkills.replaceChildren();


    /* Display skills */

    const skills = Array.isArray(internship.skills)
        ? internship.skills
        : [];

    skills.forEach(function (skill) {

        const skillItem = document.createElement("li");

        skillItem.textContent = skill;

        detailSkills.appendChild(skillItem);

    });

    internshipDialog.showModal();

}


/* =========================================
   12. CLOSE INTERNSHIP DETAILS
========================================= */

function closeInternshipDetails() {

    if (internshipDialog.open) {

        internshipDialog.close();

    }

}


/* =========================================
   13. SEARCH AND FILTER INTERNSHIPS
========================================= */

function searchInternships() {

    if (isLoading) {

        return;

    }

    const searchText = searchInput.value
        .trim()
        .toLowerCase();

    const selectedDomain = domainFilter.value;

    const selectedMode = modeFilter.value;


    /* Filter internship data */

    const filteredInternships = internships.filter(
        function (internship) {

            const skills = Array.isArray(internship.skills)
                ? internship.skills
                : [];

            const searchableText = [
                internship.id,
                internship.title,
                internship.domain,
                internship.mode,
                internship.location,
                ...skills
            ].join(" ").toLowerCase();


            const matchesSearch =
                searchableText.includes(searchText);


            const matchesDomain =
                selectedDomain === "" ||
                internship.domain === selectedDomain;


            const matchesMode =
                selectedMode === "" ||
                internship.mode === selectedMode;


            return (
                matchesSearch &&
                matchesDomain &&
                matchesMode
            );

        }
    );

    displayInternships(filteredInternships);

}


/* =========================================
   14. SEARCH FORM
========================================= */

searchForm.addEventListener("submit", function (event) {

    event.preventDefault();

    searchInternships();

});


/* =========================================
   15. DOMAIN FILTER
========================================= */

domainFilter.addEventListener("change", function () {

    searchInternships();

});


/* =========================================
   16. WORK MODE FILTER
========================================= */

modeFilter.addEventListener("change", function () {

    searchInternships();

});


/* =========================================
   17. RESET SEARCH
========================================= */

clearButton.addEventListener("click", function () {

    searchInput.value = "";

    domainFilter.value = "";

    modeFilter.value = "";

    searchInternships();

});


/* =========================================
   18. RETRY BUTTON
========================================= */

retryButton.addEventListener("click", function () {

    loadInternships();

});


/* =========================================
   19. CLOSE DETAILS BUTTONS
========================================= */

closeDialogButton.addEventListener(
    "click",
    closeInternshipDetails
);

dialogCloseButton.addEventListener(
    "click",
    closeInternshipDetails
);


/* Close details when clicking backdrop */

internshipDialog.addEventListener("click", function (event) {

    if (event.target === internshipDialog) {

        closeInternshipDetails();

    }

});


/* =========================================
   20. OPEN APPLICATION FORM
========================================= */

applyButton.addEventListener("click", function () {

    if (!selectedInternship) {

        return;

    }

    applicationInternshipTitle.textContent =
        selectedInternship.title;

    applicationMessage.textContent = "";

    applicationMessage.className = "";

    applicationForm.reset();

    closeInternshipDetails();

    applicationDialog.showModal();

});


/* =========================================
   21. CLOSE APPLICATION DIALOG
========================================= */

function closeApplicationDialog() {

    if (applicationDialog.open) {

        applicationDialog.close();

    }

}


closeApplicationButton.addEventListener(
    "click",
    closeApplicationDialog
);

cancelApplicationButton.addEventListener(
    "click",
    closeApplicationDialog
);


/* Close application dialog using backdrop */

applicationDialog.addEventListener("click", function (event) {

    if (event.target === applicationDialog) {

        closeApplicationDialog();

    }

});


/* =========================================
   22. APPLICATION MESSAGE
========================================= */

function showApplicationMessage(message, type) {

    applicationMessage.textContent = message;

    applicationMessage.className = type;

}


/* =========================================
   23. VALIDATE PHONE NUMBER
========================================= */

function validatePhone() {

    const phone = applicantPhone.value.trim();

    const phonePattern = /^[0-9]{10}$/;

    if (!phonePattern.test(phone)) {

        showApplicationMessage(
            "Enter a valid 10-digit phone number.",
            "error"
        );

        applicantPhone.focus();

        return false;

    }

    return true;

}


/* =========================================
   24. VALIDATE RESUME
========================================= */

function validateResume() {

    const file = applicantResume.files[0];

    if (!file) {

        showApplicationMessage(
            "Please upload your resume.",
            "error"
        );

        return false;

    }


    /* Maximum size: 2 MB */

    const maxSize = 2 * 1024 * 1024;

    if (file.size > maxSize) {

        showApplicationMessage(
            "Resume must be smaller than 2 MB.",
            "error"
        );

        return false;

    }


    /* Check file extension */

    const fileName = file.name.toLowerCase();

    if (!fileName.endsWith(".pdf")) {

        showApplicationMessage(
            "Please upload a PDF resume.",
            "error"
        );

        return false;

    }


    /* Check browser-reported file type */

    if (
        file.type &&
        file.type !== "application/pdf"
    ) {

        showApplicationMessage(
            "The selected file must be a PDF.",
            "error"
        );

        return false;

    }

    return true;

}


/* =========================================
   25. APPLICATION FORM SUBMISSION
========================================= */

applicationForm.addEventListener("submit", async function (event) {

    event.preventDefault();

    /* Clear previous message */

    showApplicationMessage("", "");


    /* Browser validation */

    if (!applicationForm.checkValidity()) {

        applicationForm.reportValidity();

        return;

    }


    /* Phone validation */

    if (!validatePhone()) {

        return;

    }


    /* Resume validation */

    if (!validateResume()) {

        return;

    }


    /* Check internship selection */

    if (!selectedInternship) {

        showApplicationMessage(
            "Please select an internship first.",
            "error"
        );

        return;

    }


    /* Prepare application data */

    const formData = new FormData();

    formData.append(
        "internship_id",
        selectedInternship.id
    );

    formData.append(
        "name",
        applicantName.value.trim()
    );

    formData.append(
        "email",
        applicantEmail.value.trim()
    );

    formData.append(
        "phone",
        applicantPhone.value.trim()
    );

    formData.append(
        "cover_letter",
        applicantCoverLetter.value.trim()
    );

    formData.append(
        "resume",
        applicantResume.files[0]
    );


    /* Disable button during submission */

    submitApplicationButton.disabled = true;

    submitApplicationButton.textContent = "Submitting...";


    try {

        const response = await fetch(
            "/api/applications",
            {
                method: "POST",
                body: formData
            }
        );

        const result = await response.json();

        if (!response.ok) {

            throw new Error(
                result.message || "Application submission failed."
            );

        }

        showApplicationMessage(
            result.message,
            "success"
        );

        applicationForm.reset();

    } catch (error) {

        console.error(
            "Application submission error:",
            error
        );

        showApplicationMessage(
            error.message || "Unable to submit application. Please try again.",
            "error"
        );

    } finally {

        submitApplicationButton.disabled = false;

        submitApplicationButton.textContent = "Submit Application";

    }

});


/* =========================================
   26. INITIAL PAGE LOAD
========================================= */

loadInternships();
